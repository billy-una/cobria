import { ObservacionDater } from './data/observacion-dater.mjs';
import { ErrorCobria } from '../domain/error-cobria.mjs';

// Variante pedagógica del mismo puerto. El Map contiene documentos físicos v1;
// no es otro motor ni ofrece transacciones o persistencia después del proceso.
export class RepositorioDocumentalMemoria {
  constructor({ documentos = new Map(), operaciones = new Map() } = {}) {
    this.documentos = documentos;
    this.operaciones = operaciones;
    this.dater = new ObservacionDater();
  }

  clave(ambito, id) { return JSON.stringify([ambito, id]); }

  async guardar(observacion) {
    const clave = this.clave(observacion.ambito, observacion.id);
    const anterior = this.documentos.get(clave);
    if (anterior && observacion.revision <= this.dater.desdeFisico(anterior).revision) {
      throw new ErrorCobria('STALE_REVISION', 'Revisión obsoleta');
    }
    const documento = this.dater.haciaFisico(observacion);
    this.dater.desdeFisico(documento);
    this.documentos.set(clave, structuredClone(documento));
  }

  async listar(ambito) {
    return [...this.documentos.values()].filter(documento => documento.b === ambito)
      .map(documento => this.dater.desdeFisico(documento));
  }

  async buscarOperacion(ambito, clave) { return this.operaciones.get(this.clave(ambito, clave)); }
  async registrarOperacion(ambito, clave, firma, resultado) {
    this.operaciones.set(this.clave(ambito, clave), { firma, resultado });
  }
}
