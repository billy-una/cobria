import test from 'node:test';
import assert from 'node:assert/strict';
import { CacheLecturas } from '../src/data/cache-lecturas.mjs';
import { ColaBorradores } from '../src/data/cola-offline.mjs';
import { AccionUnica } from '../src/application/accion-unica.mjs';
import { TelemetriaAcotada } from '../src/data/telemetria-acotada.mjs';
import { verificarEntrega } from '../src/application/verificar-entrega.mjs';

const contexto = { ambito: 'reserva-sur', politica: 'lectura-v1', recurso: 'obs-1' };
const diferida = () => { let resolver; const promesa = new Promise(resolve => { resolver = resolve; }); return { promesa, resolver }; };

test('lecturas simultáneas comparten una carga y reciben copias independientes', async () => {
  const cache = new CacheLecturas(); let llamadas = 0;
  const cargar = async () => { llamadas++; return { cantidad: 1 }; };
  const [a,b] = await Promise.all([cache.leer(contexto,cargar),cache.leer(contexto,cargar)]);
  a.cantidad = 50;
  assert.equal(llamadas,1); assert.equal(b.cantidad,1);
  b.cantidad = 70;
  assert.equal((await cache.leer(contexto,cargar)).cantidad,1);
});
test('ámbito y versión de política producen claves distintas', async () => {
  const cache = new CacheLecturas(); let llamadas = 0;
  for (const input of [contexto,{...contexto,ambito:'reserva-norte'},{...contexto,politica:'lectura-v2'}]) {
    await cache.leer(input, async () => ++llamadas);
  }
  assert.equal(llamadas,3);
});
test('caché exige contexto y límites válidos', () => {
  assert.throws(() => new CacheLecturas({maxEntradas:0}),/LIMITES/);
  assert.throws(() => new CacheLecturas().leer({...contexto,ambito:''},()=>1),/CONTEXTO/);
});
test('TTL vence y límite de entradas acota memoria', async () => {
  let ahora = 0; let llamadas = 0;
  const cache = new CacheLecturas({maxEntradas:2,ttlMs:10,reloj:()=>ahora});
  const cargar = async () => ++llamadas;
  await cache.leer(contexto,cargar); ahora = 10;
  await cache.leer(contexto,cargar);
  await cache.leer({...contexto,recurso:'obs-2'},cargar);
  await cache.leer({...contexto,recurso:'obs-3'},cargar);
  assert.equal(llamadas,4); assert.equal(cache.entradas.size,2);
});
test('un rechazo no se almacena como ausencia y puede reintentarse', async () => {
  const cache = new CacheLecturas();
  await assert.rejects(cache.leer(contexto,async()=>{throw new Error('PERMISO_DENEGADO');}),/PERMISO/);
  assert.equal(cache.entradas.size,0);
  assert.equal(await cache.leer(contexto,async()=>4),4);
});
test('invalidar una lectura en vuelo impide que sustituya la lectura nueva', async () => {
  const cache = new CacheLecturas(); const vieja = diferida();
  const pendiente = cache.leer(contexto,()=>vieja.promesa);
  await Promise.resolve(); cache.invalidar(contexto);
  await cache.leer(contexto,async()=>({revision:2}));
  vieja.resolver({revision:1}); await pendiente;
  assert.equal((await cache.leer(contexto,async()=>({revision:3}))).revision,2);
});
test('limpiar sesión retira todas las entradas', async () => {
  const cache = new CacheLecturas(); await cache.leer(contexto,async()=>1);
  cache.limpiar(); assert.equal(cache.entradas.size,0);
});
test('un lote mixto no encola siquiera su parte permitida', () => {
  const cola = new ColaBorradores();
  assert.throws(()=>cola.encolarLote([{ruta:'borradores/sur/1',valor:1},{ruta:'inventario/sur',valor:1}]),/ONLINE/);
  assert.equal(cola.items.length,0);
});
test('nodos desconocidos y rutas ambiguas se rechazan', () => {
  const cola = new ColaBorradores();
  assert.throws(()=>cola.encolarLote([{ruta:'desconocido/sur',valor:1}]),/ONLINE/);
  for (const ruta of ['borradores/../inventario','borradores//sur','']) {
    assert.throws(()=>cola.encolarLote([{ruta,valor:1}]),/RUTA/);
  }
});
test('la capacidad de cola rechaza sin escritura parcial', () => {
  const cola = new ColaBorradores({maxItems:1});
  assert.throws(()=>cola.encolarLote([{ruta:'borradores/1',valor:1},{ruta:'borradores/2',valor:2}]),/LLENA/);
  assert.equal(cola.items.length,0);
});
test('los borradores vencidos se clasifican y no se reproducen automáticamente', () => {
  let ahora = 0; const cola = new ColaBorradores({ttlMs:10,reloj:()=>ahora});
  const valor = {especie:'colibri'}; cola.encolarLote([{ruta:'borradores/1',valor}]);
  valor.especie='otro'; ahora = 10;
  assert.equal(cola.clasificar().pendientes.length,0);
  assert.equal(cola.clasificar().vencidos[0].valor.especie,'colibri');
});
test('doble acción en vuelo ejecuta una sola tarea', async () => {
  const acciones = new AccionUnica(); let llamadas = 0;
  const resultados = await Promise.all([acciones.ejecutar('obs-1',()=>++llamadas),acciones.ejecutar('obs-1',()=>++llamadas)]);
  assert.deepEqual(resultados,[1,1]); assert.equal(llamadas,1); assert.equal(acciones.pendientes.size,0);
});
test('un error de acción libera la posibilidad de reintentar', async () => {
  const acciones = new AccionUnica();
  await assert.rejects(acciones.ejecutar('obs-1',()=>{throw new Error('SIN_RED');}),/SIN_RED/);
  assert.equal(await acciones.ejecutar('obs-1',()=>3),3);
});
test('telemetría no conserva campos personales ni identificadores arbitrarios', () => {
  const telemetry = new TelemetriaAcotada();
  telemetry.registrar({metrica:'lectura-observaciones',duracionMs:12,ok:true,email:'privado',uid:'usuario-1'});
  assert.deepEqual(telemetry.items,[{metrica:'lectura-observaciones',duracionMs:12,ok:true}]);
  assert.equal(telemetry.registrar({metrica:'lectura-usuario-1',duracionMs:1,ok:true}),false);
});
test('telemetría acota memoria y descarta valores inválidos', () => {
  const telemetry = new TelemetriaAcotada({maxItems:2});
  for (const duracionMs of [1,2,3]) telemetry.registrar({metrica:'carga-mapa',duracionMs,ok:true});
  assert.deepEqual(telemetry.items.map(x=>x.duracionMs),[2,3]);
  assert.equal(telemetry.registrar({metrica:'carga-mapa',duracionMs:NaN,ok:true}),false);
});

const release = () => ({sha:'a'.repeat(40),digest:'b'.repeat(64),ahora:1000,maxEdadMs:100,
  evidencias:['pruebas','staging','respaldo','restauracion','aprobacion'].map(tipo=>({tipo,sha:'a'.repeat(40),digest:'b'.repeat(64),fechaMs:950,estado:'aprobado'}))});
test('registros del mismo candidato y artefacto pasan la comprobación de consistencia', () => {
  assert.equal(verificarEntrega(release()).consistente,true);
});
test('mezclar SHA o digest de artefactos impide consistencia', () => {
  for (const campo of ['sha','digest']) {
    const input = release(); input.evidencias[1][campo]='c'.repeat(campo==='sha'?40:64);
    assert.throws(()=>verificarEntrega(input),/INCOMPATIBLE/);
  }
});
test('evidencia vieja, futura, duplicada o faltante se rechaza', () => {
  for (const fechaMs of [899,1001]) { const input=release();input.evidencias[0].fechaMs=fechaMs;assert.throws(()=>verificarEntrega(input),/INCOMPATIBLE/); }
  const duplicada=release();duplicada.evidencias[0].tipo='staging';assert.throws(()=>verificarEntrega(duplicada),/INCOMPATIBLE/);
  const faltante=release();faltante.evidencias.pop();assert.throws(()=>verificarEntrega(faltante),/INCOMPLETA/);
});
test('estado fallido e identidades malformadas no se aceptan', () => {
  const input=release();input.evidencias[3].estado='fallido';assert.throws(()=>verificarEntrega(input),/INCOMPATIBLE/);
  assert.throws(()=>verificarEntrega({...release(),sha:'main'}),/IDENTIDAD/);
});
