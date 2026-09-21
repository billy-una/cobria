import { ErrorCobria } from '../../domain/error-cobria.mjs';

export function evaluarDeriva({ referencia, actual, umbral }) {
  if (!referencia?.length || !actual?.length || !Number.isFinite(umbral) || umbral < 0) throw new ErrorCobria('DRIFT_CONFIG_INVALID', 'La configuración de deriva no es válida');
  const media = values => values.reduce((sum, value) => sum + value, 0) / values.length;
  const puntuacion = Math.abs(media(referencia) - media(actual));
  return Object.freeze({ puntuacion, umbral, alerta: puntuacion >= umbral, autoridadEscritura: false });
}
