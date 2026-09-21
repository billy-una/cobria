import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildDimensionalReviewForms } from '../src/dimensional-review.mjs';
import { awaitingDimensionalAgreement, computeDimensionalAgreement } from '../src/dimensional-agreement.mjs';

const rubric = JSON.parse(fs.readFileSync('../specification/phase-26/engineering-dimensional-rubric.json', 'utf8'));
const samples = ['M-01', 'M-02', 'M-03'].map(code => ({ code, evidenceByContract: Object.fromEntries(rubric.contracts.map(c => [c.id, []])) }));
const completedPair = () => buildDimensionalReviewForms({ rubric, samples }).map((form, reviewerIndex) => {
  form.type = 'human'; form.independentWork = true; form.conflictOfInterest = false;
  form.attestation = 'Declaro revisión humana independiente para este fixture de prueba.';
  let index = 0;
  for (const sample of form.samples) for (const contract of sample.contracts) for (const dimension of contract.dimensions) {
    dimension.decision = reviewerIndex === 1 && index === 0 ? 'unsupported' : 'supported';
    dimension.confidence = 4; dimension.rationale = 'Justificación sintética exclusiva para probar el cálculo, no evidencia externa.'; index += 1;
  }
  return form;
});

test('sin respuestas conserva acuerdo nulo y cero certificación', () => {
  const state = awaitingDimensionalAgreement(0);
  assert.equal(state.cohenKappa, null); assert.equal(state.officialCertification, false); assert.equal(state.pairedJudgments, 0);
});

test('calcula acuerdo pareado y conserva el desacuerdo', () => {
  const [a, b] = completedPair(); const result = computeDimensionalAgreement(a, b);
  assert.equal(result.pairedJudgments, 72); assert.equal(result.matches, 71); assert.equal(result.disagreements.length, 1);
  assert.equal(result.officialCertification, false); assert.ok(result.observedAgreement < 1);
});

test('rechaza autorrevisión y conflictos declarados', () => {
  const [a, b] = completedPair(); b.reviewer = a.reviewer;
  assert.throws(() => computeDimensionalAgreement(a, b), /revisores distintos/);
  const [c, d] = completedPair(); d.conflictOfInterest = true;
  assert.throws(() => computeDimensionalAgreement(c, d), /conflicto de interés/);
});
