import test from 'node:test';
import assert from 'node:assert/strict';
import { crearProcesador } from '../templates/cloud-function/procesar-observacion.mjs';

test('la Function reutiliza resultado idempotente y conserva ámbito', async () => {
  const resultados = new Map();
  let llamadas = 0;
  const procesar = crearProcesador({
    registrar: async (dato, contexto) => { llamadas += 1; assert.deepEqual(contexto.ambitos, [dato.ambito]); return { id: dato.id }; },
    idempotencia: { obtener: async (k) => resultados.get(k), guardar: async (k, v) => resultados.set(k, v) },
    publicarFallo: async () => assert.fail('no debía publicar fallo'),
    auditar: () => undefined,
  });
  const evento = { eventId: 'evt-1', data: { id: 'obs-1', ambito: 'bosque-a' } };
  const contexto = { actorId: 'worker-1', intento: 1, maximosIntentos: 5 };
  assert.deepEqual(await procesar(evento, contexto), { id: 'obs-1' });
  assert.deepEqual(await procesar(evento, contexto), { id: 'obs-1' });
  assert.equal(llamadas, 1);
});

test('la Function envía a dead-letter solo al agotar intentos', async () => {
  const fallos = [];
  const procesar = crearProcesador({
    registrar: async () => { const error = new Error('temporal'); error.codigo = 'PROVIDER_FAILURE'; throw error; },
    idempotencia: { obtener: async () => null, guardar: async () => undefined },
    publicarFallo: async (fallo) => fallos.push(fallo),
    auditar: () => undefined,
  });
  const evento = { eventId: 'evt-2', data: { id: 'obs-2', ambito: 'bosque-a' } };
  await assert.rejects(() => procesar(evento, { actorId: 'worker-1', intento: 5, maximosIntentos: 5 }));
  assert.equal(fallos.length, 1);
  assert.equal(fallos[0].codigo, 'PROVIDER_FAILURE');
});
