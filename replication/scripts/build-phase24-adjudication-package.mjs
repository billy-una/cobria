#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'../..');
const phase=path.join(root,'specification/phase-24');
const reviewPackage=path.join(root,'output/review/phase24');
const args=process.argv.slice(2); const value=flag=>args[args.indexOf(flag)+1];
const output=path.resolve(value('--salida')??path.join(root,'output/review/phase24-adjudication'));
fs.rmSync(output,{recursive:true,force:true}); fs.mkdirSync(output,{recursive:true});
const reviewers=['R-ARCH24','R-QAOPS'];
const files=[];
for (const sample of ['M-01','M-02','M-03']) {
  const packet=JSON.parse(fs.readFileSync(path.join(reviewPackage,`${sample}.json`),'utf8'));
  const evidence=packet.contracts.find(row=>row.id==='ENG-007');
  const prior=reviewers.map((reviewer,index)=>{
    const response=JSON.parse(fs.readFileSync(path.join(phase,'responses',`respuesta-${reviewer}-${sample}.json`),'utf8'));
    const decision=response.decisions.find(row=>row.id==='ENG-007');
    return {review:`Revisión ${index?'B':'A'}`,decision:decision.decision,confidence:decision.confidence,rationale:decision.rationale};
  });
  const target={schemaVersion:'1.0.0',sample,contract:{id:'ENG-007',name:'Estrangulamiento verificable de legado',criterion:['frontera explícita','control verificable contra nuevo crecimiento','condición, métrica o ruta de retiro']},evidence:evidence.evidence,priorReviews:prior};
  const name=`ADJUDICACION-${sample}.json`; fs.writeFileSync(path.join(output,name),`${JSON.stringify(target,null,2)}\n`); files.push(name);
}
for (const name of ['INSTRUCCIONES-ADJUDICADOR.md','RUBRICA.md','FORMULARIO-ADJUDICACION.json','ADJUDICATION-response.schema.json']) { fs.copyFileSync(path.join(phase,name),path.join(output,name)); files.push(name); }
const entries=files.sort().map(file=>({file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(output,file))).digest('hex')}));
fs.writeFileSync(path.join(output,'MANIFEST-SHA256.json'),`${JSON.stringify({schemaVersion:'1.0.0',purpose:'independent-adjudication-only',samples:3,contract:'ENG-007',identityKeyExcluded:true,entries},null,2)}\n`);
console.log('Paquete de adjudicación preparado: 3 desacuerdos ENG-007, identidad excluida.');
