#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'../..');
const phase=path.join(root,'specification/phase-24');
const args=process.argv.slice(2);
const value=flag=>args[args.indexOf(flag)+1];
const output=path.resolve(value('--salida')??path.join(root,'output/review/phase24'));
const sources=[
  {code:'M-01',repo:path.resolve(root,'../POSGUAPILES-1'),manifest:'posguapiles'},
  {code:'M-02',repo:path.resolve(root,'../CRMHOTEL_NUEVO'),manifest:'crmhotel'},
  {code:'M-03',repo:path.resolve(root,'../BSHandball'),manifest:'bshandball'}
];
const git=(repo,args)=>execFileSync('git',['-C',repo,...args],{encoding:'utf8',maxBuffer:10*1024*1024});
const excerpt=(text,token)=>{
  const normalized=text.replace(/\s+/g,' ').trim();
  const at=normalized.toLowerCase().indexOf(token.toLowerCase());
  const start=Math.max(0,at<0?0:at-180);
  return normalized.slice(start,start+520);
};
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
const packets=[];
for (const source of sources) {
  const manifest=JSON.parse(fs.readFileSync(path.join(root,`specification/phase-23/adoption-manifest.${source.manifest}.json`),'utf8'));
  const commit=manifest.project.expectedCommit;
  const contracts=manifest.contracts.map(contract=>({
    id:contract.id,
    name:contract.name,
    owner:contract.owner,
    decision:null,
    confidence:null,
    rationale:'',
    evidence:contract.evidence.map((item,index)=>{
      let content='';
      try { content=git(source.repo,['show',`${commit}:${item.path}`]); } catch {}
      return {source:`E-${contract.id.slice(-3)}-${index+1}`,declaredTerms:item.containsAll,excerpt:excerpt(content,item.containsAll[0])};
    })
  }));
  const packet={schemaVersion:'1.0.0',sample:source.code,instructions:'Decida supported, unsupported o insufficient para cada contrato. No intente identificar el proyecto.',contracts};
  const file=path.join(output,`${source.code}.json`);
  fs.writeFileSync(file,`${JSON.stringify(packet,null,2)}\n`);
  packets.push({sample:source.code,file:path.basename(file),sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')});
}
for (const name of ['INSTRUCCIONES-PARA-REVISORES.md','PROTOCOLO.md','RUBRICA.md','FORMULARIO-REVISION.md','review-response.schema.json']) fs.copyFileSync(path.join(phase,name),path.join(output,name));
const manifest={schemaVersion:'1.0.0',state:'prepared-not-reviewed',generatedAt:null,packets,identityKeyExcluded:true,reviewersRequired:2};
fs.writeFileSync(path.join(output,'MANIFEST-SHA256.json'),`${JSON.stringify(manifest,null,2)}\n`);
console.log(`Paquete ciego preparado: ${packets.length} muestras, 2 revisores requeridos, 0 respuestas simuladas.`);
