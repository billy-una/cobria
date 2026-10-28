import path from 'node:path';
import { RepositorioPouch } from '../infrastructure/repositorio-pouch.mjs';
import { componer } from '../composition.mjs';
const repo=new RepositorioPouch(path.join(process.argv[2],'motor'));
try{
  const {app}=componer({repositorio:repo});
  const solicitud={cuerpo:{id:'obs-proceso',ambito:'reserva-sur',especie:'colibri',cantidad:3,revision:1,observadaEn:'2026-10-18T12:00:00Z'},contexto:{actorId:'proceso-demo',finalidad:'prueba-c8',permisos:['observaciones:leer','observaciones:escribir'],ambitos:['reserva-sur'],claveIdempotencia:'operacion-proceso'}};
  if(process.argv[3]==='leer' && (await repo.listar('reserva-sur')).length!==1)throw new Error('No persistió');
  const respuesta=await app.registrarController.ejecutar(solicitud);if(respuesta.estado!==201)throw new Error('Registro fallido');
  const copia=await repo.exportar('reserva-sur');console.log(JSON.stringify({documentos:copia.estado.documentos.length,operaciones:copia.estado.operaciones.length,adaptador:(await repo.info()).adaptador}));
}finally{await repo.cerrar();}
