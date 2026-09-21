import test from 'node:test';
import assert from 'node:assert/strict';
import {EstadoOperativo} from '../src/estado-operativo.mjs';
import {AutoridadTransaccional} from '../src/autoridad-transaccional.mjs';
import {PoliticaOffline, ColaOffline} from '../src/offline-governado.mjs';
import {evaluateRelease} from '../src/release-gate.mjs';
import {TelemetriaPrivada} from '../src/telemetria-privada.mjs';
import {verifyLegacyBudget} from '../src/legado-verificable.mjs';

test('estado operativo evita doble ejecución concurrente', async () => {
  const state = new EstadoOperativo(); let calls = 0;
  const action = async () => { calls += 1; await new Promise(resolve => setTimeout(resolve, 5)); return [1]; };
  await Promise.all([state.execute(action), state.execute(action)]);
  assert.equal(calls, 1); assert.equal(state.state.type, 'exito');
});

test('estado operativo diferencia vacío y error estable', async () => {
  const state = new EstadoOperativo(); await state.execute(async () => []); assert.equal(state.state.type, 'vacio');
  await assert.rejects(state.retry(async () => { throw Object.assign(new Error('fallo'), {code:'TEMPORARY'}); }));
  assert.deepEqual(state.state, {type:'error', code:'TEMPORARY'});
});

test('autoridad aplica una vez y audita sin copiar el contenido', async () => {
  let applied = 0;
  const authority = new AutoridadTransaccional({authorize: c => { if(c.scope !== 'reserva-sur') throw Object.assign(new Error('denegado'),{code:'FORBIDDEN'}); }, apply: async input => ({id: input.id, revision: ++applied})});
  const request = {requestId:'req-1', input:{id:'insumo-1'}, context:{actor:'persona-1',scope:'reserva-sur',capability:'traslado:crear'}};
  assert.equal((await authority.execute(request)).duplicate, false);
  assert.equal((await authority.execute(request)).duplicate, true);
  assert.equal(applied, 1); assert.equal(authority.audit()[0].input, undefined);
});

test('autoridad rechaza ámbito y conflicto de idempotencia', async () => {
  const authority = new AutoridadTransaccional({authorize:c=>{if(c.scope!=='a') throw Object.assign(new Error(),{code:'FORBIDDEN'});},apply:async()=>({ok:true})});
  await assert.rejects(authority.execute({requestId:'x',input:{v:1},context:{actor:'u',scope:'b',capability:'x'}}), {code:'FORBIDDEN'});
  await authority.execute({requestId:'x',input:{v:1},context:{actor:'u',scope:'a',capability:'x'}});
  await assert.rejects(authority.execute({requestId:'x',input:{v:2},context:{actor:'u',scope:'a',capability:'x'}}), {code:'IDEMPOTENCY_CONFLICT'});
});

test('preflight offline rechaza todo el lote crítico', () => {
  const policy = new PoliticaOffline({onlineOnly:['saldo:ajustar']});
  assert.throws(()=>policy.preflight([{type:'nota:crear'},{type:'saldo:ajustar'}]), {code:'ONLINE_REQUIRED'});
});

test('cola offline es acotada y mueve agotados a dead-letter', async () => {
  const queue = new ColaOffline({capacity:1,maxAttempts:1}); queue.enqueue({id:'n-1'});
  assert.throws(()=>queue.enqueue({id:'n-2'}), {code:'QUEUE_FULL'});
  await queue.drain(async()=>{throw new Error('sin red');});
  assert.equal(queue.items.length,0); assert.equal(queue.dead[0].reason,'attempts-exhausted');
});

test('release falla cerrado y exige el mismo artefacto', () => {
  const base={commit:'abc',artifactDigest:'sha:a',stagingDigest:'sha:b',testsPassed:true,backupVerified:true,approval:true,smokePlan:true,rollbackArtifact:true};
  assert.deepEqual(evaluateRelease(base), {decision:'NO-GO',missing:['sameArtifact']});
  assert.equal(evaluateRelease({...base,stagingDigest:'sha:a'}).decision,'GO');
});

test('telemetría elimina identificadores y no bloquea por transporte', async () => {
  const telemetry = new TelemetriaPrivada({capacity:1,transport:async()=>{throw new Error('caído');}});
  telemetry.record({operation:'rtdb:list',durationMs:12,outcome:'ok',userId:'secreto',path:'/empresa/1'});
  assert.equal(await telemetry.flush(), false); assert.deepEqual(telemetry.queue,[{operation:'rtdb:list',durationMs:12,outcome:'ok'}]);
});

test('legado no puede crecer y queda removible sin consumidores', () => {
  assert.deepEqual(verifyLegacyBudget({baselineBytes:100,currentBytes:90,previousConsumers:2,currentConsumers:0}), {ok:true,violations:[],removable:true});
  assert.equal(verifyLegacyBudget({baselineBytes:100,currentBytes:101,previousConsumers:2,currentConsumers:3,addedResponsibilities:1}).ok,false);
});
