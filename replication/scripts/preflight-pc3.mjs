import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {MongoClient} from 'mongodb';
const root=path.resolve(import.meta.dirname,'../..');
const protocol=JSON.parse(fs.readFileSync(path.join(root,'replication/protocol/pc2-contracts-v1.json')));
const checks=[];
for(const script of ['freeze-pc2.mjs','check-pc2-analysis.mjs']){
  const r=spawnSync(process.execPath,[path.join(root,'replication/scripts',script),'--check'],{encoding:'utf8'});
  checks.push({check:script,ok:r.status===0});
}
const disk=fs.statfsSync(root),freeGiB=disk.bavail*disk.bsize/2**30;
checks.push({check:'espacio',ok:freeGiB>=10,freeGiB,minimumGiB:10});
let mongo;
for(const engine of protocol.engines){
  try{
    let version;
    if(engine==='mongodb'){
      mongo=new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true',{serverSelectionTimeoutMS:2000});
      await mongo.connect();version=(await mongo.db('admin').command({buildInfo:1})).version;
    }else{
      const response=await fetch(engine==='couchdb'?'http://127.0.0.1:5984':'http://127.0.0.1:9200',{signal:AbortSignal.timeout(2000)});
      if(!response.ok)throw Error(`HTTP ${response.status}`);
      const body=await response.json();version=engine==='couchdb'?body.version:body.version?.number;
    }
    checks.push({check:engine,ok:version===protocol.expectedVersions[engine],version,expected:protocol.expectedVersions[engine]});
  }catch{checks.push({check:engine,ok:false,reason:'Motor local inaccesible; no se midió ni se modificó almacenamiento'});}
  finally{if(engine==='mongodb')await mongo?.close();}
}
const report={generatedAt:new Date().toISOString(),architecture:process.arch,platform:process.platform,
  kind:'preflight-no-es-corrida',ready:checks.every(x=>x.ok),checks,confirmatoryObservations:0,
  limitation:'Este diagnóstico no implementa el ejecutor remoto PC3 ni acredita ejecución confirmatoria.'};
const dir=path.join(root,'output/review/pc3');fs.mkdirSync(dir,{recursive:true});
const filename=path.join(dir,`preflight-${Date.now()}.json`);fs.writeFileSync(filename,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({...report,file:filename},null,2));process.exitCode=report.ready?0:2;
