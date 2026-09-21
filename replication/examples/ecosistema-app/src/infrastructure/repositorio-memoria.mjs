export class RepositorioMemoria {
  #documentos = new Map();
  #operaciones = new Map();

  clave(ambito, id) { return `${ambito}:${id}`; }

  async guardar(documento) {
    const clave = this.clave(documento.ambito, documento.id);
    const actual = this.#documentos.get(clave);
    if (actual && documento.revision <= actual.revision) throw new ErrorCobria('STALE_REVISION', 'Revisión obsoleta');
    this.#documentos.set(clave, documento);
  }

  async listar(ambito) {
    return [...this.#documentos.values()].filter((item) => item.ambito === ambito);
  }

  async buscarOperacion(ambito, clave) { return this.#operaciones.get(this.clave(ambito, clave)); }
  async registrarOperacion(ambito, clave, firma, resultado) {
    this.#operaciones.set(this.clave(ambito, clave), { firma, resultado });
  }
}

export class AlmacenProyeccionesMemoria {
  #datos = new Map();
  async publicar(ambito, candidata) { this.#datos.set(ambito, structuredClone(candidata)); }
  async leer(ambito) { return structuredClone(this.#datos.get(ambito)); }
  async retirar(ambito) { this.#datos.delete(ambito); }
}
import { ErrorCobria } from '../domain/error-cobria.mjs';
