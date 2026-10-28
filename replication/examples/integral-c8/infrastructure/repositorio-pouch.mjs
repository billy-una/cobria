import PouchDB from 'pouchdb';
import { createHash } from 'node:crypto';
import { ObservacionDater } from '../../ecosistema-app/src/infrastructure/data/observacion-dater.mjs';
import { ErrorCobria } from '../../ecosistema-app/src/domain/error-cobria.mjs';
import catalogo from '../catalogo.json' with { type: 'json' };

const dater = new ObservacionDater();
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const exigir = (ok, codigo = 'DATA_FIELDS_INVALID') => { if (!ok) throw new ErrorCobria(codigo, 'Contrato documental inválido'); };
const ordenar = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const ambitoValido = ambito => exigir(typeof ambito === 'string' && /^[a-z0-9][a-z0-9-]{2,63}$/.test(ambito), 'SCOPE_INVALID');

function proyectar(documentos, revision) {
  const conteos = new Map();
  for (const fisico of documentos) {
    const d = dater.desdeFisico(fisico);
    exigir(catalogo.especies.includes(d.especie));
    const cantidad = (conteos.get(d.especie) ?? 0) + d.cantidad;
    exigir(Number.isSafeInteger(cantidad));
    conteos.set(d.especie, cantidad);
  }
  return { version: 'conteos-c8-v1', revisionFuente: revision,
    fuenteSha256: hash(documentos), conteos: Object.fromEntries([...conteos].sort(([a], [b]) => ordenar(a, b))), autoridadEscritura: false };
}

function validarEstado(estado, ambito) {
  exigir(estado && Object.keys(estado).sort().join(',') === 'ambito,catalogoVersion,documentos,formato,operaciones,resumen,revision');
  exigir(estado.formato === 1 && estado.catalogoVersion === 'aves-c8-v1' && estado.ambito === ambito);
  exigir(Number.isSafeInteger(estado.revision) && estado.revision >= 0);
  exigir(Array.isArray(estado.documentos) && estado.documentos.length <= 1000 && Array.isArray(estado.operaciones) && estado.operaciones.length <= 1000);
  const ids = new Map();
  for (const fisico of estado.documentos) {
    const d = dater.desdeFisico(fisico);
    exigir(d.ambito === ambito && !ids.has(d.id) && Number.isSafeInteger(d.cantidad) && Number.isSafeInteger(d.revision));
    exigir(JSON.stringify(dater.haciaFisico(d)) === JSON.stringify(fisico)); ids.set(d.id, d);
  }
  const claves = new Set();
  for (const op of estado.operaciones) {
    exigir(op && Object.keys(op).sort().join(',') === 'clave,firma,resultado');
    exigir(typeof op.clave === 'string' && /^[A-Za-z0-9_-]{8,100}$/.test(op.clave) && !claves.has(op.clave)); claves.add(op.clave);
    const d = dater.desdeFisico(op.resultado);
    exigir(catalogo.especies.includes(d.especie) && Number.isSafeInteger(d.cantidad) && Number.isSafeInteger(d.revision));
    exigir(JSON.stringify(dater.haciaFisico(d)) === JSON.stringify(op.resultado));
    exigir(d.ambito === ambito && ids.get(d.id)?.revision >= d.revision && op.firma === hash(d));
  }
  exigir(estado.revision === estado.operaciones.length);
  exigir(JSON.stringify(estado.resumen) === JSON.stringify(proyectar(estado.documentos, estado.revision)));
  exigir(Buffer.byteLength(JSON.stringify(estado)) <= 2 * 1024 * 1024);
  return estado;
}

/** Motor real, un documento agregado por ámbito; sin transacciones entre agregados. */
export class RepositorioPouch {
  constructor(directory) {
    this.db = new PouchDB(directory, { adapter: 'leveldb' });
    this.fallosInyectados = null; // Solo pruebas explícitas de fallo, nunca activado por HTTP.
  }

  async cerrar() { await this.db.close(); }
  async info() { return { motor: `PouchDB ${PouchDB.version}`, adaptador: this.db.adapter, documentosMotor: (await this.db.info()).doc_count }; }
  id(ambito) { ambitoValido(ambito); return `ambito:${ambito}`; }

  async leerEstado(ambito) {
    let doc;
    try { doc = await this.db.get(this.id(ambito)); }
    catch (error) {
      if (error.status === 404) return { _id: this.id(ambito), estado: { formato: 1, catalogoVersion: 'aves-c8-v1', ambito, revision: 0, documentos: [], operaciones: [], resumen: proyectar([], 0) } };
      throw new ErrorCobria('PROVIDER_FAILURE', 'El motor local no está disponible');
    }
    validarEstado(doc.estado, ambito);
    return doc;
  }

  async listar(ambito) { return (await this.leerEstado(ambito)).estado.documentos.map(d => dater.desdeFisico(d)); }
  async resumen(ambito) { return structuredClone((await this.leerEstado(ambito)).estado.resumen); }

  async registrarAtomico(observacion, clave) {
    exigir(typeof clave === 'string' && /^[A-Za-z0-9_-]{8,100}$/.test(clave), 'IDEMPOTENCY_KEY_REQUIRED');
    const fisico = dater.haciaFisico(observacion), firma = hash(observacion);
    for (let intento = 0; intento < 8; intento++) {
      const doc = await this.leerEstado(observacion.ambito);
      const repetida = doc.estado.operaciones.find(op => op.clave === clave);
      if (repetida) {
        exigir(repetida.firma === firma, 'IDEMPOTENCY_CONFLICT');
        return dater.desdeFisico(repetida.resultado);
      }
      const existente = doc.estado.documentos.find(item => item.a === observacion.id);
      exigir(!existente || observacion.revision > existente.c, 'STALE_REVISION');
      doc.estado.documentos = [...doc.estado.documentos.filter(item => item.a !== observacion.id), fisico].sort((a, b) => ordenar(a.a, b.a));
      doc.estado.operaciones.push({ clave, firma, resultado: fisico }); doc.estado.revision++;
      doc.estado.resumen = proyectar(doc.estado.documentos, doc.estado.revision);
      validarEstado(doc.estado, observacion.ambito);
      try {
        if (this.fallosInyectados) await this.fallosInyectados('antes-put');
        await this.db.put(doc); // Hecho, operación y proyección se confirman en UNA revisión.
        if (this.fallosInyectados) await this.fallosInyectados('despues-put');
        return observacion;
      } catch (error) {
        if (error.status === 409) continue;
        if (error instanceof ErrorCobria) throw error;
        throw new ErrorCobria('PROVIDER_FAILURE', 'No se confirmó la respuesta del motor');
      }
    }
    throw new ErrorCobria('PROVIDER_FAILURE', 'Conflictos locales persistentes');
  }

  async exportar(ambito) {
    const estado = (await this.leerEstado(ambito)).estado;
    return { estado: structuredClone(estado), sha256: hash(estado) };
  }

  async reconstruirResumen(ambito) {
    for (let intento=0; intento<8; intento++) {
      let doc;
      try { doc=await this.db.get(this.id(ambito)); }
      catch { throw new ErrorCobria('PROVIDER_FAILURE','No se pudo cargar la fuente para reconstruir'); }
      // Valida canónicos y operaciones con una candidata calculada SIN leer el derivado activo.
      const candidata=proyectar(doc.estado.documentos,doc.estado.revision);
      validarEstado({...doc.estado,resumen:candidata},ambito);
      doc.estado.resumen=candidata;
      try { await this.db.put(doc); return structuredClone(candidata); }
      catch(error) { if(error.status!==409)throw new ErrorCobria('PROVIDER_FAILURE','No se pudo publicar la candidata'); }
    }
    throw new ErrorCobria('PROVIDER_FAILURE','Reconstrucción concurrente no completada');
  }

  async importarNuevo(copia, ambito) {
    ambitoValido(ambito);
    exigir(copia && Object.keys(copia).sort().join(',') === 'estado,sha256' && copia.sha256 === hash(copia.estado));
    validarEstado(copia.estado, ambito);
    try {
      // Sin _rev: nunca reemplaza un agregado existente, ni siquiera uno vacío.
      await this.db.put({ _id: this.id(ambito), estado: structuredClone(copia.estado) });
    } catch (error) {
      if (error.status === 409) throw new ErrorCobria('STALE_REVISION', 'El destino ya existe');
      throw new ErrorCobria('PROVIDER_FAILURE', 'No se pudo restaurar la copia');
    }
  }
}
