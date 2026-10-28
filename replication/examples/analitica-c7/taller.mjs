import { calcularHuellaSha256 as huella } from '../ecosistema-app/src/infrastructure/crypto/huella-sha256.mjs';
import { crearAutorizador } from '../ecosistema-app/src/application/security/autorizar-capacidad.mjs';
import { RecuperarEvidencia } from '../ecosistema-app/src/application/ai/recuperar-evidencia.mjs';

const exigir=(condition,code)=>{if(!condition)throw new Error(code);};
const ordenar=(a,b)=>a < b ? -1 : a > b ? 1 : 0;
const autorizar=crearAutorizador({auditar:()=>{}}); // Taller sin registro operacional.
const texto=value=>typeof value==='string' && value.trim().length>0 && value.length<=200;
function congelar(value){if(value && typeof value==='object'){for(const child of Object.values(value))congelar(child);Object.freeze(value);}return value;}
function instante(value){
  exigir(typeof value==='string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value),'TIEMPO_INVALIDO');
  const ms=Date.parse(value);exigir(Number.isFinite(ms) && new Date(ms).toISOString()===value,'TIEMPO_INVALIDO');return ms;
}

export function crearConjunto({documentos,ambito,corteEntrenamiento,corteEvaluacion,versionCaracteristica='cantidad-v1'},contexto){
  autorizar(contexto,'observaciones:leer',ambito);
  exigir(contexto.finalidad==='aprendizaje-c7','FINALIDAD_NO_ADMITIDA');
  exigir(Array.isArray(documentos) && documentos.length<=10000,'DOCUMENTOS_INVALIDOS');
  const corte=instante(corteEntrenamiento),fin=instante(corteEvaluacion);
  exigir(corte<fin,'CORTES_INVALIDOS');exigir(versionCaracteristica==='cantidad-v1','CARACTERISTICA_DESCONOCIDA');
  const ids=new Set(),entrenamiento=[],evaluacion=[],fuentes=[];
  const exclusiones={sinHabilitacion:0,tardioEntrenamiento:0,fueraCorteEvaluacion:0};
  for(const documento of documentos){
    exigir(documento && documento.ambito===ambito,'AMBITO_INCOMPATIBLE');
    exigir(['id','entidadId','especie'].every(key=>texto(documento[key])) && Number.isSafeInteger(documento.revision) && documento.revision>0 && Number.isSafeInteger(documento.cantidad) && documento.cantidad>0,'DOCUMENTO_INVALIDO');
    exigir(typeof documento.habilitadoAnalitica==='boolean','HABILITACION_REQUERIDA');
    exigir(!ids.has(documento.id),'IDENTIDAD_DUPLICADA');ids.add(documento.id);
    const observado=instante(documento.observadaEn),conocido=instante(documento.conocidaEn);
    exigir(observado<=conocido,'CRONOLOGIA_IMPOSIBLE');
    if(!documento.habilitadoAnalitica){exclusiones.sinHabilitacion++;continue;}
    if(observado>fin || conocido>fin){exclusiones.fueraCorteEvaluacion++;continue;}
    if(observado<=corte && conocido>corte){exclusiones.tardioEntrenamiento++;continue;}
    const fuente={id:documento.id,entidadId:documento.entidadId,ambito,revision:documento.revision,observadaEn:documento.observadaEn,conocidaEn:documento.conocidaEn,especie:documento.especie,cantidad:documento.cantidad,habilitadoAnalitica:true};
    fuentes.push({id:fuente.id,revision:fuente.revision,huella:huella(fuente)});
    const fila={id:fuente.id,entidadId:fuente.entidadId,valor:fuente.cantidad};
    (observado<=corte?entrenamiento:evaluacion).push(fila);
  }
  const entidades=new Set(entrenamiento.map(row=>row.entidadId));
  exigir(!evaluacion.some(row=>entidades.has(row.entidadId)),'FUGA_ENTRE_ENTIDADES');
  for(const rows of [entrenamiento,evaluacion,fuentes])rows.sort((a,b)=>ordenar(a.id,b.id));
  const base={contrato:'taller-c7-v1',ambito,corteEntrenamiento,corteEvaluacion,versionCaracteristica,entrenamiento,evaluacion,fuentes,exclusiones};
  return congelar({...base,huella:huella(base),autoridadEscritura:false});
}

// Reutiliza la recuperación léxica, pero verifica el puerto antes de puntuar.
export function crearAsistente({repositorio,umbral=.5}){
  exigir(Number.isFinite(umbral) && umbral>0 && umbral<=1,'UMBRAL_INVALIDO');
  const comprobar=async ambito=>{
    const documentos=await repositorio.listar(ambito);
    exigir(Array.isArray(documentos) && documentos.length<=10000,'CORPUS_INVALIDO');
    const ids=new Set();
    return documentos.map(d=>{
      exigir(d && d.ambito===ambito,'AMBITO_INCOMPATIBLE');
      exigir(texto(d.id) && texto(d.especie) && Number.isSafeInteger(d.revision) && d.revision>0 && Number.isSafeInteger(d.cantidad) && d.cantidad>0,'DOCUMENTO_INVALIDO');
      exigir(!ids.has(d.id),'IDENTIDAD_DUPLICADA');ids.add(d.id);instante(d.observadaEn);
      return {id:d.id,ambito,revision:d.revision,especie:d.especie,cantidad:d.cantidad,observadaEn:d.observadaEn};
    });
  };
  return async({consulta,ambito},contexto)=>{
    autorizar(contexto,'observaciones:leer',ambito);exigir(texto(consulta),'CONSULTA_INVALIDA');
    const autorizados=await comprobar(ambito);
    const porId=new Map(autorizados.map(d=>[d.id,d]));
    // Nunca se solicita el corpus global ni se confía en texto para crear llamadas.
    const recuperar=new RecuperarEvidencia({repositorio:{listar:async()=>autorizados},autorizar,umbral});
    const resultado=await recuperar.ejecutar({consulta,ambito},contexto);
    const citas=resultado.citas.map(cita=>{
      const d=porId.get(cita.id);
      return {...cita,huella:huella(d),versionRecuperador:'lexico-c7-v1'};
    });
    return congelar({...resultado,citas,respuesta:citas.length?'Consulte las observaciones citadas.':'No hay evidencia suficiente en el ámbito autorizado.',tipo:'recuperacion-lexica-sin-generacion'});
  };
}

export function crearHerramientaLectura({repositorio}){
  return async(solicitud,contexto)=>{
    exigir(solicitud && Object.keys(solicitud).sort().join(',')==='ambito,herramienta','ENTRADA_HERRAMIENTA_INVALIDA');
    exigir(solicitud.herramienta==='resumir-observaciones','HERRAMIENTA_NO_PERMITIDA');
    autorizar(contexto,'observaciones:leer',solicitud.ambito);
    const documentos=await repositorio.listar(solicitud.ambito);
    exigir(Array.isArray(documentos) && documentos.length<=10000 && documentos.every(d=>d && d.ambito===solicitud.ambito && Number.isSafeInteger(d.cantidad) && d.cantidad>0),'CORPUS_INVALIDO');
    const cantidad=documentos.reduce((sum,d)=>sum+d.cantidad,0);exigir(Number.isSafeInteger(cantidad),'TOTAL_INVALIDO');
    return congelar({ambito:solicitud.ambito,documentos:documentos.length,cantidad,autoridadEscritura:false});
  };
}
