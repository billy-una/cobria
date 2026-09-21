import { validateCompletedDimensionalReviewForm } from './dimensional-review.mjs';

const categories = ['supported', 'unsupported', 'insufficient'];

function flatten(form) {
  const rows = new Map();
  for (const sample of form.samples ?? []) for (const contract of sample.contracts ?? []) for (const dimension of contract.dimensions ?? []) {
    const key = `${sample.sample}/${contract.id}/${dimension.id}`;
    if (rows.has(key)) throw new Error(`${form.reviewer}: decisión duplicada ${key}`);
    rows.set(key, { key, sample: sample.sample, contract: contract.id, dimension: dimension.id, decision: dimension.decision });
  }
  return rows;
}

export function computeDimensionalAgreement(formA, formB) {
  for (const form of [formA, formB]) {
    const validation = validateCompletedDimensionalReviewForm(form);
    if (!validation.valid) throw new Error(`${form?.reviewer ?? 'revisor'}: ${validation.errors.join('; ')}`);
    if (form.conflictOfInterest) throw new Error(`${form.reviewer}: conflicto de interés declarado; requiere decisión del coordinador`);
  }
  if (formA.reviewer === formB.reviewer) throw new Error('se requieren dos revisores distintos');
  const a = flatten(formA); const b = flatten(formB);
  if (a.size !== 72 || b.size !== 72 || [...a.keys()].some(key => !b.has(key))) throw new Error('los formularios no contienen las mismas 72 dimensiones');

  const countsA = Object.fromEntries(categories.map(category => [category, 0]));
  const countsB = Object.fromEntries(categories.map(category => [category, 0]));
  const disagreements = [];
  let matches = 0;
  for (const [key, left] of a) {
    const right = b.get(key);
    countsA[left.decision] += 1; countsB[right.decision] += 1;
    if (left.decision === right.decision) matches += 1;
    else disagreements.push({ key, reviewerA: left.decision, reviewerB: right.decision });
  }
  const total = a.size;
  const observedAgreement = matches / total;
  const expectedAgreement = categories.reduce((sum, category) => sum + (countsA[category] / total) * (countsB[category] / total), 0);
  const cohenKappa = expectedAgreement === 1 ? (observedAgreement === 1 ? 1 : null) : (observedAgreement - expectedAgreement) / (1 - expectedAgreement);
  return {
    schemaVersion: '1.0.0', phase: 29, status: 'proposal-review-pair-processed', officialCertification: false,
    reviewers: [formA.reviewer, formB.reviewer], pairedJudgments: total, matches, disagreements,
    observedAgreement, expectedAgreement, cohenKappa, distributions: { [formA.reviewer]: countsA, [formB.reviewer]: countsB },
    interpretation: 'El acuerdo describe consistencia entre dos revisores de una propuesta; no certifica verdad, calidad, operación ni conformidad oficial.'
  };
}

export function awaitingDimensionalAgreement(filesReceived = 0) {
  return {
    schemaVersion: '1.0.0', phase: 29, status: 'prepared-awaiting-human-responses', officialCertification: false,
    reviewersRequired: 2, responseFilesReceived: filesReceived, pairedJudgments: 0,
    observedAgreement: null, expectedAgreement: null, cohenKappa: null, disagreements: [],
    interpretation: 'Instrumento de una propuesta sin respuestas humanas completas; no existe acuerdo calculado ni certificación.'
  };
}
