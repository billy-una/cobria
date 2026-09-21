import test from 'node:test';
import assert from 'node:assert/strict';
import { awaitingDimensionalAdjudication, buildDimensionalAdjudicationForm, finalizeDimensionalAdjudication, validateCompletedDimensionalAdjudication } from '../src/dimensional-adjudication.mjs';

const agreement = () => ({
  status: 'proposal-review-pair-processed', pairedJudgments: 72, reviewers: ['R-A', 'R-B'], observedAgreement: 71/72, cohenKappa: 0.65,
  disagreements: [{ key: 'M-01/ENG-001/states', reviewerA: 'supported', reviewerB: 'insufficient' }]
});

test('sin par humano conserva cero adjudicaciones', () => {
  const state = awaitingDimensionalAdjudication({ status: 'prepared-awaiting-human-responses', responseFilesReceived: 0 });
  assert.equal(state.adjudicationsCompleted, 0); assert.equal(state.adjudicatorAttested, false); assert.equal(state.officialCertification, false);
});

test('el formulario preserva los desacuerdos y nace vacío', () => {
  const form = buildDimensionalAdjudicationForm(agreement());
  assert.equal(form.items.length, 1); assert.equal(form.items[0].adjudicatedDecision, null);
  assert.deepEqual(form.items[0].originalDecisions, { reviewerA: 'supported', reviewerB: 'insufficient' });
});

test('una tercera persona puede adjudicar sin alterar los originales', () => {
  const source = agreement(); const form = buildDimensionalAdjudicationForm(source);
  form.type = 'human'; form.independentWork = true; form.conflictOfInterest = false;
  form.attestation = 'Declaro una adjudicación humana independiente del par original.';
  form.items[0].adjudicatedDecision = 'insufficient'; form.items[0].rationale = 'El fragmento disponible no demuestra el criterio completo.';
  assert.equal(validateCompletedDimensionalAdjudication(form).valid, true);
  const result = finalizeDimensionalAdjudication(source, form);
  assert.equal(result.adjudicationsCompleted, 1); assert.equal(result.officialCertification, false);
});

test('rechaza al revisor original y la alteración del desacuerdo', () => {
  const source = agreement(); const form = buildDimensionalAdjudicationForm(source);
  form.adjudicator = 'R-A'; form.type = 'human'; form.independentWork = true; form.conflictOfInterest = false;
  form.attestation = 'Declaro una adjudicación humana independiente del par original.';
  form.items[0].adjudicatedDecision = 'supported'; form.items[0].rationale = 'Existe evidencia suficiente según el criterio dimensional completo.';
  assert.equal(validateCompletedDimensionalAdjudication(form).valid, false);
  form.adjudicator = 'A-01'; form.items[0].originalDecisions.reviewerA = 'unsupported';
  assert.throws(() => finalizeDimensionalAdjudication(source, form), /decisiones originales alteradas/);
});
