import { Observacion } from '../../domain/observacion.mjs';
import { ErrorCobria } from '../../domain/error-cobria.mjs';

export class ObservacionDater {
  haciaFisico(observacion) {
    return {
      a: observacion.id,
      b: observacion.ambito,
      c: observacion.revision,
      d: 1,
      e: observacion.observadaEn,
      f: observacion.especie,
      g: observacion.cantidad,
    };
  }

  desdeFisico(documento) {
    if (documento?.d !== 1) throw new ErrorCobria('PHYSICAL_VERSION_UNSUPPORTED', 'Versión física no compatible', { version: documento?.d });
    return new Observacion({
      id: documento.a,
      ambito: documento.b,
      revision: documento.c,
      observadaEn: documento.e,
      especie: documento.f,
      cantidad: documento.g,
    });
  }
}
