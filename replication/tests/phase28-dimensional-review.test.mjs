import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildDimensionalReviewForms, validateBlankDimensionalReviewForm, validateCompletedDimensionalReviewForm } from '../src/dimensional-review.mjs';

const rubric = JSON.parse(fs.readFileSync('../specification/phase-26/engineering-dimensional-rubric.json', 'utf8'));
const samples = ['M-01', 'M-02', 'M-03'].map(code => ({ code, evidenceByContract: Object.fromEntries(rubric.contracts.map(c => [c.id, [{ source: `${code}-${c.id}-1`, excerpt: 'Fragmento seudónimo suficiente para probar la estructura del formulario.', sha256: 'a'.repeat(64) }]])) }));

test('crea dos formularios independientes con 72 decisiones vacías', () => {
  const forms = buildDimensionalReviewForms({ rubric, samples });
  assert.equal(forms.length, 2);
  for (const form of forms) assert.deepEqual(validateBlankDimensionalReviewForm(form), { valid: true, errors: [], summary: { dimensions: 72 } });
});

test('el formulario ciego rechaza identidades y respuestas precargadas', () => {
  const [form] = buildDimensionalReviewForms({ rubric, samples });
  form.samples[0].contracts[0].dimensions[0].evidence[0].excerpt = 'github.com/acme/proyecto';
  form.samples[0].contracts[0].dimensions[0].decision = 'supported';
  assert.equal(validateBlankDimensionalReviewForm(form).valid, false);
});

test('una respuesta solo es completa con atestación y 72 justificaciones', () => {
  const [form] = buildDimensionalReviewForms({ rubric, samples });
  form.type = 'human'; form.independentWork = true; form.conflictOfInterest = false;
  form.attestation = 'Declaro que revisé las muestras de forma independiente.';
  for (const sample of form.samples) for (const contract of sample.contracts) for (const dimension of contract.dimensions) {
    dimension.decision = 'insufficient'; dimension.confidence = 3; dimension.rationale = 'El fragmento no permite confirmar todo el criterio dimensional.';
  }
  assert.equal(validateCompletedDimensionalReviewForm(form).valid, true);
});
