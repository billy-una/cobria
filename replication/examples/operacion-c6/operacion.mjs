import { createHash } from 'node:crypto';
import { Observacion } from '../ecosistema-app/src/domain/observacion.mjs';
import { crearAutorizador } from '../ecosistema-app/src/application/security/autorizar-capacidad.mjs';
import { RepositorioMemoria } from '../ecosistema-app/src/infrastructure/repositorio-memoria.mjs';
import { CacheLecturas } from '../operacion-documental/src/data/cache-lecturas.mjs';

export const huella = bytes => createHash('sha256').update(bytes).digest('hex');
const exigir = (condicion, codigo) => {if (!condicion) throw new Error(codigo);};
const autorizar = crearAutorizador({auditar:()=>{}}); // Sin registro operacional: solo ensayo.
const campos = ['id','ambito','especie','cantidad','revision','observadaEn'];
function validarDocumentos(documentos, ambito) {
  exigir(Array.isArray(documentos) && documentos.length <= 10000,'DOCUMENTOS_INVALIDOS');
  const ids = new Set();
  return documentos.map(dato => {
    exigir(dato && Object.keys(dato).length === campos.length && campos.every(campo=>Object.hasOwn(dato,campo)),'CAMPOS_INVALIDOS');
    exigir(['id','ambito','especie','observadaEn'].every(campo=>typeof dato[campo]==='string' && dato[campo].length<=160),'TIPOS_INVALIDOS');
    exigir(['cantidad','revision'].every(campo=>Number.isSafeInteger(dato[campo])),'TIPOS_INVALIDOS');
    exigir(dato.ambito === ambito,'AMBITO_INCOMPATIBLE');
    exigir(!ids.has(dato.id),'IDENTIDAD_DUPLICADA'); ids.add(dato.id);
    return new Observacion(dato);
  }).sort((a,b)=>a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

// Exporta documentos, no sesiones, auditoría, índices ni registro de idempotencia.
export function crearRespaldo(documentos, ambito, contexto) {
  autorizar(contexto,'observaciones:leer',ambito);
  const datos = validarDocumentos(documentos,ambito);
  const bytes = Buffer.from(JSON.stringify({formato:1,ambito,documentos:datos}));
  exigir(bytes.length<=1024*1024,'RESPALDO_DEMASIADO_GRANDE');
  return {bytes,sha256:huella(bytes),documentos:datos.length};
}

// Preflight completo y restauración en un repositorio NUEVO; nunca sobrescribe uno activo.
export async function restaurarRespaldo(bytes, sha256, ambito, contexto) {
  autorizar(contexto,'observaciones:escribir',ambito);
  autorizar(contexto,'observaciones:leer',ambito);
  exigir(Buffer.isBuffer(bytes) && bytes.length<=1024*1024,'RESPALDO_INVALIDO');
  exigir(/^[a-f0-9]{64}$/.test(sha256 ?? '') && huella(bytes)===sha256,'HUELLA_INCOMPATIBLE');
  let copia; try {copia=JSON.parse(bytes.toString('utf8'));} catch {throw new Error('JSON_INVALIDO');}
  exigir(copia && Object.keys(copia).sort().join(',')==='ambito,documentos,formato' && copia.formato===1,'FORMATO_INVALIDO');
  exigir(copia.ambito===ambito,'AMBITO_INCOMPATIBLE');
  const datos = validarDocumentos(copia.documentos,ambito);
  const repositorio = new RepositorioMemoria();
  for(const dato of datos) await repositorio.guardar(dato);
  const otra = crearRespaldo(await repositorio.listar(ambito),ambito,contexto);
  exigir(otra.sha256===sha256,'EQUIVALENCIA_FALLIDA');
  return repositorio;
}

// Fixture deliberadamente defectuoso, aislado de los caminos corregidos y de producción.
export async function reproducirDefectoCache() {
  const mala = new Map();
  const leer = (ambito,id) => {if(!mala.has(id)) mala.set(id,{id,ambito});return mala.get(id);};
  leer('reserva-sur','obs-1');
  return {esperado:'reserva-norte',obtenido:leer('reserva-norte','obs-1').ambito,causa:'clave-sin-ambito'};
}
export function crearLecturaSegura({cargar,reloj=Date.now}) {
  const cache = new CacheLecturas({maxEntradas:20,ttlMs:1000,reloj});
  return {
    leer:async(ambito,contexto)=>{
      autorizar(contexto,'observaciones:leer',ambito); // También en aciertos de caché.
      return cache.leer({ambito,politica:'c6-v1',recurso:'observaciones'},()=>cargar(ambito));
    },
    invalidar:(ambito,contexto)=>{autorizar(contexto,'observaciones:escribir',ambito);cache.invalidar({ambito});}
  };
}

// Análogo local de un handler de Function: entrada y contexto del servidor separados.
export function crearHandlerResumen({repositorio}) {
  return async ({ambito},contexto) => {
    autorizar(contexto,'observaciones:leer',ambito);
    const datos = await repositorio.listar(ambito);
    exigir(datos.every(item=>item.ambito===ambito),'AMBITO_INCOMPATIBLE');
    return {ambito,observaciones:datos.length,cantidad:datos.reduce((sum,item)=>sum+item.cantidad,0),autoridadEscritura:false};
  };
}

// Staging LOCAL: comprueba contenido y pruebas mecánicas; no firma ni aprueba un release.
export class EntregaLocal {
  #activa;
  #anterior;
  #pendiente=false;
  constructor(bytes,sha) {this.#activa=this.#candidata(bytes,sha);}
  #candidata(bytes,sha) {
    exigir(Buffer.isBuffer(bytes) && /^[a-f0-9]{40}$/.test(sha ?? ''),'CANDIDATA_INVALIDA');
    return {bytes:Buffer.from(bytes),sha,sha256:huella(bytes)};
  }
  estado() {const {sha,sha256}=this.#activa;return {sha,sha256,ambiente:'ensayo-local',publicada:false};}
  async promover(bytes,sha,smoke) {
    exigir(!this.#pendiente,'ENTREGA_EN_CURSO');
    const candidata=this.#candidata(bytes,sha);
    exigir(typeof smoke==='function','PRUEBA_REQUERIDA');
    // El callback recibe una copia. Alterarla no cambia el artefacto a promover.
    this.#pendiente=true;
    try {
      const verificada=await smoke(Buffer.from(candidata.bytes));
      exigir(verificada===true,'SMOKE_RECHAZADO');
      this.#anterior=this.#activa;this.#activa=candidata;
      return this.estado();
    } finally {this.#pendiente=false;}
  }
  revertir() {
    exigir(!this.#pendiente,'ENTREGA_EN_CURSO');
    exigir(this.#anterior,'SIN_VERSION_ANTERIOR');
    exigir(huella(this.#anterior.bytes)===this.#anterior.sha256,'ARTEFACTO_CORRUPTO');
    const previa=this.#activa;this.#activa=this.#anterior;this.#anterior=previa;
    return this.estado();
  }
}
