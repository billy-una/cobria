import {pathToFileURL} from 'node:url';
import {crearAplicacion} from './composition.mjs';
import {construirConjuntoAnalitico} from './application/analytics/construir-conjunto.mjs';
import {calcularHuellaSha256} from './infrastructure/crypto/huella-sha256.mjs';

/** Recorrido determinista, con consentimiento sintético explícito y sin proveedor externo. */
export async function ejecutarBuild(){
  const app=crearAplicacion();
  const contexto={actorId:'brigada-demo',finalidad:'aprendizaje',ambitos:['reserva-sur'],permisos:['observaciones:leer','observaciones:escribir'],claveIdempotencia:'salida-001'};
  const entrada={id:'obs-build',ambito:'reserva-sur',especie:'colibri',cantidad:3,revision:1,observadaEn:'2026-10-17T12:00:00Z'};
  await app.registrar.ejecutar(entrada,contexto);
  await app.registrar.ejecutar(entrada,contexto);
  const antes=await app.reconstruir.ejecutar(entrada.ambito,contexto);
  await app.proyecciones.retirar(entrada.ambito);
  const despues=await app.reconstruir.ejecutar(entrada.ambito,contexto);
  const documentos=await app.repositorio.listar(entrada.ambito);
  // La autorización sintética se añade al conjunto de demostración, no se infiere
  // de los canónicos v1 ni se escribe silenciosamente en ellos.
  const fuentes=documentos.map(doc=>({...doc,entidadId:doc.id,conocidaEn:'2026-10-17T13:00:00Z',consentimientoAnalitico:true}));
  const conjunto=construirConjuntoAnalitico({documentos:fuentes,ambito:entrada.ambito,corteTemporal:'2026-10-18T00:00:00Z',transformacion:{nombre:'conteo-demo',version:'1.0.0'},calcularHuella:calcularHuellaSha256});
  const evidencia=await app.recuperarEvidencia.ejecutar({consulta:'colibri',ambito:entrada.ambito},contexto);
  const abstencion=await app.recuperarEvidencia.ejecutar({consulta:'orquidea',ambito:entrada.ambito},contexto);
  return {documentos:documentos.length,reconstruccionEquivalente:JSON.stringify(antes)===JSON.stringify(despues),conjunto,evidencia,abstencion,limites:['Memoria local; no staging ni persistencia remota.','Identidad y consentimiento sintéticos.','Recuperación léxica; no invoca un modelo generativo.','Retira solo la proyección; no ejecuta supresión de datos personales.']};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(await ejecutarBuild(),null,2));
