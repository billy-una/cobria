import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSemanticReview,validateAdjudication,agreement} from '../src/semantic-review.mjs';
const response=(reviewer,change=null)=>({schemaVersion:'1.0.0',reviewerCode:reviewer,sample:'M-01',conflictStatement:'Declaro no haber participado en el proyecto evaluado.',decisions:Array.from({length:8},(_,i)=>({id:`ENG-${String(i+1).padStart(3,'0')}`,decision:i===change?'insufficient':'supported',confidence:4,rationale:'El fragmento muestra participantes, restricción y consecuencia observable.'})),recommendation:'accept-manifest',attestation:{type:'human',date:'2026-09-20',independentWork:true}});
test('rechaza una respuesta sin atestación humana',()=>{
  const invalid=response('R-AAA'); invalid.attestation.type='ai';
  assert.equal(validateSemanticReview(invalid).valid,false);
});
test('calcula acuerdo y conserva desacuerdos',()=>{
  const result=agreement(response('R-AAA'),response('R-BBB',3));
  assert.equal(result.agreement,0.875);
  assert.deepEqual(result.disagreements,['ENG-004']);
});
test('rechaza una adjudicación de IA con atestación humana contradictoria',()=>{
  const draft={schemaVersion:'1.0.0',adjudicatorCode:'A-AIDRAFT24',conflictStatement:'Evaluación técnica generada por un sistema de IA. No soy una tercera persona humana.',decisions:['M-01','M-02','M-03'].map(sample=>({sample,contract:'ENG-007',decision:'insufficient',confidence:4,rationale:'La evidencia parcial no demuestra las tres propiedades obligatorias del contrato completo.',addressesBothReviews:true})),attestation:{type:'human',date:'2026-09-21',independentWork:true,reviewedOriginalEvidence:true}};
  const result=validateAdjudication(draft);
  assert.equal(result.valid,false);
  assert.match(result.errors.join(' '),/contradice/);
  assert.match(result.errors.join(' '),/reservado/);
});
