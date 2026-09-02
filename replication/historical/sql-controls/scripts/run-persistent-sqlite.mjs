import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import { DatabaseSync } from "node:sqlite";
import { generate } from "../src/generator.mjs";
import { sha256 } from "../src/cobria.mjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const cfg=JSON.parse(fs.readFileSync(path.join(root,"protocol","preregistered-phase2.json"),"utf8"));
const rawDir=path.join(root,"results","phase2","raw"),manifestDir=path.join(root,"results","phase2","manifests");
fs.mkdirSync(rawDir,{recursive:true});fs.mkdirSync(manifestDir,{recursive:true});
const rawPath=path.join(rawDir,"persistent-sqlite.jsonl");fs.writeFileSync(rawPath,"");
const runId="sqlite-"+new Date().toISOString().replace(/[:.]/g,"-");let rows=0;
const emit=x=>{fs.appendFileSync(rawPath,JSON.stringify({runId,...x})+"\n");rows++;};
const quantile=(a,p)=>{const s=[...a].sort((x,y)=>x-y),i=(s.length-1)*p,l=Math.floor(i),h=Math.ceil(i);return s[l]+(s[h]-s[l])*(i-l);};
const timed=fn=>{const t=performance.now(),value=fn();return{durationMs:performance.now()-t,value};};
const schema=[
  "CREATE TABLE canonical(scope TEXT NOT NULL,id TEXT NOT NULL,status TEXT NOT NULL,category TEXT,value INTEGER,event_time INTEGER,revision INTEGER,schema_version INTEGER,payload TEXT,PRIMARY KEY(scope,id));",
  "CREATE TABLE projection(scope TEXT NOT NULL,status TEXT NOT NULL,id TEXT NOT NULL,revision INTEGER,value INTEGER,source_hash TEXT,PRIMARY KEY(scope,status,id));",
  "CREATE TABLE changes(seq INTEGER PRIMARY KEY AUTOINCREMENT,scope TEXT,id TEXT,revision INTEGER);",
  "CREATE TABLE processed(event_id TEXT PRIMARY KEY);"
].join("\n");
const projectSql="INSERT INTO projection(scope,status,id,revision,value,source_hash) SELECT scope,status,id,revision,value,printf('%s:%d',id,revision) FROM canonical WHERE scope=?";
function openDb(file){const db=new DatabaseSync(file);db.exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA temp_store=MEMORY;");db.exec(schema);return db;}
function load(db,entities){const s=db.prepare("INSERT INTO canonical VALUES(?,?,?,?,?,?,?,?,?)");db.exec("BEGIN");for(const e of entities)s.run(e.scope,e.id,e.status,e.category,e.value,e.eventTime,e.revision,e.schemaVersion,JSON.stringify(e));db.exec("COMMIT");}
function rebuild(db,scope){return timed(()=>{db.exec("BEGIN");db.prepare("DELETE FROM projection WHERE scope=?").run(scope);db.prepare(projectSql).run(scope);db.exec("COMMIT");}).durationMs;}
function verify(db,scope){const expected=Number(db.prepare("SELECT count(*) n FROM canonical WHERE scope=?").get(scope).n),observed=Number(db.prepare("SELECT count(*) n FROM projection WHERE scope=?").get(scope).n);const sql="SELECT count(*) n FROM canonical c LEFT JOIN projection p ON p.scope=c.scope AND p.id=c.id AND p.status=c.status WHERE c.scope=? AND (p.id IS NULL OR p.revision<>c.revision OR p.value<>c.value)";const different=Number(db.prepare(sql).get(scope).n);return{expected,observed,different,accuracy:1-Math.abs(expected-observed)/Math.max(expected,1)-different/Math.max(expected,1)};}
const tmp=path.join(root,"tmp");fs.mkdirSync(tmp,{recursive:true});
for(const profile of cfg.profiles)for(const N of cfg.sizes)for(let rep=0;rep<cfg.repetitions;rep++){
  const file=path.join(tmp,["sqlite",process.pid,profile,N,rep].join("-")+".db"),db=openDb(file),generated=generate({seed:cfg.seed+N+rep,N,tenants:cfg.tenants,profile}),scope="t-00",status="active";
  load(db,generated.entities);rebuild(db,scope);db.exec("CREATE INDEX idx_canonical_scope_status ON canonical(scope,status)");
  const statements={B0:db.prepare("SELECT id,revision,value FROM canonical NOT INDEXED WHERE scope=? AND status=?"),B1:db.prepare("SELECT id,revision,value FROM canonical INDEXED BY idx_canonical_scope_status WHERE scope=? AND status=?"),C1:db.prepare("SELECT id,revision,value FROM projection WHERE scope=? AND status=?")};
  const baseOrder=["B0","B1","C1"],offset=(rep+N+cfg.profiles.indexOf(profile))%baseOrder.length,queryOrder=[...baseOrder.slice(offset),...baseOrder.slice(0,offset)];
  for(const configuration of queryOrder){const samples=[];let result=[];for(let i=0;i<cfg.queryIterations;i++){const x=timed(()=>statements[configuration].all(scope,status));samples.push(x.durationMs);result=x.value;}emit({experiment:"SQL-P1",profile,N,rep,configuration,executionOrder:queryOrder.indexOf(configuration),p50Ms:quantile(samples,.5),p95Ms:quantile(samples,.95),p99Ms:quantile(samples,.99),resultCount:result.length,bytesReturned:Buffer.byteLength(JSON.stringify(result)),rowsExaminedProxy:configuration==="B0"?N:result.length});}
  const targets=generated.entities.filter(e=>e.scope===scope).slice(0,2);
  for(const [i,configuration] of ["B1","C1"].entries()){const target=targets[i],nextValue=target.value+1,x=timed(()=>{db.exec("BEGIN");db.prepare("UPDATE canonical SET value=?,revision=revision+1 WHERE scope=? AND id=?").run(nextValue,scope,target.id);if(configuration==="C1")db.prepare("UPDATE projection SET value=?,revision=revision+1,source_hash=? WHERE scope=? AND id=?").run(nextValue,target.id+":"+(target.revision+1),scope,target.id);db.exec("COMMIT");});emit({experiment:"SQL-P2",profile,N,rep,configuration,durationMs:x.durationMs,logicalWrites:1,physicalWrites:configuration==="C1"?2:1});}
  const fullMs=rebuild(db,scope);emit({experiment:"SQL-R1",profile,N,rep,configuration:"C1",durationMs:fullMs,...verify(db,scope)});
  const count=Math.max(1,Math.floor(N/cfg.tenants*.01)),candidates=db.prepare("SELECT id FROM canonical WHERE scope=? ORDER BY id LIMIT ?").all(scope,count);
  db.exec("BEGIN");for(const c of candidates)db.prepare("UPDATE canonical SET value=value+3,revision=revision+1 WHERE scope=? AND id=?").run(scope,c.id);db.exec("COMMIT");
  const inc=timed(()=>{db.exec("BEGIN");for(const c of candidates)db.prepare("INSERT OR REPLACE INTO projection(scope,status,id,revision,value,source_hash) SELECT scope,status,id,revision,value,printf('%s:%d',id,revision) FROM canonical WHERE scope=? AND id=?").run(scope,c.id);db.exec("COMMIT");});
  emit({experiment:"SQL-R2",profile,N,rep,configuration:"C1",changeRatio:.01,durationMs:inc.durationMs,processed:candidates.length,...verify(db,scope)});
  db.close();for(const suffix of ["","-wal","-shm"])try{fs.unlinkSync(file+suffix)}catch{}
}
const manifest={runId,protocolHash:sha256(cfg),rawHash:sha256(fs.readFileSync(rawPath)),rows,environment:{node:process.version,cpu:os.cpus()[0]?.model,memoryBytes:os.totalmem(),platform:process.platform,arch:process.arch},rawFile:path.relative(root,rawPath)};
fs.writeFileSync(path.join(manifestDir,runId+".json"),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
