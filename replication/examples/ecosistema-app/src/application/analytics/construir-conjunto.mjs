import { ErrorCobria } from '../../domain/error-cobria.mjs';

export function construirConjuntoAnalitico({ documentos, ambito, corteTemporal, transformacion, calcularHuella, semilla = 20260921 }) {
  if (!ambito || !corteTemporal || !transformacion?.nombre || !transformacion?.version || typeof calcularHuella !== 'function') throw new ErrorCobria('ANALYTICS_CONFIG_INVALID', 'La configuración analítica no es válida');
  const corte = new Date(corteTemporal).getTime();
  if (!Number.isFinite(corte)) throw new ErrorCobria('ANALYTICS_CUTOFF_INVALID', 'El corte temporal no es válido');

  const elegibles = documentos
    .filter(item => item.ambito === ambito && item.consentimientoAnalitico === true)
    .map(item => ({ ...item, tiempoValido: new Date(item.observadaEn).getTime(), tiempoConocido: new Date(item.conocidaEn).getTime() }))
    .filter(item => Number.isFinite(item.tiempoValido) && Number.isFinite(item.tiempoConocido) && item.tiempoConocido <= corte)
    .sort((a, b) => a.id.localeCompare(b.id) || a.tiempoValido - b.tiempoValido);

  const entrenamiento = elegibles.filter(item => item.tiempoValido <= corte);
  const evaluacion = elegibles.filter(item => item.tiempoValido > corte);
  const idsEntrenamiento = new Set(entrenamiento.map(item => item.entidadId));
  if (evaluacion.some(item => idsEntrenamiento.has(item.entidadId))) throw new ErrorCobria('ANALYTICS_ENTITY_LEAKAGE', 'La partición presenta fuga entre entidades');

  const fuentes = elegibles.map(item => ({ id: item.id, revision: item.revision, ambito: item.ambito, huella: calcularHuella(item) }));
  const base = {
    contrato: 'cobria-conjunto-analitico-v1', ambito, corteTemporal: new Date(corte).toISOString(),
    transformacion, semilla, fuentes, exclusiones: { sinConsentimientoOAmbito: documentos.length - elegibles.length },
    particion: { estrategia: 'entidad-tiempo', entrenamiento: entrenamiento.map(item => item.id), evaluacion: evaluacion.map(item => item.id) },
  };
  return Object.freeze({ ...base, huella: calcularHuella(base), autoridadEscritura: false });
}
