import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {validateDecision,buildEp8} from '../../editorial/ep8/build.mjs';
const root=path.resolve(import.meta.dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p)));
const d=read('editorial/ep8/decision.json'),basis=read(d.basis);
test('EP8 conserva exclusión justificada y congelamientos sin declarar ejecución',()=>{
  const r=buildEp8({check:true});assert.equal(r.pc3Closed,false);assert.equal(r.newConfirmatoryObservations,0);assert.equal(r.externalReplicationDone,false);assert.ok(Object.keys(r.protectedSources).length>=14);
});
test('EP8 no acepta completar observaciones ni cerrar puertas por exclusión',()=>{
  for(const patch of [{newConfirmatoryObservations:270},{pc3Closed:true},{stableGatesClosed:true},{externalReplicationDone:true}])assert.throws(()=>validateDecision({...d,...patch},basis),/no equivale/);
});
test('EP8 exige alcance original y condiciones para reentrar',()=>{
  assert.throws(()=>validateDecision(d,{...basis,deliveryTarget:'estable'}),/alcance/);assert.throws(()=>validateDecision({...d,reentry:[]},basis),/reentrada/);
});
test('EP8 diagnóstico se conserva como diagnóstico, no dataset',()=>{
  const r=buildEp8({check:true});const p=read(d.preflight);assert.equal(p.kind,'preflight-no-es-corrida');assert.equal(p.confirmatoryObservations,0);assert.equal(r.preflight.ready,p.ready);assert.equal(p.ready,false);
});
