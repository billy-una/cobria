import test from 'node:test';import assert from 'node:assert/strict';
import {blankExternalReplication,validateExternalReplication,synthesizeScientificState,validateEditorialSnapshot,hashEntries,assessPublicationReadiness} from '../src/research-closure.mjs';
const plan={tasks:Array.from({length:5},(_,i)=>({id:`ER-${i+1}`}))};
test('fase 32 nace sin repetición externa',()=>{const run=blankExternalReplication(plan);assert.equal(run.summary.executed,0);assert.equal(run.tasks.every(x=>x.result===null),true);});
test('fase 32 rechaza atribuir un fixture a una persona',()=>{const run=blankExternalReplication(plan);assert.equal(validateExternalReplication(run).valid,false);});
test('fase 33 conserva como pendientes las evidencias ausentes',()=>{const out=synthesizeScientificState({phase29:{responseFilesReceived:0},phase31:{executed:0},phase32:{externalRunsReceived:0}});assert.equal(out.evidenceLevels.externalReplication,'pending');assert.equal(out.effectSizes,null);});
test('fase 34 rechaza validación externa inventada',()=>{const snapshot={phase:34,proposalIndependent:true,officialCertification:false,products:[1,2,3,4],claims:[{status:'validated-external'}],humanResponses:0,operationalRuns:0,externalReplications:0};assert.equal(validateEditorialSnapshot(snapshot).valid,false);});
test('fase 35 produce huellas deterministas',()=>{assert.equal(hashEntries([{path:'a',content:'x'}])[0].sha256,hashEntries([{path:'a',content:'x'}])[0].sha256);});
test('fase 36 no publica mientras existan bloqueadores',()=>{const out=assessPublicationReadiness({blockers:[{id:'firma',status:'pending-human'}]});assert.equal(out.published,false);assert.equal(out.status,'prepared-not-published');});
