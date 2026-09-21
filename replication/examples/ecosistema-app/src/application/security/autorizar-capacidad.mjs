import { ErrorCobria } from '../../domain/error-cobria.mjs';

const AMBITO_VALIDO = /^[a-z0-9][a-z0-9-]{2,63}$/;

export function crearAutorizador({ auditar, ahora = () => new Date().toISOString() }) {
  return (contexto, capacidad, ambito) => {
    const actorId = contexto?.actorId?.trim();
    const finalidad = contexto?.finalidad?.trim();
    const base = { actorId: actorId || 'anonimo', capacidad, ambito, finalidad: finalidad || 'no-declarada' };

    if (!AMBITO_VALIDO.test(ambito ?? '')) {
      auditar({ ...base, resultado: 'denegado', codigo: 'SCOPE_INVALID', ocurridoEn: ahora() });
      throw new ErrorCobria('SCOPE_INVALID', 'Ámbito inválido');
    }

    const autorizado = actorId && finalidad
      && contexto?.permisos?.includes(capacidad)
      && contexto?.ambitos?.includes(ambito);

    if (!autorizado) {
      auditar({ ...base, resultado: 'denegado', codigo: 'ACCESS_DENIED', ocurridoEn: ahora() });
      throw new ErrorCobria('ACCESS_DENIED', 'Acceso denegado');
    }

    auditar({ ...base, resultado: 'permitido', codigo: 'ACCESS_GRANTED', ocurridoEn: ahora() });
  };
}
