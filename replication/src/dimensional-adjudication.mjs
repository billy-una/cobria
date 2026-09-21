const decisions = new Set(['supported', 'unsupported', 'insufficient']);

export function awaitingDimensionalAdjudication(agreement) {
  const received = agreement?.responseFilesReceived ?? agreement?.reviewers?.length ?? 0;
  return {
    schemaVersion: '1.0.0', phase: 30, status: 'prepared-awaiting-review-pair', proposalIndependent: true,
    officialCertification: false, sourcePhase: 29, responseFilesReceived: received,
    disagreementsAvailable: 0, adjudicationsCompleted: 0, adjudicatorAttested: false,
    interpretation: 'Mecanismo de una propuesta independiente; sin un par humano válido no existen desacuerdos adjudicables.'
  };
}

export function buildDimensionalAdjudicationForm(agreement, adjudicator = 'A-01') {
  if (agreement?.status !== 'proposal-review-pair-processed' || agreement?.pairedJudgments !== 72) throw new Error('se requiere un acuerdo completo de la Fase 29');
  if (!Array.isArray(agreement.disagreements)) throw new Error('faltan desacuerdos trazables');
  return {
    schemaVersion: '1.0.0', phase: 30, status: agreement.disagreements.length ? 'blank-adjudication' : 'no-adjudication-required',
    proposalIndependent: true, officialCertification: false, adjudicator, type: null, independentWork: null,
    conflictOfInterest: null, excludedReviewers: [...agreement.reviewers], sourceAgreement: {
      pairedJudgments: agreement.pairedJudgments, observedAgreement: agreement.observedAgreement,
      cohenKappa: agreement.cohenKappa
    },
    items: agreement.disagreements.map(item => ({
      key: item.key, originalDecisions: { reviewerA: item.reviewerA, reviewerB: item.reviewerB },
      adjudicatedDecision: null, rationale: '', evidenceRequested: false
    })),
    attestation: null
  };
}

export function validateCompletedDimensionalAdjudication(form) {
  const errors = [];
  if (form?.phase !== 30 || form?.status !== 'blank-adjudication') errors.push('formulario de adjudicación inválido');
  if (form?.type !== 'human' || form?.independentWork !== true) errors.push('se requiere adjudicación humana independiente');
  if (form?.conflictOfInterest !== false) errors.push('un conflicto declarado impide incluir la adjudicación');
  if ((form?.excludedReviewers ?? []).includes(form?.adjudicator)) errors.push('el adjudicador no puede ser uno de los revisores originales');
  if (!form?.attestation || form.attestation.length < 20) errors.push('atestación insuficiente');
  if (!(form?.items ?? []).length) errors.push('no existen desacuerdos para adjudicar');
  for (const item of form?.items ?? []) {
    if (!item.key || !decisions.has(item.originalDecisions?.reviewerA) || !decisions.has(item.originalDecisions?.reviewerB)) errors.push('decisiones originales inválidas');
    if (!decisions.has(item.adjudicatedDecision)) errors.push(`${item.key}: decisión adjudicada inválida`);
    if (!item.rationale || item.rationale.length < 20) errors.push(`${item.key}: justificación insuficiente`);
  }
  return { valid: errors.length === 0, errors };
}

export function finalizeDimensionalAdjudication(agreement, form) {
  const validation = validateCompletedDimensionalAdjudication(form);
  if (!validation.valid) throw new Error(validation.errors.join('; '));
  if (agreement.disagreements.length !== form.items.length) throw new Error('la adjudicación no conserva todos los desacuerdos');
  const agreementByKey = new Map(agreement.disagreements.map(item => [item.key, item]));
  for (const item of form.items) {
    const source = agreementByKey.get(item.key);
    if (!source || source.reviewerA !== item.originalDecisions.reviewerA || source.reviewerB !== item.originalDecisions.reviewerB) throw new Error(`${item.key}: decisiones originales alteradas`);
  }
  return {
    schemaVersion: '1.0.0', phase: 30, status: 'proposal-adjudication-processed', proposalIndependent: true,
    officialCertification: false, adjudicator: form.adjudicator, sourceReviewers: [...agreement.reviewers],
    disagreementsReceived: agreement.disagreements.length, adjudicationsCompleted: form.items.length,
    items: form.items.map(item => ({ key: item.key, originalDecisions: item.originalDecisions, adjudicatedDecision: item.adjudicatedDecision, rationale: item.rationale })),
    interpretation: 'La adjudicación conserva decisiones originales y resuelve desacuerdos dentro de una propuesta; no certifica calidad, operación ni conformidad oficial.'
  };
}
