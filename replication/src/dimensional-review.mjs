import crypto from 'node:crypto';

const decisions = new Set(['supported', 'unsupported', 'insufficient']);

export function buildDimensionalReviewForms({ rubric, samples, reviewers = ['R-A', 'R-B'] }) {
  if (!Array.isArray(rubric?.contracts) || rubric.contracts.length !== 8) throw new Error('rúbrica incompleta');
  if (!Array.isArray(samples) || samples.length !== 3) throw new Error('se requieren tres muestras');
  if (new Set(reviewers).size !== 2) throw new Error('se requieren dos revisores distintos');
  return reviewers.map(reviewer => ({
    schemaVersion: '1.0.0',
    phase: 28,
    reviewer,
    type: null,
    independentWork: null,
    conflictOfInterest: null,
    status: 'blank-independent-review',
    samples: samples.map(sample => ({
      sample: sample.code,
      contracts: rubric.contracts.map(contract => ({
        id: contract.id,
        dimensions: contract.dimensions.map(dimension => ({
          id: dimension.id,
          criterion: dimension.criterion,
          insufficientExample: dimension.insufficient,
          evidence: sample.evidenceByContract[contract.id] ?? [],
          decision: null,
          confidence: null,
          rationale: ''
        }))
      }))
    })),
    attestation: null
  }));
}

export function validateBlankDimensionalReviewForm(form) {
  const errors = [];
  if (form?.phase !== 28 || form?.status !== 'blank-independent-review') errors.push('formulario o estado inválido');
  if (form?.type !== null || form?.independentWork !== null || form?.attestation !== null) errors.push('la atestación debe permanecer vacía');
  const dimensions = (form?.samples ?? []).flatMap(sample => (sample.contracts ?? []).flatMap(contract => contract.dimensions ?? []));
  if ((form?.samples ?? []).length !== 3 || dimensions.length !== 72) errors.push('se requieren tres muestras y 72 dimensiones');
  if (dimensions.some(item => item.decision !== null || item.confidence !== null || item.rationale !== '')) errors.push('el formulario contiene respuestas precargadas');
  const serialized = JSON.stringify(form);
  if (/github\.com|posguapiles|crmhotel|bshandball|expectedCommit|remote/i.test(serialized)) errors.push('el formulario filtra identidad de proyecto');
  return { valid: errors.length === 0, errors, summary: { dimensions: dimensions.length } };
}

export function validateCompletedDimensionalReviewForm(form) {
  const errors = [];
  const dimensions = (form?.samples ?? []).flatMap(sample => (sample.contracts ?? []).flatMap(contract => contract.dimensions ?? []));
  if (form?.type !== 'human' || form?.independentWork !== true) errors.push('se requiere atestación humana e independiente');
  if (typeof form?.conflictOfInterest !== 'boolean') errors.push('debe declararse conflicto de interés');
  if (!form?.attestation || form.attestation.length < 20) errors.push('atestación insuficiente');
  for (const item of dimensions) {
    if (!decisions.has(item.decision)) errors.push(`${item.id}: decisión inválida`);
    if (!Number.isInteger(item.confidence) || item.confidence < 1 || item.confidence > 5) errors.push(`${item.id}: confianza inválida`);
    if (!item.rationale || item.rationale.length < 20) errors.push(`${item.id}: justificación insuficiente`);
  }
  return { valid: errors.length === 0, errors };
}

export function evidenceAlias(sample, contract, index, excerpt) {
  const digest = crypto.createHash('sha256').update(excerpt).digest('hex');
  return { source: `${sample}-${contract}-${index + 1}`, excerpt, sha256: digest };
}
