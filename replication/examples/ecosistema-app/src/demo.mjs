import { crearAplicacion } from './composition.mjs';

const app = crearAplicacion();
const contexto = {
  ambitos: ['reserva-sur'],
  permisos: ['observaciones:escribir', 'observaciones:leer'],
  claveIdempotencia: 'visita-2026-001'
};

await app.registrar.ejecutar({
  id: 'obs-001', ambito: 'reserva-sur', especie: 'colibri', cantidad: 3,
  revision: 1, observadaEn: '2026-09-04T14:00:00Z'
}, contexto);

console.log(await app.reconstruir.ejecutar('reserva-sur', contexto));
