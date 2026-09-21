const AMBITO = /^[a-z0-9][a-z0-9-]{2,63}$/;

export function crearProcesador({ registrar, idempotencia, publicarFallo, auditar }) {
  return async function procesar(evento, contexto) {
    const eventId = evento?.eventId?.trim();
    const ambito = evento?.data?.ambito;
    if (!eventId || !AMBITO.test(ambito ?? '')) throw new Error('EVENTO_INVALIDO');

    const clave = `${ambito}:${eventId}`;
    const previo = await idempotencia.obtener(clave);
    if (previo) return previo;

    try {
      const resultado = await registrar(evento.data, {
        actorId: contexto.actorId,
        finalidad: 'procesar-observacion',
        ambitos: [ambito],
        permisos: ['observaciones:escribir'],
        claveIdempotencia: eventId,
      });
      await idempotencia.guardar(clave, resultado);
      auditar({ eventId, ambito, resultado: 'procesado' });
      return resultado;
    } catch (error) {
      if (contexto.intento >= contexto.maximosIntentos) {
        await publicarFallo({ eventId, ambito, codigo: error.codigo ?? 'PROVIDER_FAILURE' });
      }
      auditar({ eventId, ambito, resultado: 'fallido', codigo: error.codigo ?? 'PROVIDER_FAILURE' });
      throw error;
    }
  };
}
