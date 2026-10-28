import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { abrirIntegral,componer } from '../composition.mjs';
import { RepositorioPouch } from '../infrastructure/repositorio-pouch.mjs';

const token='sesion_integral_c8_abcdefghijkl';
const principal={actorId:'brigada-demo',permisos:['observaciones:leer','observaciones:escribir','observaciones:respaldar'],ambitos:['reserva-sur'],expiraEn:Date.now()+600000};
const contexto={...principal,finalidad:'aprendizaje-c8',claveIdempotencia:'operacion-c8-01'};
const dato={id:'obs-c8-01',ambito:'reserva-sur',especie:'colibri',cantidad:3,revision:1,observadaEn:'2026-10-18T12:00:00Z'};
async function abrir(t,session=principal){
  const directory=await mkdtemp(path.join(tmpdir(),'cobria-c8-test-'));
  const app=await abrirIntegral({directory:path.join(directory,'motor'),sesiones:new Map([[token,session]])});
  t.after(()=>app.cerrar());
  const post=(body=dato,key='operacion-c8-01')=>fetch(`${app.url}/api/observaciones`,{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json','idempotency-key':key},body:JSON.stringify(body)});
  const get=(route='observaciones',query='ambito=reserva-sur')=>fetch(`${app.url}/api/${route}?${query}`,{headers:{authorization:`Bearer ${token}`}});
  return {...app,directory,post,get};
}
test('C8 motor real confirma HTTP, catálogo, proyección y procedencia',async t=>{
  const app=await abrir(t);assert.equal((await app.post()).status,201);
  assert.equal((await app.repo.info()).adaptador,'leveldb');assert.equal((await app.repo.info()).documentosMotor,1);
  assert.equal((await (await app.get()).json()).datos.length,1);
  const resumen=await (await app.get('resumen')).json();assert.equal(resumen.conteos.colibri,3);assert.equal(resumen.revisionFuente,1);
  const evidencia=await (await app.get('evidencia','ambito=reserva-sur&consulta=colibri')).json();assert.equal(evidencia.citas[0].revision,1);assert.match(evidencia.citas[0].huella,/^[a-f0-9]{64}$/);
});
test('C8 rechaza lector, ámbito ajeno y código fuera de catálogo',async t=>{
  const app=await abrir(t);assert.equal((await app.post({...dato,ambito:'reserva-norte'})).status,403);
  assert.equal((await app.post({...dato,especie:'desconocida'})).status,400);
  assert.equal((await app.get('resumen','ambito=reserva-norte')).status,403);
  assert.equal((await app.repo.info()).documentosMotor,0);
  const lector=await abrir(t,{...principal,permisos:['observaciones:leer']});assert.equal((await lector.post()).status,403);assert.equal((await lector.get('respaldo')).status,403);
});
test('C8 conserva el formato físico solo en el adaptador',async t=>{
  const app=await abrir(t);await app.post();const copia=await app.repo.exportar('reserva-sur');
  assert.equal(copia.estado.documentos[0].a,dato.id);assert.equal(copia.estado.documentos[0].d,1);assert.equal(copia.estado.documentos[0].g,3);
  const wire=await (await app.get()).text();assert.ok(wire.includes('cantidad'));assert.ok(!wire.includes('"g":'));
});
test('C8 concurrencia de la misma operación no duplica hecho ni proyección',async t=>{
  const app=await abrir(t);const respuestas=await Promise.all(Array.from({length:8},()=>app.post()));assert.ok(respuestas.every(r=>r.status===201));
  const copia=await app.repo.exportar('reserva-sur');assert.equal(copia.estado.operaciones.length,1);assert.equal(copia.estado.documentos.length,1);assert.equal(copia.estado.resumen.conteos.colibri,3);
});
test('C8 distintas operaciones concurrentes conservan ambas observaciones',async t=>{
  const app=await abrir(t);const r=await Promise.all([app.post(),app.post({...dato,id:'obs-c8-02'},'operacion-c8-02')]);assert.ok(r.every(r=>r.status===201));
  assert.equal((await app.repo.resumen('reserva-sur')).conteos.colibri,6);
});
test('C8 conflicto de clave y revisión obsoleta no modifican el estado',async t=>{
  const app=await abrir(t);await app.post();assert.equal((await app.post({...dato,cantidad:9})).status,409);
  assert.equal((await app.post({...dato,cantidad:9},'operacion-c8-02')).status,409);
  assert.equal((await app.repo.resumen('reserva-sur')).conteos.colibri,3);
});
test('C8 fallo antes del put no deja escritura parcial y permite reintentar',async t=>{
  const app=await abrir(t);app.repo.fallosInyectados=async()=>{throw new Error('fallo-prueba');};
  assert.equal((await app.post()).status,503);app.repo.fallosInyectados=null;assert.equal((await app.repo.info()).documentosMotor,0);
  assert.equal((await app.post()).status,201);
});
test('C8 pérdida de respuesta tras put se recupera con la misma clave',async t=>{
  const app=await abrir(t);app.repo.fallosInyectados=async punto=>{if(punto==='despues-put')throw new Error('respuesta-perdida');};
  assert.equal((await app.post()).status,503);app.repo.fallosInyectados=null;
  assert.equal((await app.post()).status,201);assert.equal((await app.repo.exportar('reserva-sur')).estado.operaciones.length,1);
});
test('C8 respaldo restaura documentos, operaciones y proyección sin sobrescribir',async t=>{
  const app=await abrir(t);await app.post();const copia=await (await app.get('respaldo')).json();
  const dir=await mkdtemp(path.join(tmpdir(),'cobria-c8-restaurado-'));const destino=new RepositorioPouch(path.join(dir,'motor'));t.after(()=>destino.cerrar());
  await destino.importarNuevo(copia,'reserva-sur');assert.deepEqual(await destino.exportar('reserva-sur'),copia);
  const otra=componer({repositorio:destino});assert.equal((await otra.app.registrarController.ejecutar({cuerpo:dato,contexto})).estado,201);
  assert.equal((await destino.exportar('reserva-sur')).estado.operaciones.length,1);
  await assert.rejects(()=>destino.importarNuevo(copia,'reserva-sur'),e=>e.codigo==='STALE_REVISION');
});
test('C8 rechaza copia manipulada antes de crear un agregado',async t=>{
  const app=await abrir(t);await app.post();const copia=await app.repo.exportar('reserva-sur');copia.estado.documentos[0].g=999;
  const dir=await mkdtemp(path.join(tmpdir(),'cobria-c8-corrupto-'));const destino=new RepositorioPouch(path.join(dir,'motor'));t.after(()=>destino.cerrar());
  await assert.rejects(()=>destino.importarNuevo(copia,'reserva-sur'));assert.equal((await destino.info()).documentosMotor,0);
});
test('C8 reconstruye un derivado manipulado sin cambiar canónicos ni operaciones',async t=>{
  const app=await abrir(t);await app.post();const previa=await app.repo.exportar('reserva-sur');
  const raw=await app.repo.db.get(app.repo.id('reserva-sur'));raw.estado.resumen.conteos.colibri=999;await app.repo.db.put(raw);
  await assert.rejects(()=>app.repo.resumen('reserva-sur'));
  const ops=componer({repositorio:app.repo});
  await assert.rejects(()=>ops.reconstruirResumen('reserva-sur',contexto),e=>e.codigo==='ACCESS_DENIED');
  const reparada=await ops.reconstruirResumen('reserva-sur',{...contexto,permisos:[...contexto.permisos,'observaciones:reconstruir']});
  assert.equal(reparada.conteos.colibri,3);assert.deepEqual(await app.repo.exportar('reserva-sur'),previa);
});
test('C8 reinicio de otro proceso conserva documento y clave idempotente',async()=>{
  const directory=await mkdtemp(path.join(tmpdir(),'cobria-c8-proceso-'));
  for(const modo of ['escribir','leer']){
    const child=spawnSync(process.execPath,[new URL('./worker.mjs',import.meta.url).pathname,directory,modo],{encoding:'utf8',timeout:15000});
    assert.equal(child.status,0,child.stderr);const report=JSON.parse(child.stdout);assert.equal(report.documentos,1);assert.equal(report.operaciones,1);assert.equal(report.adaptador,'leveldb');
  }
});
