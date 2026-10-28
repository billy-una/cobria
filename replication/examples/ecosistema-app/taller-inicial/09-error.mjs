import { crearAplicacion } from '../src/composition.mjs';
const app = crearAplicacion();
const entrada = {
  id: 'obs-taller-001', ambito: 'reserva-sur', especie: 'colibri',
  cantidad: 3, revision: 1, observadaEn: '2026-10-19T12:00:00Z'
};
// Identidad de aprendizaje; no representa una sesión autenticada.
const contexto = {
  actorId: 'aprendiz', finalidad: 'aprendizaje', ambitos: ['reserva-sur'],
  permisos: ['observaciones:escribir', 'observaciones:leer'],
  claveIdempotencia: 'visita-taller-001'
};
try {
  const guardada = await app.registrar.ejecutar(entrada, contexto);
  await app.registrar.ejecutar(entrada, contexto);
  const lista = await app.listar.ejecutar({ambito: 'reserva-sur', limite: 10}, contexto);
  console.log(`Registrada: ${guardada.id}; cantidad: ${guardada.cantidad}`);
  console.log(`Tras repetir: ${lista.items.length} observación`);
} catch (error) {
  console.log(`Registro rechazado: ${error.codigo}`);
  process.exitCode = 1;
}
