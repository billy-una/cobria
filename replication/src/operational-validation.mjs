const scenarioIds = new Set(['OP-01', 'OP-02', 'OP-03', 'OP-04', 'OP-05']);

export function validateOperationalPlan(plan) {
  const errors = [];
  if (plan?.schemaVersion !== '1.0.0' || plan?.status !== 'proposal') errors.push('identidad del plan inválida');
  if (plan?.officialCertification !== false) errors.push('el plan no puede certificar');
  const scenarios = plan?.scenarios ?? [];
  if (scenarios.length !== 5 || new Set(scenarios.map(item => item.id)).size !== 5 || scenarios.some(item => !scenarioIds.has(item.id))) errors.push('se requieren OP-01..OP-05 únicos');
  for (const scenario of scenarios) {
    if (!scenario.owner || !scenario.hypothesis || !scenario.injection || !scenario.expected || !scenario.abort) errors.push(`${scenario.id}: contrato operacional incompleto`);
    if (!Array.isArray(scenario.requiredEvidence) || scenario.requiredEvidence.length < 2) errors.push(`${scenario.id}: evidencia insuficiente`);
  }
  return { valid: errors.length === 0, errors };
}

export function blankOperationalRun(plan) {
  const validation = validateOperationalPlan(plan);
  if (!validation.valid) throw new Error(validation.errors.join('; '));
  return {
    schemaVersion: '1.0.0', phase: 31, status: 'prepared-not-operationally-executed', proposalIndependent: true,
    officialCertification: false, environment: { kind: null, name: null, authorized: null, containsProductionPersonalData: null },
    execution: { runId: null, actor: null, startedAt: null, endedAt: null, artifactSha256: null, synthetic: null },
    scenarios: plan.scenarios.map(item => ({ id: item.id, result: null, observations: '', evidence: [], incident: null })),
    summary: { executed: 0, passed: 0, failed: 0 },
    interpretation: 'Plantilla de una propuesta independiente; no existe validación operacional hasta aportar evidencia auténtica.'
  };
}

export function validateOperationalRun(run) {
  const errors = [];
  if (run?.phase !== 31 || run?.proposalIndependent !== true || run?.officialCertification !== false) errors.push('identidad de propuesta inválida');
  if (!['staging', 'controlled'].includes(run?.environment?.kind) || run?.environment?.authorized !== true) errors.push('ambiente no autorizado');
  if (run?.environment?.containsProductionPersonalData !== false) errors.push('no se permiten datos personales de producción');
  if (run?.execution?.synthetic !== false) errors.push('una simulación no cuenta como ejecución operacional');
  if (!run?.execution?.runId || !run?.execution?.actor || !run?.execution?.startedAt || !run?.execution?.endedAt) errors.push('metadatos de ejecución incompletos');
  if (!/^[a-f0-9]{64}$/.test(run?.execution?.artifactSha256 ?? '')) errors.push('huella de artefacto inválida');
  const scenarios = run?.scenarios ?? [];
  if (scenarios.length !== 5 || new Set(scenarios.map(item => item.id)).size !== 5 || scenarios.some(item => !scenarioIds.has(item.id))) errors.push('escenarios incompletos');
  for (const scenario of scenarios) {
    if (!['pass', 'fail'].includes(scenario.result)) errors.push(`${scenario.id}: resultado inválido`);
    if (!scenario.observations || scenario.observations.length < 20) errors.push(`${scenario.id}: observación insuficiente`);
    if (!Array.isArray(scenario.evidence) || scenario.evidence.length < 2) errors.push(`${scenario.id}: faltan evidencias`);
    for (const evidence of scenario.evidence ?? []) if (!evidence.type || !evidence.path || !/^[a-f0-9]{64}$/.test(evidence.sha256 ?? '')) errors.push(`${scenario.id}: evidencia inválida`);
  }
  return { valid: errors.length === 0, errors };
}

export function summarizeOperationalRun(run) {
  const validation = validateOperationalRun(run);
  if (!validation.valid) throw new Error(validation.errors.join('; '));
  const passed = run.scenarios.filter(item => item.result === 'pass').length;
  const failed = run.scenarios.length - passed;
  return {
    schemaVersion: '1.0.0', phase: 31, status: failed ? 'proposal-operational-run-with-failures' : 'proposal-operational-run-complete',
    proposalIndependent: true, officialCertification: false, runId: run.execution.runId,
    executed: run.scenarios.length, passed, failed,
    interpretation: 'Resultado acotado de una propuesta en un ambiente declarado; no demuestra universalidad, producción ni certificación oficial.'
  };
}
