import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'../..');
const destination=await fs.mkdtemp(path.join(os.tmpdir(),'cobria-ep4-reproduccion-'));
const target=path.join(destination,'replication');
await fs.mkdir(path.join(target,'examples'),{recursive:true});
for(const name of ['package.json','package-lock.json'])await fs.copyFile(path.join(root,'replication',name),path.join(target,name));
for(const name of ['integral-c8','ecosistema-app','api-ux-c5','analitica-c7'])await fs.cp(path.join(root,'replication/examples',name),path.join(target,'examples',name),{recursive:true,filter:async entry=>{
  const basename=path.basename(entry);
  if(basename==='node_modules'||basename.startsWith('.env'))return false;
  if((await fs.lstat(entry)).isSymbolicLink())throw Error('No se copian enlaces');
  return true;
}});
await fs.mkdir(path.join(target,'tests'));
await fs.copyFile(path.join(root,'replication/tests/ep4-recorrido.test.mjs'),path.join(target,'tests/ep4-recorrido.test.mjs'));
const steps=[['npm',['ci','--no-audit','--no-fund']],['npm',['test','--prefix','examples/integral-c8']],[process.execPath,['--test','tests/ep4-recorrido.test.mjs']]];
const report={kind:'copia-local-con-dependencias-propias',destination,externalReplication:false,published:false,steps:[]};
for(const [command,args]of steps){
  const r=spawnSync(command,args,{cwd:target,encoding:'utf8',timeout:180000});
  report.steps.push({command,args,exit:r.status,stdout:r.stdout,stderr:r.stderr,error:r.error?.message});
  if(r.status!==0){process.exitCode=1;break;}
}
report.passed=report.steps.length===steps.length&&report.steps.every(s=>s.exit===0);
const output=path.join(root,'output/review/ep4');await fs.mkdir(output,{recursive:true});
await fs.writeFile(path.join(output,'COPIA.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({destination,passed:report.passed}));
