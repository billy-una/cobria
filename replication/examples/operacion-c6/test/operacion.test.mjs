import test from 'node:test';
import assert from 'node:assert/strict';
import { crearRespaldo, restaurarRespaldo, huella, reproducirDefectoCache, crearLecturaSegura, crearHandlerResumen, EntregaLocal } from '../operacion.mjs';
import { percentil, medir } from '../medir.mjs';

const contexto={actorId:'operador-demo',finalidad:'pruebas-c6',permisos:['observaciones:leer','observaciones:escribir'],ambitos:['reserva-sur','reserva-norte']};
const dato={id:'obs-1',ambito:'reserva-sur',especie:'colibri',cantidad:3,revision:1,observadaEn:'2026-10-18T12:00:00.000Z'};
const respaldo=()=>crearRespaldo([dato],'reserva-sur',contexto);
const sha='1'.repeat(40);

test('C6 reproduce el defecto deliberado y separa la caché corregida por ámbito',async()=>{
  const defecto=await reproducirDefectoCache();assert.notEqual(defecto.esperado,defecto.obtenido);
  let cargas=0;const lectura=crearLecturaSegura({cargar:ambito=>{cargas++;return [{ambito}];}});
  assert.equal((await lectura.leer('reserva-sur',contexto))[0].ambito,'reserva-sur');
  assert.equal((await lectura.leer('reserva-norte',contexto))[0].ambito,'reserva-norte');
  await lectura.leer('reserva-sur',contexto);assert.equal(cargas,2);
});
test('C6 reautoriza aciertos y rechaza permisos revocados sin cargar',async()=>{
  let cargas=0;const lectura=crearLecturaSegura({cargar:()=>{cargas++;return [];} });
  await lectura.leer('reserva-sur',contexto);
  await assert.rejects(()=>lectura.leer('reserva-sur',{...contexto,permisos:[]}),e=>e.codigo==='ACCESS_DENIED');assert.equal(cargas,1);
  assert.throws(()=>lectura.invalidar('reserva-sur',{...contexto,permisos:[]}),e=>e.codigo==='ACCESS_DENIED');
});
test('C6 invalida tras cambiar la fuente y vence por TTL con reloj controlado',async()=>{
  let reloj=0,cantidad=1;const lectura=crearLecturaSegura({reloj:()=>reloj,cargar:()=>[{cantidad}]});
  await lectura.leer('reserva-sur',contexto);cantidad=2;
  lectura.invalidar('reserva-sur',contexto);assert.equal((await lectura.leer('reserva-sur',contexto))[0].cantidad,2);
  cantidad=3;reloj=1001;assert.equal((await lectura.leer('reserva-sur',contexto))[0].cantidad,3);
});
test('C6 respalda y restaura con equivalencia de contenido en un repositorio nuevo',async()=>{
  const copia=respaldo();const repo=await restaurarRespaldo(copia.bytes,copia.sha256,'reserva-sur',contexto);
  assert.deepEqual({...((await repo.listar('reserva-sur'))[0])},dato);
  assert.equal(crearRespaldo(await repo.listar('reserva-sur'),'reserva-sur',contexto).sha256,copia.sha256);
});
test('C6 rechaza bytes corruptos aunque parezcan JSON válido',async()=>{
  const copia=respaldo();await assert.rejects(()=>restaurarRespaldo(Buffer.from('{}'),copia.sha256,'reserva-sur',contexto),/HUELLA_INCOMPATIBLE/);
});
test('C6 rechaza formato, campos y duplicados antes de restaurar',async()=>{
  for(const obj of [{formato:2,ambito:'reserva-sur',documentos:[dato]}, {formato:1,ambito:'reserva-sur',documentos:[dato,dato]}, {formato:1,ambito:'reserva-sur',documentos:[{...dato,token:'no'}]}]){
    const bytes=Buffer.from(JSON.stringify(obj));await assert.rejects(()=>restaurarRespaldo(bytes,huella(bytes),'reserva-sur',contexto));
  }
});
test('C6 exige ámbito y permisos para respaldo y restauración',async()=>{
  assert.throws(()=>crearRespaldo([dato],'reserva-sur',{...contexto,permisos:[]}),e=>e.codigo==='ACCESS_DENIED');
  const copia=respaldo();await assert.rejects(()=>restaurarRespaldo(copia.bytes,copia.sha256,'reserva-norte',contexto),/AMBITO_INCOMPATIBLE/);
  await assert.rejects(()=>restaurarRespaldo(copia.bytes,copia.sha256,'reserva-sur',{...contexto,permisos:['observaciones:escribir']}),e=>e.codigo==='ACCESS_DENIED');
});
test('C6 no exporta contexto, credenciales ni documentos de otro ámbito',()=>{
  const copia=respaldo();assert.ok(!copia.bytes.toString().includes('operador-demo'));
  assert.throws(()=>crearRespaldo([{...dato,ambito:'reserva-norte'}],'reserva-sur',contexto),/AMBITO_INCOMPATIBLE/);
});
test('C6 handler local conserva ámbito y no accede sin autorización',async()=>{
  let accesos=0;const handler=crearHandlerResumen({repositorio:{listar:()=>{accesos++;return [dato];}}});
  await assert.rejects(()=>handler({ambito:'reserva-sur'},{...contexto,permisos:[]}),e=>e.codigo==='ACCESS_DENIED');assert.equal(accesos,0);
  assert.deepEqual(await handler({ambito:'reserva-sur'},contexto),{ambito:'reserva-sur',observaciones:1,cantidad:3,autoridadEscritura:false});
});
test('C6 una prueba smoke fallida o interrumpida conserva la candidata activa',async()=>{
  const entrega=new EntregaLocal(Buffer.from('anterior'),sha);const base=entrega.estado();
  await assert.rejects(()=>entrega.promover(Buffer.from('nueva'),sha,async()=>false),/SMOKE_RECHAZADO/);
  assert.deepEqual(entrega.estado(),base);
  await assert.rejects(()=>entrega.promover(Buffer.from('nueva'),sha,async()=>{throw new Error('caída');}),/caída/);
  assert.deepEqual(entrega.estado(),base);
});
test('C6 promoción y reversión conservan huellas de los bytes exactos',async()=>{
  const bytes=Buffer.from('anterior');const entrega=new EntregaLocal(bytes,sha);const base=entrega.estado();bytes.fill(0);
  const nueva=Buffer.from('nueva');const r=await entrega.promover(nueva,sha,async copia=>{copia.fill(0);return true;});
  assert.equal(r.sha256,huella(nueva));nueva.fill(0);assert.deepEqual(entrega.revertir(),base);
});
test('C6 no permite revertir sin versión anterior ni promover sin identidad',async()=>{
  const entrega=new EntregaLocal(Buffer.from('base'),sha);assert.throws(()=>entrega.revertir(),/SIN_VERSION_ANTERIOR/);
  await assert.rejects(()=>entrega.promover(Buffer.from('nueva'),'sha-invalido',async()=>true),/CANDIDATA_INVALIDA/);
});
test('C6 serializa promociones locales y bloquea reversión durante smoke',async()=>{
  const entrega=new EntregaLocal(Buffer.from('base'),sha);let terminar;
  const pendiente=entrega.promover(Buffer.from('nueva'),sha,()=>new Promise(resolve=>{terminar=resolve;}));
  await assert.rejects(()=>entrega.promover(Buffer.from('otra'),sha,async()=>true),/ENTREGA_EN_CURSO/);
  assert.throws(()=>entrega.revertir(),/ENTREGA_EN_CURSO/);terminar(true);await pendiente;
  assert.equal(entrega.revertir().sha256,huella(Buffer.from('base')));
});
test('C6 percentiles tienen convención explícita y rechazan muestras inválidas',()=>{
  assert.equal(percentil([3,1,2],.5),2);assert.equal(percentil([3,1,2],.99),3);
  assert.throws(()=>percentil([], .5),/MUESTRA_INVALIDA/);
});
test('C6 mide pares equivalentes con calentamiento excluido y unidades declaradas',async()=>{
  const r=await medir();assert.equal(r.corridas.length,30);assert.equal(r.protocolo.warmupPairs,5);
  assert.match(r.protocolSha256,/^[a-f0-9]{64}$/);assert.equal(r.protocolo.queriesPerPair,100);
  for(const row of r.corridas){assert.equal(row.order.length,2);for(const value of Object.values(row.times))assert.ok(Number.isFinite(value)&&value>=0);}
  assert.equal(r.resumen.barrido.n,30);assert.ok(r.bytesIndiceSerializado>0);assert.equal(r.published,false);
});
