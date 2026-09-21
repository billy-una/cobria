import { ErrorCobria } from '../domain/error-cobria.mjs';

export class ListarObservaciones {
  constructor({ repositorio, autorizar }) {
    this.repositorio = repositorio;
    this.autorizar = autorizar;
  }

  async ejecutar({ ambito, limite = 20, cursor }, contexto) {
    this.autorizar(contexto, 'observaciones:leer', ambito);
    if (!Number.isInteger(limite) || limite < 1 || limite > 100) {
      throw new ErrorCobria('PAGE_SIZE_INVALID', 'Tamaño de página inválido');
    }
    const inicio = cursor === undefined ? 0 : this.#decodificar(cursor);
    const documentos = (await this.repositorio.listar(ambito)).sort((a, b) => a.id.localeCompare(b.id));
    const items = documentos.slice(inicio, inicio + limite);
    const siguiente = inicio + items.length < documentos.length ? `v1.${(inicio + items.length).toString(36)}` : null;
    return { items, siguienteCursor: siguiente };
  }

  #decodificar(cursor) {
    const match = /^v1\.([0-9a-z]+)$/.exec(cursor ?? '');
    if (!match) throw new ErrorCobria('CURSOR_INVALID', 'Cursor inválido');
    const value = Number.parseInt(match[1], 36);
    if (!Number.isSafeInteger(value) || value < 0) throw new ErrorCobria('CURSOR_INVALID', 'Cursor inválido');
    return value;
  }
}
