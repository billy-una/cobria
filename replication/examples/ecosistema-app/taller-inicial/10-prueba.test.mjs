import test from 'node:test';
import assert from 'node:assert/strict';
import { Observacion } from '../src/domain/observacion.mjs';

test('conserva la cantidad observada', () => {
  const observacion = new Observacion({
    id: 'obs-taller-001', ambito: 'reserva-sur', especie: 'colibri',
    cantidad: 3, revision: 1, observadaEn: '2026-10-19T12:00:00Z'
  });
  assert.equal(observacion.cantidad, 3);
});
