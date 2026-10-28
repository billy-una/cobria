import { mkdtemp,writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { abrirIntegral,componer } from './composition.mjs';
import { RepositorioPouch } from './infrastructure/repositorio-pouch.mjs';

const directory=await mkdtemp(path.join(tmpdir(),'cobria-c8-recorrido-'));
const token='sesion_demo_verificacion_c8_123456';
const sesiones=new Map([[token,{actorId:'verificador-demo',permisos:['observaciones:leer','observaciones:escribir','observaciones:respaldar'],ambitos:['reserva-sur'],expiraEn:Date.now()+600000}]]);
const abrir=()=>abrirIntegral({directory:path.join(directory,'motor'),sesiones});
let app=await abrir();let destino;
const dato={id:'obs-integral',ambito:'reserva-sur',especie:'colibri',cantidad:3,revision:1,observadaEn:'2026-10-18T12:00:00Z'};
const headers={authorization:`Bearer ${token}`,'content-type':'application/json','idempotency-key':'operacion-integral'};
try{
  const r=await fetch(`${app.url}/api/observaciones`,{method:'POST',headers,body:JSON.stringify(dato)});if(r.status!==201)throw new Error('Registro HTTP fallido');
  const copia=await(await fetch(`${app.url}/api/respaldo?ambito=reserva-sur`,{headers})).json();
  const backupFile=path.join(directory,'respaldo.json');await writeFile(backupFile,JSON.stringify(copia,null,2),{flag:'wx',mode:0o600});
  await app.cerrar();app=null;app=await abrir();
  const replay=await fetch(`${app.url}/api/observaciones`,{method:'POST',headers,body:JSON.stringify(dato)});if(replay.status!==201)throw new Error('Reentrega tras reinicio fallida');
  const actual=await app.repo.exportar('reserva-sur');if(actual.sha256!==copia.sha256)throw new Error('Cambió el estado al reentregar');
  destino=new RepositorioPouch(path.join(directory,'restaurado'));await destino.importarNuevo(copia,'reserva-sur');
  const restaurada=await destino.exportar('reserva-sur');if(restaurada.sha256!==copia.sha256)throw new Error('Restauración no equivalente');
  const proyeccion=await componer({repositorio:destino}).reconstruirResumen('reserva-sur',{actorId:'operador-demo',finalidad:'verificacion-c8',permisos:['observaciones:reconstruir'],ambitos:['reserva-sur']});
  if(proyeccion.fuenteSha256!==actual.estado.resumen.fuenteSha256)throw new Error('Reconstrucción no equivalente');
  const evidencia=await(await fetch(`${app.url}/api/evidencia?ambito=reserva-sur&consulta=colibri`,{headers})).json();
  console.log(JSON.stringify({kind:'integracion-real-local-no-produccion',directory,engine:await app.repo.info(),backupFile,backupSha256:copia.sha256,observaciones:actual.estado.documentos.length,operaciones:actual.estado.operaciones.length,projection:actual.estado.resumen,evidenceCitations:evidencia.citas.length,reopenVerified:true,restoreVerified:true,rebuildVerified:true,realProcessRestartTest:'npm test ejecuta dos procesos independientes adicionales',powerLossTested:false,replicated:false,published:false},null,2));
}finally{if(app)await app.cerrar();if(destino)await destino.cerrar();}
