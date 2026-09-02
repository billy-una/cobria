import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import { finished } from "node:stream/promises";
import pg from "pg";
import { from as copyFrom } from "pg-copy-streams";
import { generate } from "../src/generator.mjs";
import { generateSemirealistic } from "../src/semirealistic-generator.mjs";
import { sha256 } from "../src/cobria.mjs";

const {Client}=pg;
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const cfg=JSON.parse(fs.readFileSync(path.join(root,"protocol","preregistered-phase3.json"),"utf8"));
const connectionString=process.env.COBRIA_POSTGRES_URL||"postgresql://cobria:cobria_local@127.0.0.1:55432/cobria";
const outDir=path.join(root,"results","phase3","raw"),manifestDir=path.join(root,"results","phase3","manifests");
fs.mkdirSync(outDir,{recursive:true});fs.mkdirSync(manifestDir,{recursive:true});
const rawPath=path.join(outDir,"postgres.jsonl");fs.writeFileSync(rawPath,"");
const runId="postgres-"+new Date().toISOString().replace(/[:.]/g,"-");let rowCount=0;
const emit=x=>{fs.appendFileSync(rawPath,JSON.stringify({runId,...x})+"\n");rowCount++;};
const quantile=(a,p)=>{const s=[...a].sort((x,y)=>x-y),i=(s.length-1)*p,l=Math.floor(i),h=Math.ceil(i);return s[l]+(s[h]-s[l])*(i-l);};
const timed=async fn=>{const t=performance.now(),value=await fn();return{durationMs:performance.now()-t,value};};
const client=new Client({connectionString});await client.connect();
await client.query(`DROP TABLE IF EXISTS projection_stage,projection,processed,canonical;
CREATE TABLE canonical(scope text NOT NULL,id text NOT NULL,status text NOT NULL,category text,value integer,event_time bigint,revision integer,schema_version integer,payload jsonb,PRIMARY KEY(scope,id));
CREATE TABLE projection(scope text NOT NULL,status text NOT NULL,id text NOT NULL,revision integer,value integer,source_hash text,PRIMARY KEY(scope,status,id));
CREATE TABLE processed(event_id text PRIMARY KEY);
CREATE INDEX idx_canonical_scope_status ON canonical(scope,status);`);
async function load(entities){
  const csv=v=>v==null?"":`"${String(v).replaceAll('"','""')}"`;
  const stream=client.query(copyFrom("COPY canonical(scope,id,status,category,value,event_time,revision,schema_version,payload) FROM STDIN WITH (FORMAT csv)"));
  for(const e of entities){const line=[e.scope,e.id,e.status,e.category,e.value,e.eventTime,e.revision,e.schemaVersion,JSON.stringify(e)].map(csv).join(",")+"\n";if(!stream.write(line))await new Promise(resolve=>stream.once("drain",resolve));}
  stream.end();await finished(stream);
}
async function rebuild(scope){return (await timed(async()=>{await client.query("BEGIN");await client.query("DELETE FROM projection WHERE scope=$1",[scope]);await client.query("INSERT INTO projection SELECT scope,status,id,revision,value,id||':'||revision FROM canonical WHERE scope=$1",[scope]);await client.query("COMMIT");})).durationMs;}
async function verify(scope){const a=await client.query("SELECT count(*)::int n FROM canonical WHERE scope=$1",[scope]),b=await client.query("SELECT count(*)::int n FROM projection WHERE scope=$1",[scope]),d=await client.query("SELECT count(*)::int n FROM canonical c LEFT JOIN projection p ON p.scope=c.scope AND p.id=c.id AND p.status=c.status WHERE c.scope=$1 AND (p.id IS NULL OR p.revision<>c.revision OR p.value<>c.value)",[scope]);const expected=a.rows[0].n,observed=b.rows[0].n,different=d.rows[0].n;return{expected,observed,different,accuracy:1-Math.abs(expected-observed)/Math.max(expected,1)-different/Math.max(expected,1)};}
for(const profile of cfg.profiles)for(const N of cfg.sizes)for(let rep=0;rep<cfg.repetitions;rep++){
  await client.query("TRUNCATE canonical,projection,processed");
  const generated=generate({seed:cfg.seed+N+rep,N,tenants:cfg.organizations,profile}),scope="t-00",status="active";await load(generated.entities);await rebuild(scope);
  const order0=["B0","B1","C1"],offset=(rep+N+cfg.profiles.indexOf(profile))%3,order=[...order0.slice(offset),...order0.slice(0,offset)];
  for(const configuration of order){const samples=[];let result=[];for(let i=0;i<cfg.queryIterations;i++){
      if(configuration==="B0")await client.query("SET enable_indexscan=off;SET enable_bitmapscan=off");else await client.query("SET enable_indexscan=on;SET enable_bitmapscan=on");
      const sql=configuration==="C1"?"SELECT id,revision,value FROM projection WHERE scope=$1 AND status=$2":"SELECT id,revision,value FROM canonical WHERE scope=$1 AND status=$2";
      const x=await timed(()=>client.query(sql,[scope,status]));samples.push(x.durationMs);result=x.value.rows;
    }
    emit({experiment:"PG-P1",profile,N,rep,configuration,executionOrder:order.indexOf(configuration),p50Ms:quantile(samples,.5),p95Ms:quantile(samples,.95),p99Ms:quantile(samples,.99),resultCount:result.length,bytesReturned:Buffer.byteLength(JSON.stringify(result)),rowsExaminedProxy:configuration==="B0"?N:result.length});
  }
  await client.query("SET enable_indexscan=on;SET enable_bitmapscan=on");
  const targets=(await client.query("SELECT id,value,revision FROM canonical WHERE scope=$1 ORDER BY id LIMIT 2",[scope])).rows;
  for(const [i,configuration] of ["B1","C1"].entries()){const t=targets[i],x=await timed(async()=>{await client.query("BEGIN");await client.query("UPDATE canonical SET value=$1,revision=revision+1 WHERE scope=$2 AND id=$3",[t.value+1,scope,t.id]);if(configuration==="C1")await client.query("UPDATE projection SET value=$1,revision=revision+1,source_hash=$2 WHERE scope=$3 AND id=$4",[t.value+1,t.id+":"+(t.revision+1),scope,t.id]);await client.query("COMMIT");});emit({experiment:"PG-P2",profile,N,rep,configuration,durationMs:x.durationMs,logicalWrites:1,physicalWrites:configuration==="C1"?2:1});}
  const fullMs=await rebuild(scope);emit({experiment:"PG-R1",profile,N,rep,configuration:"C1",durationMs:fullMs,...await verify(scope)});
  const count=Math.max(1,Math.floor(N/cfg.organizations*.01)),ids=(await client.query("SELECT id FROM canonical WHERE scope=$1 ORDER BY id LIMIT $2",[scope,count])).rows;
  await client.query("BEGIN");for(const x of ids)await client.query("UPDATE canonical SET value=value+3,revision=revision+1 WHERE scope=$1 AND id=$2",[scope,x.id]);await client.query("COMMIT");
  const inc=await timed(async()=>{await client.query("BEGIN");for(const x of ids)await client.query("INSERT INTO projection SELECT scope,status,id,revision,value,id||':'||revision FROM canonical WHERE scope=$1 AND id=$2 ON CONFLICT(scope,status,id) DO UPDATE SET revision=excluded.revision,value=excluded.value,source_hash=excluded.source_hash",[scope,x.id]);await client.query("COMMIT");});
  emit({experiment:"PG-R2",profile,N,rep,configuration:"C1",changeRatio:.01,durationMs:inc.durationMs,processed:ids.length,...await verify(scope)});
}
// Calidad de datos semirrealistas y escenarios de fallo, separados del benchmark.
for(let rep=0;rep<cfg.repetitions;rep++){
  const g=generateSemirealistic({seed:cfg.seed+70000+rep,N:10000,tenants:cfg.organizations,profile:"R",rates:cfg.semirealisticRates});
  const unique=new Map();let quarantined=0,repaired=0;for(const r of g.rows){if(unique.has(r.id))continue;if(r.schemaVersion===0){r.schemaVersion=1;repaired++;}if(r.category?.startsWith("desconocido-")){quarantined++;continue;}unique.set(r.id,r);}
  emit({experiment:"PG-DQ1",profile:"R",N:10000,rep,configuration:"SEMIRREALISTA",inputRows:g.rows.length,acceptedRows:unique.size,duplicates:g.anomalies.duplicateLogicalEvent,repaired,quarantined,manifestHash:g.manifest.hash});
  await client.query("TRUNCATE canonical,projection,processed");await load([...unique.values()]);const scope="t-00";await rebuild(scope);
  await client.query("INSERT INTO processed(event_id) VALUES($1) ON CONFLICT DO NOTHING",["evt-1"]);const dup=await client.query("INSERT INTO processed(event_id) VALUES($1) ON CONFLICT DO NOTHING",["evt-1"]);emit({experiment:"PG-F1",rep,configuration:"IDEMPOTENCIA",effects:1+dup.rowCount-0,duplicatesSuppressed:dup.rowCount===0?1:0});
  await client.query("DROP TABLE IF EXISTS projection_stage");await client.query("CREATE TABLE projection_stage(LIKE projection INCLUDING ALL)");await client.query("INSERT INTO projection_stage SELECT * FROM projection WHERE scope=$1 LIMIT 10",[scope]);const activeBefore=(await client.query("SELECT count(*)::int n FROM projection WHERE scope=$1",[scope])).rows[0].n;await client.query("DROP TABLE projection_stage");const activeAfter=(await client.query("SELECT count(*)::int n FROM projection WHERE scope=$1",[scope])).rows[0].n;emit({experiment:"PG-F2",rep,configuration:"INTERRUPCION",activeBefore,activeAfter,visibleLoss:activeBefore-activeAfter});
  const one=(await client.query("SELECT id,revision FROM canonical WHERE scope=$1 LIMIT 1",[scope])).rows[0];const ok=await client.query("UPDATE canonical SET revision=revision+1 WHERE scope=$1 AND id=$2 AND revision=$3",[scope,one.id,one.revision]);const stale=await client.query("UPDATE canonical SET revision=revision+1 WHERE scope=$1 AND id=$2 AND revision=$3",[scope,one.id,one.revision]);emit({experiment:"PG-F3",rep,configuration:"REVISION",firstAccepted:ok.rowCount,staleAccepted:stale.rowCount});
  await client.query("DELETE FROM projection WHERE ctid IN (SELECT ctid FROM projection WHERE scope=$1 LIMIT 1)",[scope]);const before=await verify(scope);await rebuild(scope);const after=await verify(scope);emit({experiment:"PG-F4",rep,configuration:"CORRUPCION",detected:before.different+Math.abs(before.expected-before.observed),recoveredAccuracy:after.accuracy});
  let rejected=0;try{await client.query("INSERT INTO canonical(scope,id,status) VALUES(NULL,'sin-ambito','active')");}catch{rejected=1;}emit({experiment:"PG-F5",rep,configuration:"AMBITO",missingScopeRejected:rejected});
}
await client.end();
const manifest={runId,protocolHash:sha256(cfg),rawHash:sha256(fs.readFileSync(rawPath)),rows:rowCount,environment:{node:process.version,cpu:os.cpus()[0]?.model,memoryBytes:os.totalmem(),platform:process.platform,arch:process.arch,postgres:"16-alpine",transport:"TCP localhost:55432"},rawFile:path.relative(root,rawPath)};
fs.writeFileSync(path.join(manifestDir,runId+".json"),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest,null,2));
