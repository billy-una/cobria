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
    const claves = ['a','b','c','d','e','f','g'];
    const faltanCampos = claves.some(clave => !Object.hasOwn(documento, clave) || documento[clave] === undefined || documento[clave] === null);
    const tiposInvalidos = ['a','b','e','f'].some(clave => typeof documento[clave] !== 'string');
    if (Object.keys(documento).length !== claves.length || faltanCampos || tiposInvalidos) {
      throw new ErrorCobria('DATA_FIELDS_INVALID', 'El formato 1 requiere sus siete campos y no admite campos desconocidos');
    }
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
