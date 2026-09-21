import { ErrorCobria } from '../domain/error-cobria.mjs';

/** Adaptador CouchDB basado en fetch; persiste documentos e idempotencia en una base por aplicación. */
export class RepositorioCouchDB {
  constructor(baseUrl, database, fetchImpl = fetch, headers = {}) {
    this.url = `${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(database)}`;
    this.fetch = fetchImpl;
    this.headers = headers;
  }

  id(tipo, ambito, clave) { return `${tipo}:${encodeURIComponent(ambito)}:${encodeURIComponent(clave)}`; }

  async leer(id) {
    const respuesta = await this.fetch(`${this.url}/${encodeURIComponent(id)}`, { headers: this.headers });
    if (respuesta.status === 404) return null;
    if (!respuesta.ok) throw new ErrorCobria('PROVIDER_FAILURE', 'CouchDB no está disponible', { providerStatus: respuesta.status });
    return respuesta.json();
  }

  async guardar(documento) {
    const id = this.id('doc', documento.ambito, documento.id);
    const actual = await this.leer(id);
    if (actual && documento.revision <= actual.revision) throw new ErrorCobria('STALE_REVISION', 'Revisión obsoleta');
    const respuesta = await this.fetch(`${this.url}/${encodeURIComponent(id)}`, {
      method: 'PUT', headers: { ...this.headers, 'content-type': 'application/json' },
      body: JSON.stringify({ ...documento, _id: id, ...(actual?._rev ? { _rev: actual._rev } : {}) }),
    });
    if (!respuesta.ok) throw new ErrorCobria('PROVIDER_FAILURE', 'CouchDB no está disponible', { providerStatus: respuesta.status });
  }

  async listar(ambito) {
    const respuesta = await this.fetch(`${this.url}/_all_docs?include_docs=true`, { headers: this.headers });
    if (!respuesta.ok) throw new ErrorCobria('PROVIDER_FAILURE', 'CouchDB no está disponible', { providerStatus: respuesta.status });
    const datos = await respuesta.json();
    return datos.rows.map((fila) => fila.doc).filter((doc) => doc?.ambito === ambito && doc?._id.startsWith('doc:'));
  }

  async buscarOperacion(ambito, clave) { return this.leer(this.id('op', ambito, clave)); }

  async registrarOperacion(ambito, clave, firma, resultado) {
    const id = this.id('op', ambito, clave);
    if (await this.leer(id)) return;
    const respuesta = await this.fetch(`${this.url}/${encodeURIComponent(id)}`, {
      method: 'PUT', headers: { ...this.headers, 'content-type': 'application/json' },
      body: JSON.stringify({ _id: id, ambito, clave, firma, resultado }),
    });
    if (!respuesta.ok && respuesta.status !== 409) throw new ErrorCobria('PROVIDER_FAILURE', 'CouchDB no está disponible', { providerStatus: respuesta.status });
  }
}
