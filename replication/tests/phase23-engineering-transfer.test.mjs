import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const comparison=JSON.parse(fs.readFileSync('../specification/phase-23/comparison.json','utf8'));
test('compara tres commits y conserva cero validaciones operacionales',()=>{
  assert.equal(comparison.summary.projects,3);
  assert.equal(new Set(comparison.projects.map(item=>item.commit)).size,3);
  assert.equal(comparison.summary.operationallyValidated,0);
});
test('cubre ENG-001..ENG-008 sin convertir cobertura en ranking',()=>{
  assert.deepEqual(comparison.contracts.map(item=>item.id),Array.from({length:8},(_,i)=>`ENG-${String(i+1).padStart(3,'0')}`));
  assert.match(comparison.interpretation,/no ordena calidad/i);
});
