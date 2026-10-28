import { abrirTaller } from '../api-ux-c5/server.mjs';
import { RepositorioPouch } from './infrastructure/repositorio-pouch.mjs';
import { RegistrarDurable } from './application/registrar-durable.mjs';
import { ListarObservaciones } from '../ecosistema-app/src/application/listar-observaciones.mjs';
import { RegistrarObservacionController } from '../ecosistema-app/src/presentation/registrar-observacion-controller.mjs';
import { ListarObservacionesController } from '../ecosistema-app/src/presentation/listar-observaciones-controller.mjs';
import { crearProblemaHttp } from '../ecosistema-app/src/presentation/problema-http.mjs';
import { traducirErrorEs } from '../ecosistema-app/src/presentation/i18n/mensajes-es.mjs';
import { crearAutorizador } from '../ecosistema-app/src/application/security/autorizar-capacidad.mjs';
import { AuditoriaMemoria } from '../ecosistema-app/src/infrastructure/security/auditoria-memoria.mjs';
import { crearAsistente } from '../analitica-c7/taller.mjs';
import { ErrorCobria } from '../ecosistema-app/src/domain/error-cobria.mjs';
import catalogo from './catalogo.json' with { type: 'json' };

export function componer({repositorio}) {
  const auditoria = new AuditoriaMemoria();
  const autorizar = crearAutorizador({auditar:evento => auditoria.registrar(evento)});
  const registrar = new RegistrarDurable({repositorio,autorizar,catalogo});
  const app = {
    repositorio, auditoria,
    registrarController: new RegistrarObservacionController(registrar,traducirErrorEs),
    listarController: new ListarObservacionesController(new ListarObservaciones({repositorio,autorizar}),traducirErrorEs)
  };
  // Conserva el contrato HTTP C5 para dominio; los fallos de motor se traducen a 503.
  for (const field of ['registrarController','listarController']) {
    const original = app[field].ejecutar.bind(app[field]);
    app[field] = {ejecutar:async solicitud => {
      const r = await original(solicitud);
      if (r.cuerpo.code === 'PROVIDER_FAILURE') {r.estado=503;r.cuerpo.status=503;}
      return r;
    }};
  }
  const envolver = fn => async (params,contexto) => {
    try {return {estado:200,cuerpo:await fn(params,contexto)};}
    catch (error) {
      if (!error.codigo) throw error;
      const estado=error.codigo==='ACCESS_DENIED'?403:error.codigo==='PROVIDER_FAILURE'?503:400;
      const p=crearProblemaHttp(error,estado,traducirErrorEs,contexto.traceId);
      return {estado,cuerpo:p.body,contentType:p.contentType};
    }
  };
  const responder=crearAsistente({repositorio});
  const rutasLectura={
    '/api/resumen':{parametros:['ambito'],ejecutar:envolver(async({ambito},ctx)=>{autorizar(ctx,'observaciones:leer',ambito);return repositorio.resumen(ambito);})},
    '/api/evidencia':{parametros:['ambito','consulta'],ejecutar:envolver((params,ctx)=>{
      autorizar(ctx,'observaciones:leer',params.ambito);
      if(typeof params.consulta!=='string' || !params.consulta.trim() || params.consulta.length>200)throw new ErrorCobria('AI_QUERY_REQUIRED','Consulta inválida');
      return responder(params,ctx);
    })},
    '/api/respaldo':{parametros:['ambito'],ejecutar:envolver(async({ambito},ctx)=>{autorizar(ctx,'observaciones:respaldar',ambito);return repositorio.exportar(ambito);})}
  };
  const reconstruirResumen=async(ambito,ctx)=>{autorizar(ctx,'observaciones:reconstruir',ambito);return repositorio.reconstruirResumen(ambito);};
  return {app,rutasLectura,autorizar,reconstruirResumen};
}

export async function abrirIntegral({directory,sesiones=new Map(),puerto=0}) {
  const repositorio=new RepositorioPouch(directory);
  try {
    await repositorio.info();
    const {app,rutasLectura,autorizar}=componer({repositorio});
    const http=await abrirTaller({app,sesiones,puerto,rutasLectura,finalidad:'aprendizaje-c8',directorioPublico:new URL('./public/',import.meta.url)});
    return {...http,repo:repositorio,autorizar,cerrar:async()=>{await http.cerrar();await repositorio.cerrar();}};
  } catch(error) {await repositorio.cerrar();throw error;}
}
