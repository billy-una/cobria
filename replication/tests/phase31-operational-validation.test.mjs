import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { blankOperationalRun, summarizeOperationalRun, validateOperationalPlan, validateOperationalRun } from '../src/operational-validation.mjs';

const plan = JSON.parse(fs.readFileSync('../specification/phase-31/operational-plan.json', 'utf8'));
const completedFixture = () => {
  const run = blankOperationalRun(plan);
  run.environment = { kind: 'controlled', name: 'fixture-local', authorized: true, containsProductionPersonalData: false };
  run.execution = { runId: 'fixture-no-evidence', actor: 'test-runner', startedAt: '2026-01-01T00:00:00Z', endedAt: '2026-01-01T00:05:00Z', artifactSha256: 'a'.repeat(64), synthetic: false };
  for (const scenario of run.scenarios) {
    scenario.result = 'pass'; scenario.observations = 'Observación sintética destinada solamente a validar el esquema del instrumento.';
    scenario.evidence = [{ type: 'log', path: `fixtures/${scenario.id}.log`, sha256: 'b'.repeat(64) }, { type: 'report', path: `fixtures/${scenario.id}.json`, sha256: 'c'.repeat(64) }];
  }
  return run;
};

test('el plan define cinco escenarios operacionales completos', () => assert.equal(validateOperationalPlan(plan).valid, true));
test('la plantilla nace sin resultados ni certificación', () => {
  const run = blankOperationalRun(plan);
  assert.equal(run.scenarios.every(item => item.result === null), true); assert.equal(run.summary.executed, 0); assert.equal(run.officialCertification, false);
});
test('un bundle completo puede resumirse sin convertirse en certificación', () => {
  const result = summarizeOperationalRun(completedFixture());
  assert.deepEqual({ executed: result.executed, passed: result.passed, failed: result.failed }, { executed: 5, passed: 5, failed: 0 });
  assert.equal(result.officialCertification, false);
});
test('rechaza simulación, datos personales y evidencia incompleta', () => {
  const run = completedFixture(); run.execution.synthetic = true; run.environment.containsProductionPersonalData = true; run.scenarios[0].evidence = [];
  const validation = validateOperationalRun(run); assert.equal(validation.valid, false); assert.match(validation.errors.join(' '), /simulación|datos personales|evidencias/);
});
