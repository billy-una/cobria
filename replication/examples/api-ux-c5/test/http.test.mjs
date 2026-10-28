import test from 'node:test';
import assert from 'node:assert/strict';
import { request } from 'node:http';
import { abrirTaller } from '../server.mjs';
import { crearAplicacion } from '../../ecosistema-app/src/composition.mjs';

const token = 'sesion_demo_c5_abcdefghijkl';
const entrada = {id:'obs-c5',ambito:'reserva-sur',especie:'colibri',cantidad:3,revision:1,observadaEn:'2026-10-18T12:00:00Z'};
const principal = {actorId:'lector-demo',permisos:['observaciones:leer','observaciones:escribir'],ambitos:['reserva-sur'],expiraEn:Date.now()+60000};
async function abrir(t, session = principal, app) {
  const taller = await abrirTaller({sesiones:new Map([[token, session]]),app});
  t.after(() => taller.cerrar());
  const post = (body = entrada, headers = {}) => fetch(`${taller.url}/api/observaciones`, {method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json','idempotency-key':'operacion-c5',...headers},body:typeof body === 'string' ? body : JSON.stringify(body)});
  const get = (query = 'ambito=reserva-sur', headers = {}) => fetch(`${taller.url}/api/observaciones?${query}`,{headers:{authorization:`Bearer ${token}`,...headers}});
  return {...taller,post,get};
}
test('HTTP registra, repite y consulta dentro del ámbito autorizado', async t => {
  const s = await abrir(t);
  assert.equal((await s.post()).status,201);
  assert.equal((await s.post()).status,201);
  const response = await s.get();
  assert.equal(response.status,200);
  const data = await response.json();
  assert.equal(data.datos.length,1); assert.equal(data.datos[0].cantidad,3);
});
test('HTTP rechaza una sesión ausente, desconocida o vencida', async t => {
  const s = await abrir(t,{...principal,expiraEn:0});
  for (const authorization of ['', 'Bearer sesion_inexistente_12345',`Bearer ${token}`]) assert.equal((await s.get(undefined,{authorization})).status,401);
});
test('HTTP deniega escritura al lector aunque llame directamente sin formulario', async t => {
  const s = await abrir(t,{...principal,permisos:['observaciones:leer']});
  assert.equal((await s.post()).status,403);
  assert.equal((await s.get()).status,200);
  assert.equal((await s.app.repositorio.listar('reserva-sur')).length,0);
});
test('HTTP rechaza ámbito ajeno antes de cualquier acceso al repositorio', async t => {
  let accesos = 0;
  const repositorio = Object.fromEntries(['guardar','listar','buscarOperacion','registrarOperacion'].map(name => [name,async()=>{accesos++; throw new Error('Acceso inesperado');}]));
  const s = await abrir(t,principal,crearAplicacion({repositorio}));
  assert.equal((await s.post({...entrada,ambito:'reserva-norte'})).status,403);
  assert.equal((await s.get('ambito=reserva-norte')).status,403);
  assert.equal(accesos,0);
});
test('HTTP no admite permisos, actor ni finalidad suministrados por el cliente', async t => {
  const s = await abrir(t);
  for (const extra of [{permisos:['admin']},{actorId:'otro'},{finalidad:'otra'},{__extra:true}]) assert.equal((await s.post({...entrada,...extra})).status,400);
  assert.equal((await s.app.repositorio.listar('reserva-sur')).length,0);
});
test('HTTP valida tipos, JSON y reglas del dominio sin persistir entradas inválidas', async t => {
  const s = await abrir(t);
  for (const body of ['{', 'null', '[]', {...entrada,id:7}, {...entrada,cantidad:0}, {...entrada,observadaEn:'fecha-invalida'}, {...entrada,observadaEn:'2026-02-31T12:00:00Z'}, {...entrada,observadaEn:'10/18/2026'}]) assert.equal((await s.post(body)).status,400);
  assert.equal((await s.app.repositorio.listar('reserva-sur')).length,0);
});
test('HTTP rechaza conflicto de idempotencia sin sobreescribir', async t => {
  const s = await abrir(t);
  await s.post();
  const r = await s.post({...entrada,cantidad:4});
  assert.equal(r.status,409); assert.equal((await r.json()).code,'IDEMPOTENCY_CONFLICT');
  assert.equal((await s.app.repositorio.listar('reserva-sur'))[0].cantidad,3);
});
test('HTTP exige JSON, clave y tamaño acotado', async t => {
  const s = await abrir(t);
  assert.equal((await s.post(entrada,{'content-type':'text/plain'})).status,415);
  assert.equal((await s.post(entrada,{'idempotency-key':''})).status,400);
  assert.equal((await s.post(' '.repeat(4100))).status,413);
});
test('HTTP rechaza consultas ambiguas, límites inválidos y métodos ajenos', async t => {
  const s = await abrir(t);
  for (const query of ['ambito=reserva-sur&ambito=reserva-norte','ambito=reserva-sur&permisos=admin','ambito=reserva-sur&limite=101','ambito=reserva-sur&cursor=malo']) assert.equal((await s.get(query)).status,400);
  const r = await fetch(`${s.url}/api/observaciones`,{method:'DELETE'});
  assert.equal(r.status,405); assert.equal(r.headers.get('allow'),'GET, POST');
});
test('HTTP restringe origen y host sin abrir CORS', async t => {
  const s = await abrir(t);
  for (const headers of [{origin:'https://ajeno.invalid'}]) {
    const r = await s.post(entrada,headers); assert.equal(r.status,403); assert.equal(r.headers.get('access-control-allow-origin'),null);
  }
  const status = await new Promise((resolve,reject) => {
    const req = request(s.url, {headers:{host:'ajeno.invalid'}}, res => {res.resume();resolve(res.statusCode);});
    req.on('error',reject); req.end();
  });
  assert.equal(status,403);
});
test('HTTP no filtra errores internos ni almacena documentos y tokens en auditoría', async t => {
  const s = await abrir(t);
  await s.post();
  const eventos = JSON.stringify(s.app.auditoria.listar());
  for (const secreto of [token,'operacion-c5','colibri','observadaEn']) assert.ok(!eventos.includes(secreto));
  assert.match(eventos,/aprendizaje-c5/);
  const rota = await abrir(t,principal,{listarController:{ejecutar:()=>{throw new Error('secreto-interno');}}});
  const r = await rota.get(); assert.equal(r.status,500); assert.ok(!(await r.text()).includes('secreto-interno'));
});
test('HTTP publica formulario etiquetado y cabeceras restrictivas', async t => {
  const s = await abrir(t);
  const r = await fetch(s.url); const html = await r.text();
  assert.equal(r.status,200); assert.equal(r.headers.get('cache-control'),'no-store');
  assert.match(r.headers.get('content-security-policy'),/frame-ancestors 'none'/);
  assert.match(html,/role="status"/); assert.match(html,/type="password"/);
  for (const id of ['sesion','id','ambito','especie','cantidad','fecha']) assert.ok(html.includes(`for="${id}"`));
});
