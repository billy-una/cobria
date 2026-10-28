import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {buildEp3} from '../../editorial/ep3/build.mjs';
const root=path.resolve(import.meta.dirname,'../..');
const data=buildEp3();
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'cobria-ep3-areas-'));
const examples='replication/examples';
for(const folder of ['ecosistema-app','operacion-c6','operacion-documental','analitica-c7']){
  const target=path.join(temporary,examples,folder);fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.cpSync(path.join(root,examples,folder),target,{recursive:true,filter:filename=>{
    if(fs.lstatSync(filename).isSymbolicLink())throw new Error('No se copian enlaces');
    return !['node_modules','.git','output','results'].includes(path.basename(filename))&&!path.basename(filename).startsWith('.env');
  }});
}
const sourceFiles={};
function collect(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const filename=path.join(directory,entry.name);
  if(entry.isDirectory())collect(filename);else sourceFiles[path.relative(temporary,filename)]=createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
}}
collect(temporary);
const executions=[];
const unique=[...new Set(data.areas.map(area=>area.caseKey).filter(Boolean))];
for(const name of unique){
  const areas=data.areas.filter(area=>area.caseKey===name);
  for(const quantity of [3,4,...(name==='calidad'?[]:[0])]){
    const args=[`${examples}/ecosistema-app/taller-areas/ejecutar.mjs`,name,String(quantity)];
    const result=spawnSync(process.execPath,args,{cwd:temporary,encoding:'utf8',timeout:15000});
    assert.equal(result.error,undefined);
    assert.equal(result.status,quantity===0?1:0,`${name}/${quantity}: ${result.stdout} ${result.stderr}`);
    if(quantity===0)assert.match(result.stderr,/Caso rechazado:/);
    else{
      const value=JSON.parse(result.stdout);
      if(quantity===3)for(const area of areas)for(const [key,expected]of Object.entries(area.expected))assert.deepEqual(value[key],expected,`${area.key}: ${key}`);
      if(quantity===4){
        if(Object.hasOwn(value,'cantidad'))assert.equal(value.cantidad,4);
        if(name==='core'){assert.equal(value.canonico,4);assert.equal(value.reconstruida,4);}
      }
    }
    executions.push({case:name,quantity,args,exitCode:result.status,stdout:result.stdout,stderr:result.stderr});
  }
}
const report={phase:'EP3',kind:'copia-nueva-local-no-replica-externa',status:'aprobado-local',node:process.version,
  temporary,sourceFiles,executions,uniqueCases:unique.length,
  executableAreas:data.areas.filter(area=>area.caseKey).map(area=>area.key),
  artifactAreas:data.areas.filter(area=>!area.caseKey).map(area=>({key:area.key,status:'rubrica-preparada-no-calificada'})),
  readerComprehensionValidated:false,independentReview:false,published:false};
const output=path.join(root,'output/review/ep3',`${path.basename(temporary)}.json`);
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(`EP3: ${unique.length} casos, ${executions.length} ejecuciones, ${report.executableAreas.length} áreas ejecutables y ${report.artifactAreas.length} con rúbrica preparada. ${output}`);
