import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { generate } from '../src/generator.mjs';

const cli = fileURLToPath(new URL('../src/cli.mjs', import.meta.url));
test('simular no crea siquiera el directorio de destino', async () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'cobria-c1-plan-'));
  const target = path.join(parent, 'no-creado');
  const result = await generate({type:'entidad', name:'Observacion', directory:target, simulate:true});
  assert.equal(result.status, 'simulated');
  assert.equal(result.mutations, 0);
  assert.equal(result.planned.length, 4);
  assert.deepEqual(result.created, []);
  assert.equal(fs.existsSync(target), false);
});

test('la CLI propaga simulación y no escribe', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'cobria-c1-cli-'));
  const result = spawnSync(process.execPath, [cli,'generar','--tipo','entidad','--nombre','Observacion','--directorio',target,'--simular','--json'], {encoding:'utf8'});
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).mutations, 0);
  assert.deepEqual(fs.readdirSync(target), []);
});

test('simular no cambia un archivo divergente y conserva el conflicto', async () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'cobria-c1-conflict-'));
  const result = await generate({type:'entidad', name:'Observacion', directory:target});
  const file = path.join(target, result.created[0]);
  fs.writeFileSync(file, 'trabajo humano');
  await assert.rejects(()=>generate({type:'entidad', name:'Observacion', directory:target, simulate:true}), error=>error.code==='CLI_GENERATOR_CONFLICT');
  assert.equal(fs.readFileSync(file,'utf8'), 'trabajo humano');
});

test('init con una simulación no soportada falla sin efectos', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'cobria-c1-init-'));
  const result = spawnSync(process.execPath, [cli,'init','--simular','--directorio',target,'--json'], {encoding:'utf8'});
  assert.notEqual(result.status, 0);
  assert.equal(JSON.parse(result.stderr).code, 'CLI_SIMULATION_UNSUPPORTED');
  assert.deepEqual(fs.readdirSync(target), []);
});
