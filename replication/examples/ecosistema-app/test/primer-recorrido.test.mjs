import test from 'node:test';
import assert from 'node:assert/strict';
import { ejecutarPrimerRecorrido, describirRecorrido } from '../src/primer-recorrido.mjs';

test('el primer recorrido registra, evita duplicados y demuestra los dos rechazos', async () => {
  const result = await ejecutarPrimerRecorrido();
  assert.equal(result.registrada.revision, 1);
  assert.deepEqual(result.registrada, result.repetida);
  assert.equal(result.listado.items.length, 1);
  assert.equal(result.cantidadCero, 'OBS_QUANTITY_INVALID');
  assert.equal(result.otraReserva, 'ACCESS_DENIED');
  assert.deepEqual(result.resumen.conteos, {colibri:3});
});

test('la demostración tiene una salida repetible y no promete persistencia', async () => {
  const first = describirRecorrido(await ejecutarPrimerRecorrido());
  assert.equal(describirRecorrido(await ejecutarPrimerRecorrido()), first);
  assert.match(first, /Repetición segura: 1 observación/);
  assert.match(first, /al cerrar se pierden los datos/);
});
