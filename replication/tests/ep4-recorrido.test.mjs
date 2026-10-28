import test from 'node:test';
import assert from 'node:assert/strict';
import { ejecutarRecorrido } from '../examples/integral-c8/recorrido-ep4.mjs';

for (const cantidad of [3, 4]) test(`EP4 recorrido completo con cantidad ${cantidad}`, async () => {
  const resultado = await ejecutarRecorrido({ cantidad });
  assert.equal(resultado.analitica.cantidad, cantidad);
  assert.equal(resultado.hitos.length, 7);
  assert.equal(resultado.rechazos.length, 4);
  assert.equal(resultado.analitica.entrenamientoHabilitado, false);
  assert.equal(resultado.evidencia.autoridadEscritura, false);
});
for (const cantidad of [0, -1, 1.5, NaN]) test(`EP4 rechaza cantidad ${cantidad}`, async () => {
  await assert.rejects(() => ejecutarRecorrido({ cantidad }), /Cantidad positiva/);
});
