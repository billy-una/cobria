import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCobriaBudget, percentile, serializableState, summarize } from '../src/performance.mjs';

test('calcula percentiles y dispersión sin eliminar observaciones', () => {
  const result = summarize([1, 2, 3, 4, 100]);
  assert.equal(result.count, 5);
  assert.equal(result.p50, 3);
  assert.equal(result.p95, 80.79999999999998);
  assert.equal(result.mad, 1);
  assert.equal(result.iqr, 2);
  assert.equal(percentile([1, 3], 0.5), 2);
});

test('contabiliza el contenido de un índice Map', () => {
  const state = serializableState(new Map([['scope:species', [{ id: 'obs-1' }]]]));
  assert.deepEqual(state, [['scope:species', [{ id: 'obs-1' }]]]);
  assert.ok(JSON.stringify(state).length > 2);
});

test('el presupuesto produce verificaciones explicables y puede fallar', () => {
  const metric = (p50, p99 = p50) => ({ p50, p99 });
  const baseline = { storageBytes: metric(1000) };
  const row = { queryMs: metric(1, 9), recoveryMs: metric(2), writeAmplification: metric(1.2), storageBytes: metric(200) };
  const result = evaluateCobriaBudget(row, baseline, { queryP99Ms: 8, recoveryP50Ms: 3, writeAmplification: 1.21, storageRatio: 0.25 });
  assert.equal(result.passed, false);
  assert.equal(result.checks.find((check) => check.metric === 'queryP99Ms').passed, false);
});
