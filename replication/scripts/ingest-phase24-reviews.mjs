#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {validateSemanticReview,agreement} from '../src/semantic-review.mjs';

const root=path.resolve(import.meta.dirname,'../..');
const files=process.argv.slice(2).map(file=>path.resolve(file));
if (files.length!==6) throw new Error('Se requieren exactamente seis respuestas.');
const records=files.map(file=>({file,record:JSON.parse(fs.readFileSync(file,'utf8'))}));
for (const {file,record} of records) {
  const validation=validateSemanticReview(record);
  if (!validation.valid) throw new Error(`${path.basename(file)}: ${validation.errors.join('; ')}`);
  if (/simulada por IA|\bIA\b/i.test(record.conflictStatement)) throw new Error(`${path.basename(file)}: atestación contradictoria`);
}
const reviewerCodes=[...new Set(records.map(item=>item.record.reviewerCode))];
const samples=[...new Set(records.map(item=>item.record.sample))].sort();
if (reviewerCodes.length!==2||samples.join(',')!=='M-01,M-02,M-03') throw new Error('Se requieren dos revisores y tres muestras.');
for (const reviewer of reviewerCodes) if (records.filter(item=>item.record.reviewerCode===reviewer).length!==3) throw new Error(`${reviewer}: debe entregar tres respuestas.`);

const output=path.join(root,'specification/phase-24/responses');
fs.mkdirSync(output,{recursive:true});
const manifest=[];
for (const {file,record} of records) {
  const target=path.join(output,path.basename(file));
  const bytes=fs.readFileSync(file);
  fs.writeFileSync(target,bytes);
  manifest.push({file:path.basename(file),reviewerCode:record.reviewerCode,sample:record.sample,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),attestation:'human-self-declared-confirmed-by-coordinator'});
}
const comparisons=samples.map(sample=>{
  const pair=records.filter(item=>item.record.sample===sample).map(item=>item.record);
  return agreement(pair[0],pair[1]);
});
const allA={...records.find(item=>item.record.reviewerCode===reviewerCodes[0]).record,sample:'GLOBAL',decisions:records.filter(item=>item.record.reviewerCode===reviewerCodes[0]).flatMap(item=>item.record.decisions.map(row=>({...row,id:`${item.record.sample}-${row.id}`})))};
const allB={...records.find(item=>item.record.reviewerCode===reviewerCodes[1]).record,sample:'GLOBAL',decisions:records.filter(item=>item.record.reviewerCode===reviewerCodes[1]).flatMap(item=>item.record.decisions.map(row=>({...row,id:`${item.record.sample}-${row.id}`})))};
const decisionsA=new Map(allA.decisions.map(row=>[row.id,row.decision]));
const decisionsB=new Map(allB.decisions.map(row=>[row.id,row.decision]));
const ids=[...decisionsA.keys()]; const labels=['supported','unsupported','insufficient'];
const observed=ids.filter(id=>decisionsA.get(id)===decisionsB.get(id)).length/ids.length;
const expected=labels.reduce((sum,label)=>sum+(ids.filter(id=>decisionsA.get(id)===label).length/ids.length)*(ids.filter(id=>decisionsB.get(id)===label).length/ids.length),0);
const global={decisions:ids.length,agreement:Number(observed.toFixed(3)),cohenKappa:Number(((observed-expected)/(1-expected)).toFixed(3)),disagreements:ids.filter(id=>decisionsA.get(id)!==decisionsB.get(id))};
const report={schemaVersion:'1.0.0',state:'received-pending-adjudication',reviewers:reviewerCodes,samples,attestationBasis:'self-declared-human-and-coordinator-confirmed-correction',identityVerification:'not-stored-in-public-repository',comparisons,global,adjudicationRequired:global.disagreements.length>0};
fs.writeFileSync(path.join(output,'MANIFEST.json'),`${JSON.stringify({schemaVersion:'1.0.0',responses:manifest},null,2)}\n`);
fs.writeFileSync(path.join(output,'AGREEMENT.json'),`${JSON.stringify(report,null,2)}\n`);
console.log(`Respuestas ingresadas: 6; acuerdo global ${global.agreement}; kappa ${global.cohenKappa}; desacuerdos ${global.disagreements.length}.`);
