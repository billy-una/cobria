import { Observacion } from '../../ecosistema-app/src/domain/observacion.mjs';
import { ErrorCobria } from '../../ecosistema-app/src/domain/error-cobria.mjs';

/** Caso de uso: depende de un puerto atómico, no del SDK ni del protocolo HTTP. */
export class RegistrarDurable {
  constructor({ repositorio, autorizar, catalogo }) { Object.assign(this, { repositorio, autorizar, catalogo }); }
  async ejecutar(entrada, contexto) {
    this.autorizar(contexto, 'observaciones:escribir', entrada?.ambito);
    if (!['id', 'ambito', 'especie', 'observadaEn'].every(key => typeof entrada[key] === 'string' && entrada[key].length <= 160)
      || !['cantidad', 'revision'].every(key => Number.isSafeInteger(entrada[key]))) throw new ErrorCobria('DATA_FIELDS_INVALID', 'Entrada inválida');
    const observacion = new Observacion(entrada);
    if (!this.catalogo.especies.includes(observacion.especie)) throw new ErrorCobria('CAT_CODE_UNKNOWN', 'Especie no admitida por el catálogo');
    return this.repositorio.registrarAtomico(observacion, contexto?.claveIdempotencia);
  }
}
