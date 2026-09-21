import test from 'node:test';
import assert from 'node:assert/strict';
import { crearEventoLog, RegistroMetricas } from '../src/observability.mjs';

test('el log usa lista positiva y excluye payload y secretos', () => {
  const event = crearEventoLog({ level:'info', event:'observacion.registrada', service:'ecosistema-api', traceId:'tr-1', result:'ok', scope:'bosque-a', payload:{ secreto:'x' }, token:'x' }, () => '2026-09-19T12:00:00Z');
  assert.equal(event.scope, 'bosque-a');
  assert.equal('payload' in event, false);
  assert.equal('token' in event, false);
});

test('las métricas rechazan etiquetas de cardinalidad peligrosa', () => {
  const metrics = new RegistroMetricas();
  metrics.incrementar('requests_total', { service:'ecosistema-api', result:'ok' });
  metrics.observar('duration_ms', 12, { operation:'registrar' });
  assert.equal(metrics.snapshot().counters['requests_total{result=ok,service=ecosistema-api}'], 1);
  assert.throws(() => metrics.incrementar('requests_total', { documentId:'obs-1' }), /HIGH_CARDINALITY/);
});
