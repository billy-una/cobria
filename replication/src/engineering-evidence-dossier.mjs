import { validateEngineeringRubric } from './engineering-rubric.mjs';

const allowedStructural = new Set(['implemented-local', 'gap']);

export function buildEngineeringEvidenceDossier(rubric, projects) {
  const rubricValidation = validateEngineeringRubric(rubric);
  if (!rubricValidation.valid) throw new Error(rubricValidation.errors.join('; '));
  if (!Array.isArray(projects) || projects.length !== 3) throw new Error('se requieren exactamente tres proyectos');

  const seen = new Set();
  const assessments = projects.map(({ id, report }) => {
    if (!id || seen.has(id)) throw new Error('los identificadores de proyecto deben ser únicos');
    seen.add(id);
    if (!report?.project?.commit || !Array.isArray(report?.checks)) throw new Error(`${id}: informe inválido`);
    const checks = new Map(report.checks.map(check => [check.id, check]));
    const contracts = rubric.contracts.map(contract => {
      const check = checks.get(contract.id);
      if (!check || !allowedStructural.has(check.structuralStatus)) throw new Error(`${id}/${contract.id}: evidencia estructural ausente o desconocida`);
      const candidateEvidence = (check.evidence ?? []).map(item => ({
        path: item.path,
        sha256: item.sha256,
        observedTokens: (item.tokens ?? []).filter(token => token.found).map(token => token.token)
      }));
      return {
        id: contract.id,
        sourceStructuralStatus: check.structuralStatus,
        dimensions: contract.dimensions.map(dimension => ({
          id: dimension.id,
          decision: 'pending-semantic-review',
          candidateEvidence,
          rationale: 'La evidencia de nivel contrato debe revisarse contra el criterio específico de esta dimensión.'
        }))
      };
    });
    return {
      id,
      source: { remote: report.project.remote, commit: report.project.commit, mode: report.project.sourceMode },
      contracts
    };
  });

  const dimensions = assessments.flatMap(project => project.contracts.flatMap(contract => contract.dimensions));
  return {
    schemaVersion: '1.0.0',
    phase: 27,
    status: 'proposal-evidence-dossier',
    officialCertification: false,
    method: 'cobria-engineering-dimensional-review-queue-v1',
    assessments,
    summary: {
      projects: assessments.length,
      contractsPerProject: rubric.contracts.length,
      decisions: dimensions.length,
      pendingSemanticReview: dimensions.filter(item => item.decision === 'pending-semantic-review').length,
      supported: 0,
      operationallyValidated: 0
    },
    interpretation: 'Expediente de evidencia candidata de una propuesta. No certifica cumplimiento, calidad, operación ni madurez de los proyectos.'
  };
}

export function validateEngineeringEvidenceDossier(dossier) {
  const errors = [];
  if (dossier?.schemaVersion !== '1.0.0' || dossier?.phase !== 27) errors.push('identidad de formato inválida');
  if (dossier?.status !== 'proposal-evidence-dossier' || dossier?.officialCertification !== false) errors.push('el expediente debe ser una propuesta no oficial');
  const projects = dossier?.assessments ?? [];
  if (projects.length !== 3 || new Set(projects.map(item => item.id)).size !== 3) errors.push('se requieren tres proyectos únicos');
  const dimensions = projects.flatMap(project => (project.contracts ?? []).flatMap(contract => contract.dimensions ?? []));
  if (projects.some(project => (project.contracts ?? []).length !== 8)) errors.push('cada proyecto requiere ocho contratos');
  if (dimensions.length !== 72) errors.push('se requieren 72 decisiones dimensionales');
  if (dimensions.some(item => item.decision !== 'pending-semantic-review')) errors.push('ninguna decisión puede resolverse automáticamente');
  if (dossier?.summary?.supported !== 0 || dossier?.summary?.operationallyValidated !== 0) errors.push('no se permiten afirmaciones de cumplimiento u operación');
  if (!/no certifica/i.test(dossier?.interpretation ?? '')) errors.push('falta límite explícito contra certificación');
  return { valid: errors.length === 0, errors, summary: { projects: projects.length, decisions: dimensions.length } };
}
