export function validateExternalStatus(document) {
  const errors = [];
  const ids = new Set();
  for (const milestone of document.milestones ?? []) {
    if (ids.has(milestone.id)) errors.push({ code: 'P18_ID_DUPLICATED', id: milestone.id });
    ids.add(milestone.id);
    const external = milestone.id !== 'P18-LOCAL';
    if (external && ['executed', 'complete', 'validated'].includes(milestone.status)) {
      if (!(milestone.evidence ?? []).length) errors.push({ code: 'P18_EXTERNAL_EVIDENCE_REQUIRED', id: milestone.id });
      if (!['human', 'external-service'].includes(milestone.attestedBy?.type)) errors.push({ code: 'P18_EXTERNAL_ATTESTATION_REQUIRED', id: milestone.id });
    }
  }
  return { valid: errors.length === 0, errors };
}

export function validateReviewRecord(record) {
  const errors = [];
  for (const field of ['reviewerCode', 'date', 'version', 'conflictStatement', 'findings', 'recommendation']) if (record[field] === undefined || record[field] === '' || (Array.isArray(record[field]) && !record[field].length)) errors.push({ code: 'P18_REVIEW_FIELD_REQUIRED', field });
  if ((record.conflictStatement ?? '').length < 10) errors.push({ code: 'P18_CONFLICT_STATEMENT_TOO_SHORT' });
  if (!['accept', 'minor-revision', 'major-revision', 'reject'].includes(record.recommendation)) errors.push({ code: 'P18_RECOMMENDATION_INVALID' });
  return { valid: errors.length === 0, errors };
}
