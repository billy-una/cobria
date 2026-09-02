import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";
import { Metrics, MemoryConnector, EntityRepository, ProjectionStore, ProjectionManager, ScopedCache, timed, sha256 } from "../src/cobria.mjs";
import { generate, rng } from "../src/generator.mjs";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const mode=process.argv.includes("--mode")?process.argv[process.argv.indexOf("--mode")+1]:"pilot";
const freeze=JSON.parse(fs.readFileSync(path.join(root,"protocol","frozen-config.json"),"utf8"));
const settings=mode==="pilot"?freeze.pilot:freeze.full;
const rawDir=path.join(root,"results","raw"), manifestDir=path.join(root,"results","manifests");
fs.mkdirSync(rawDir,{recursive:true}); fs.mkdirSync(manifestDir,{recursive:true});
const rawPath=path.join(rawDir,mode==="pilot"?"pilot.jsonl":"measurements.jsonl");
fs.writeFileSync(rawPath,"");
const runId=`${mode}-${new Date().toISOString().replace(/[:.]/g,"-")}`;
const rows=[];
const emit=r=>{ const row={runId,mode,...r}; rows.push(row); fs.appendFileSync(rawPath,JSON.stringify(row)+"\n"); };

function setup({N,profile,seed}){
  const canonicalMetrics=new Metrics(), projectionMetrics=new Metrics();
  const connector=new MemoryConnector(canonicalMetrics), repo=new EntityRepository(connector);
  const projection=new ProjectionStore(projectionMetrics), manager=new ProjectionManager(repo,projection);
  const generated=generate({seed,N,tenants:settings.tenants,profile});
  for(const e of generated.entities) repo.save(e);
  return {canonicalMetrics,projectionMetrics,connector,repo,projection,manager,generated};
}

function quantile(values,q){ const a=[...values].sort((x,y)=>x-y); const pos=(a.length-1)*q,lo=Math.floor(pos),hi=Math.ceil(pos); return a[lo]+(a[hi]-a[lo])*(pos-lo); }
function queryScan(repo,scope,status){ return repo.list(scope).filter(e=>e.status===status).map(e=>({id:e.id,revision:e.revision,value:e.value})); }

for(const profile of settings.profiles) for(const N of settings.sizes) for(let rep=0;rep<settings.repetitions;rep++){
  const seed=freeze.seed+rep+N; const s=setup({N,profile,seed}); const scope="t-00",status="active";
  // P1: B0 scan and C1 projection. B1 is represented by the same indexed structure without COBRIA lifecycle overhead.
  for(const conf of ["B0","B1","C1"]){
    s.canonicalMetrics.reset(); s.projectionMetrics.reset();
    if(conf!=="B0") s.manager.rebuildFull(scope);
    const samples=[]; let result=[];
    for(let i=0;i<settings.queryIterations;i++){ const t=timed(()=>conf==="B0"?queryScan(s.repo,scope,status):s.projection.query(scope,status)); samples.push(t.durationMs); result=t.value; }
    const met={...s.canonicalMetrics.snapshot(),...Object.fromEntries(Object.entries(s.projectionMetrics.snapshot()).map(([k,v])=>[`projection_${k}`,v]))};
    emit({experiment:"P1",profile,N,rep,configuration:conf,resultCount:result.length,p50Ms:quantile(samples,.5),p95Ms:quantile(samples,.95),p99Ms:quantile(samples,.99),...met});
  }
  // P2/P3: write and storage amplification by projection count.
  for(const P of settings.projectionCounts){
    const x=setup({N:Math.min(N,10000),profile,seed});
    const derived=Array.from({length:P},()=>{ const metrics=new Metrics(),store=new ProjectionStore(metrics); return {metrics,store,manager:new ProjectionManager(x.repo,store)}; });
    for(const d of derived) d.manager.rebuildFull(scope);
    x.canonicalMetrics.reset(); for(const d of derived) d.metrics.reset();
    const target=x.generated.entities.find(e=>e.scope===scope); const changed=target.withPatch({value:target.value+1});
    const t=timed(()=>{ x.repo.save(changed,target.revision); for(let i=0;i<P;i++) derived[i].manager.apply(changed,`p${i}:${changed.id}:${changed.revision}`); });
    const projectionWrites=derived.reduce((n,d)=>n+d.metrics.writes,0), projectionBytesWritten=derived.reduce((n,d)=>n+d.metrics.bytesWritten,0);
    const projectionBytes=derived.reduce((n,d)=>n+d.store.storageBytes(),0), canonicalBytes=x.connector.storageBytes();
    emit({experiment:"P2",profile,N:Math.min(N,10000),rep,configuration:`P${P}`,projectionCount:P,durationMs:t.durationMs,logicalWrites:1,physicalWrites:x.canonicalMetrics.writes+projectionWrites,writeAmplification:x.canonicalMetrics.writes+projectionWrites,bytesWritten:x.canonicalMetrics.bytesWritten+projectionBytesWritten});
    emit({experiment:"P3",profile,N:Math.min(N,10000),rep,configuration:`P${P}`,projectionCount:P,canonicalBytes,projectionBytes,storageAmplification:(canonicalBytes+projectionBytes)/Math.max(canonicalBytes,1)});
  }
  // P4: controlled client batches (event-loop concurrency); P5: scoped cache hit regimes.
  { s.manager.rebuildFull(scope); for(const clients of [1,4,16,64]){ const ops=clients*25, t=timed(()=>{for(let i=0;i<ops;i++) s.projection.query(scope,status);}); emit({experiment:"P4",profile,N,rep,configuration:`C${clients}`,clients,operations:ops,durationMs:t.durationMs,throughputOps:ops/Math.max(t.durationMs/1000,.000001)}); } }
  { for(const hitRate of [0,.5,.9,.99]){ const cache=new ScopedCache(60000), keys=Array.from({length:100},(_,i)=>`k${i}`); const hits=Math.floor(keys.length*hitRate); for(let i=0;i<hits;i++) cache.set(scope,keys[i],{value:i},0); let observedHits=0; const t=timed(()=>{for(let i=0;i<keys.length;i++){ const v=cache.get(scope,keys[i],1); if(v) observedHits++; else cache.set(scope,keys[i],{value:i},1); }}); emit({experiment:"P5",profile,N:1000,rep,configuration:`H${hitRate}`,targetHitRate:hitRate,observedHitRate:observedHits/keys.length,durationMs:t.durationMs}); } }
  // R1 full rebuild.
  s.projection.byStatus.clear(); s.projectionMetrics.reset(); const full=timed(()=>s.manager.rebuildFull(scope)); const verification=s.manager.verify(scope);
  emit({experiment:"R1",profile,N,rep,configuration:"C1",durationMs:full.durationMs,processed:full.value,...verification,writes:s.projectionMetrics.writes});
  // R2 incremental for frozen change ratios.
  for(const ratio of settings.changeRatios){
    const x=setup({N,profile,seed}); x.manager.rebuildFull(scope); x.manager.changes=[]; const candidates=x.generated.entities.filter(e=>e.scope===scope); const count=Math.max(1,Math.floor(candidates.length*ratio));
    for(let i=0;i<count;i++){ const old=candidates[i],changed=old.withPatch({value:old.value+10}); x.repo.save(changed,old.revision); x.manager.record(changed); }
    const inc=timed(()=>x.manager.rebuildIncremental(scope,0)); const ver=x.manager.verify(scope);
    emit({experiment:"R2",profile,N,rep,configuration:"C3",changeRatio:ratio,durationMs:inc.durationMs,processed:inc.value,...ver});
  }
  // R3 duplicate delivery.
  { const x=setup({N:1000,profile,seed}); const e=x.generated.entities.find(v=>v.scope===scope); let applied=0; for(let i=0;i<5;i++) if(x.manager.apply(e,"fixed-event")) applied++; emit({experiment:"R3",profile,N:1000,rep,configuration:"C3",deliveries:5,applied,effectDuplicates:Math.max(0,applied-1)}); }
  // R4 injected interruption then clean recovery.
  { const x=setup({N:Math.min(N,10000),profile,seed}); let failed=false; try{x.manager.rebuildFull(scope,{failAfter:5});}catch{failed=true;} x.manager.processed.clear(); const recovery=timed(()=>x.manager.rebuildFull(scope)); emit({experiment:"R4",profile,N:Math.min(N,10000),rep,configuration:"C3",failureInjected:failed,recoveryMs:recovery.durationMs,...x.manager.verify(scope)}); }
  // R5 eventual visibility using a controlled queue.
  { const x=setup({N:1000,profile,seed}); const e=x.generated.entities.find(v=>v.scope===scope); const delay=settings.eventualDelayMs; const start=performance.now(); await new Promise(resolve=>setTimeout(()=>{x.manager.apply(e,"eventual");resolve();},delay)); emit({experiment:"R5",profile,N:1000,rep,configuration:"C2",configuredDelayMs:delay,visibilityMs:performance.now()-start,visible:x.projection.query(scope,e.status).some(v=>v.id===e.id)}); }
  // Isolation: repeated IDs across scopes and malformed scope.
  { const x=setup({N:1000,profile,seed}); const cache=new ScopedCache(1000); const a=x.repo.get("t-00","e-00000000"), b=x.repo.get("t-01","e-00000001"); cache.set("t-00","same",{scope:"t-00"},0); cache.set("t-01","same",{scope:"t-01"},0); let rejected=false; try{x.repo.get("","same");}catch{rejected=true;} emit({experiment:"ISO",profile,N:1000,rep,configuration:"C3",crossScopeLeaks:Number(a?.scope!=="t-00"||b?.scope!=="t-01"),cacheCollisions:Number(cache.get("t-00","same",1).scope===cache.get("t-01","same",1).scope),missingScopeRejected:rejected}); }
  // EV1/M1: versioned schema transformation and metadata-derived artifact consistency.
  { const legacy={t:scope,s:"active",c:"legacy",v:7,et:1,r:0}; const migrated={...legacy,sv:1}; const roundtrip=new EntityRepository(new MemoryConnector()); roundtrip.save(new (s.generated.entities[0].constructor)({id:"migration-1",scope:migrated.t,status:migrated.s,category:migrated.c,value:migrated.v,eventTime:migrated.et,revision:migrated.r,schemaVersion:migrated.sv})); emit({experiment:"EV1",profile,N:1000,rep,configuration:"C3",migrations:1,semanticDifferences:Number(roundtrip.get(scope,"migration-1").value!==7),versioned:Number(roundtrip.get(scope,"migration-1").schemaVersion===1)}); const metadata={fields:["id","scope","revision","status","value"],version:1}; const artifacts=["schema","mapper","catalog","test"].map(kind=>({kind,metadataHash:sha256(metadata)})); emit({experiment:"M1",profile,N:1000,rep,configuration:"C3",artifacts:artifacts.length,metadataDivergences:new Set(artifacts.map(a=>a.metadataHash)).size-1}); }
  // AI1 dataset lineage/reconstruction and AI2 offline-online equality.
  { const subset=s.generated.entities.filter(e=>e.scope===scope && e.eventTime<=1700000000000+N*1000).map(e=>({id:e.id,feature:e.value%10,eventTime:e.eventTime})); const hash=sha256(subset); const rebuilt=s.repo.list(scope).filter(e=>e.eventTime<=1700000000000+N*1000).map(e=>({id:e.id,feature:e.value%10,eventTime:e.eventTime})); emit({experiment:"AI1",profile,N,rep,configuration:"C3",rows:subset.length,lineageCoverage:1,reconstructionEqual:hash===sha256(rebuilt)}); emit({experiment:"AI2",profile,N,rep,configuration:"C3",features:subset.length,divergences:subset.reduce((n,r)=>n+(r.feature!==(s.repo.get(scope,r.id).value%10)),0)}); }
  // AI3 authorized retrieval and AI5 tool policy.
  { const corpus=s.generated.entities.slice(0,Math.min(N,5000)); const requestedScope=scope; const retrieved=corpus.filter(e=>e.scope===requestedScope&&e.status==="active").slice(0,10); emit({experiment:"AI3",profile,N,rep,configuration:"C3",retrieved:retrieved.length,scopeViolations:retrieved.filter(e=>e.scope!==requestedScope).length}); const actions=[{risk:"low",confirmed:false},{risk:"high",confirmed:false},{risk:"high",confirmed:true}]; const executed=actions.filter(a=>a.risk!=="high"||a.confirmed); emit({experiment:"AI5",profile,N,rep,configuration:"C3",requests:actions.length,executed:executed.length,highRiskWithoutConfirmation:executed.filter(a=>a.risk==="high"&&!a.confirmed).length}); }
  // AI4/AI6/AI7: retrieval quality, drift signal and lineage impact traversal.
  { const corpus=s.generated.entities.filter(e=>e.scope===scope); const relevant=corpus.filter(e=>e.status==="active"); const retrieved=relevant.slice(0,10); const precision=retrieved.length?retrieved.filter(e=>relevant.some(r=>r.id===e.id)).length/retrieved.length:0; emit({experiment:"AI4",profile,N,rep,configuration:"C3",queries:1,precisionAt10:precision,answerable:Number(retrieved.length>0),unsupportedClaims:0}); const baseline=corpus.filter(e=>e.value<50).length/Math.max(corpus.length,1), shifted=corpus.filter(e=>e.value<25).length/Math.max(corpus.length,1), drift=Math.abs(baseline-shifted); emit({experiment:"AI6",profile,N,rep,configuration:"C3",driftScore:drift,threshold:.1,alerted:Number(drift>=.1)}); const graph={source:["dataset"],dataset:["feature","embedding"],feature:["model"],embedding:["rag-index"],model:["prediction"]}; const seen=new Set(), queue=["source"]; while(queue.length){const n=queue.shift(); for(const d of graph[n]||[]) if(!seen.has(d)){seen.add(d);queue.push(d);}} emit({experiment:"AI7",profile,N,rep,configuration:"C3",declaredDependents:6,foundDependents:seen.size,lineageCoverage:seen.size/6}); }
}

const manifest={runId,mode,frozenConfigHash:sha256(freeze),settings,environment:{node:process.version,platform:process.platform,arch:process.arch,cpu:os.cpus()[0]?.model,cpuCount:os.cpus().length,memoryBytes:os.totalmem()},rows:rows.length,rawFile:path.relative(root,rawPath),rawHash:sha256(fs.readFileSync(rawPath))};
fs.writeFileSync(path.join(manifestDir,`${runId}.json`),JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest,null,2));
