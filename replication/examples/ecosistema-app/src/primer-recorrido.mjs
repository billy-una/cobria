import { crearAplicacion } from './composition.mjs';

// Composición de una demostración con identidad sintética, no autenticación real.
export async function ejecutarPrimerRecorrido() {
  const app = crearAplicacion();
  const entrada = {id:'obs-001', ambito:'reserva-sur', especie:'colibri', cantidad:3,
    revision:1, observadaEn:'2026-10-17T12:00:00Z'};
  const contexto = {actorId:'guardaparques-demo', finalidad:'aprendizaje',
    ambitos:['reserva-sur'], permisos:['observaciones:escribir','observaciones:leer'],
    claveIdempotencia:'visita-demo-001'};
  const registrada = await app.registrar.ejecutar(entrada, contexto);
  const repetida = await app.registrar.ejecutar(entrada, contexto);
  async function rechazo(otraEntrada, otroContexto) {
    try { await app.registrar.ejecutar(otraEntrada, otroContexto); }
    catch (error) { return error.codigo; }
    throw new Error('La demostración esperaba un rechazo y la operación fue aceptada');
  }
  const cantidadCero = await rechazo({...entrada, id:'obs-cero', cantidad:0},
    {...contexto, claveIdempotencia:'visita-cero'});
  const otraReserva = await rechazo({...entrada, ambito:'reserva-norte'},
    {...contexto, claveIdempotencia:'visita-ajena'});
  const resumen = await app.reconstruir.ejecutar('reserva-sur', contexto);
  const cantidadDocumentos = (await app.listar.ejecutar({ambito:'reserva-sur', limite:10}, contexto));
  return {registrada, repetida, cantidadCero, otraReserva, resumen, listado:cantidadDocumentos};
}

export function describirRecorrido(resultado) {
  return [
    `Observación registrada: ${resultado.registrada.id} (revisión ${resultado.registrada.revision})`,
    `Repetición segura: ${resultado.listado.items.length} observación`,
    `Cantidad cero: ${resultado.cantidadCero}`,
    `Otra reserva: ${resultado.otraReserva}`,
    `Resumen: colibri = ${resultado.resumen.conteos.colibri}`,
    'Este ejemplo usa memoria; al cerrar se pierden los datos.'
  ].join('\n');
}
