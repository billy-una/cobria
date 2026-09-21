import { Observacion } from '../domain/observacion.mjs';
import { ErrorCobria } from '../domain/error-cobria.mjs';

export class RegistrarObservacion {
  constructor({ repositorio, autorizar, calcularHuella }) {
    this.repositorio = repositorio;
    this.autorizar = autorizar;
    this.calcularHuella = calcularHuella;
  }

  async ejecutar(entrada, contexto) {
    if (!contexto?.claveIdempotencia) throw new ErrorCobria('IDEMPOTENCY_KEY_REQUIRED', 'La clave de idempotencia es obligatoria');
    this.autorizar(contexto, 'observaciones:escribir', entrada.ambito);

    const firma = this.calcularHuella(entrada);
    const anterior = await this.repositorio.buscarOperacion(entrada.ambito, contexto.claveIdempotencia);
    if (anterior) {
      if (anterior.firma !== firma) throw new ErrorCobria('IDEMPOTENCY_CONFLICT', 'La clave de idempotencia ya fue usada con otra entrada');
      return anterior.resultado;
    }

    const observacion = new Observacion(entrada);
    await this.repositorio.guardar(observacion);
    await this.repositorio.registrarOperacion(entrada.ambito, contexto.claveIdempotencia, firma, observacion);
    return observacion;
  }
}
