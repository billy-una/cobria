import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {abrirIntegral} from '../composition.mjs';

const observation={id:'obs-pc5',ambito:'reserva-sur',especie:'colibri',cantidad:3,revision:1,observadaEn:'2026-10-18T12:00:00Z'};
const profiles=[
  {role:'lector',permissions:['observaciones:leer'],read:200,write:403,backup:403},
  {role:'brigadista',permissions:['observaciones:leer','observaciones:escribir'],read:200,write:201,backup:403},
  {role:'custodio',permissions:['observaciones:leer','observaciones:respaldar'],read:200,write:403,backup:200},
  {role:'sin-capacidades',permissions:[],read:403,write:403,backup:403}
];
for(const p of profiles)test(`PC5 matriz HTTP del rol ${p.role}`,async t=>{
  const directory=await mkdtemp(path.join(tmpdir(),'cobria-pc5-'));
  const token='pc5_sesion_ficticia_abcdefghijkl';
  const session={actorId:p.role,permisos:p.permissions,ambitos:['reserva-sur'],expiraEn:Date.now()+60000};
  const app=await abrirIntegral({directory:path.join(directory,'motor'),sesiones:new Map([[token,session]])});
  t.after(()=>app.cerrar());const headers={authorization:`Bearer ${token}`};
  const get=route=>fetch(`${app.url}/api/${route}?ambito=reserva-sur`,{headers});
  assert.equal((await get('observaciones')).status,p.read);
  assert.equal((await get('respaldo')).status,p.backup);
  assert.equal((await fetch(`${app.url}/api/observaciones`,{method:'POST',headers:{...headers,'content-type':'application/json','idempotency-key':'pc5-operacion'},body:JSON.stringify(observation)})).status,p.write);
  // Cada perfil, incluso el autorizado, se rechaza fuera de su ámbito.
  for(const route of ['observaciones','resumen','respaldo','evidencia']){
    const r=await fetch(`${app.url}/api/${route}?ambito=reserva-norte${route==='evidencia'?'&consulta=colibri':''}`,{headers});
    assert.equal(r.status,403);
  }
  assert.equal((await app.repo.info()).documentosMotor,p.write===201?1:0);
});
test('PC5 sesión vencida rechaza todas las rutas antes de acceder al motor',async t=>{
  const directory=await mkdtemp(path.join(tmpdir(),'cobria-pc5-expirada-'));
  const token='pc5_sesion_expirada_abcdefghijkl';
  const app=await abrirIntegral({directory:path.join(directory,'motor'),sesiones:new Map([[token,{actorId:'custodio',permisos:['observaciones:leer','observaciones:respaldar','observaciones:escribir'],ambitos:['reserva-sur'],expiraEn:0}]])});
  t.after(()=>app.cerrar());let calls=0;
  for(const method of ['leerEstado','registrarAtomico','exportar'])app.repo[method]=async()=>{calls++;throw Error('ACCESO_INDEBIDO');};
  const headers={authorization:`Bearer ${token}`};
  for(const route of ['observaciones','resumen','respaldo','evidencia'])assert.equal((await fetch(`${app.url}/api/${route}?ambito=reserva-sur&${route==='evidencia'?'consulta=colibri':''}`,{headers})).status,401);
  assert.equal((await fetch(`${app.url}/api/observaciones`,{method:'POST',headers:{...headers,'content-type':'application/json','idempotency-key':'pc5-expirada'},body:JSON.stringify(observation)})).status,401);
  assert.equal(calls,0);
});
