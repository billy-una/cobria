import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const cli=path.join(root,'src/cli.mjs');
const run=(args)=>spawnSync(process.execPath,[cli,...args],{cwd:path.resolve(root,'..'),encoding:'utf8'});

test('la ayuda está en español y enumera los ocho comandos',()=>{
  const result=run(['--ayuda']); assert.equal(result.status,0);
  for(const command of ['init','validar','explicar','contexto','impacto','auditar','medir','verificar']) assert.match(result.stdout,new RegExp(`\\b${command}\\b`));
});

test('validar, explicar, contexto, impacto, auditar y medir producen JSON',()=>{
  for(const args of [
    ['validar','--json'],['explicar','--id','NODE-OBS-CANONICAL','--json'],
    ['contexto','--id','SEC-OP-001','--json'],['impacto','--id','ENT-OBSERVACION','--json'],
    ['auditar','--json'],['medir','--json']]) {
    const result=run(args); assert.equal(result.status,0,`${args.join(' ')}: ${result.stderr}`); assert.equal(JSON.parse(result.stdout).ok,true);
  }
});

test('un concepto ausente usa código y salida estables',()=>{
  const result=run(['explicar','--id','NO-EXISTE','--json']); assert.equal(result.status,3);
  const error=JSON.parse(result.stderr); assert.equal(error.code,'CLI_CONCEPT_NOT_FOUND');
});

test('init no sobrescribe un proyecto existente',()=>{
  const directory=mkdtempSync(path.join(tmpdir(),'cobria-cli-'));
  const first=run(['init','--directorio',directory,'--json']); assert.equal(first.status,0,first.stderr);
  const second=run(['init','--directorio',directory,'--json']); assert.equal(second.status,4); assert.equal(JSON.parse(second.stderr).code,'CLI_INIT_CONFLICT');
});

test('el paquete puede prepararse sin instalar dependencias nuevas',()=>{
  const output=execFileSync('npm',['pack','--dry-run','--json'],{cwd:root,encoding:'utf8'});
  const report=JSON.parse(output); assert.ok(report[0].files.some(file=>file.path==='src/cli.mjs'));
});

test('iniciar funciona como alias y conserva no sobrescritura',()=>{
  const directory=mkdtempSync(path.join(tmpdir(),'cobria-iniciar-'));
  assert.equal(run(['iniciar','--directorio',directory,'--json']).status,0);
  assert.equal(run(['iniciar','--directorio',directory,'--json']).status,4);
});

test('publicar exige simulación y nunca muta',()=>{
  const denied=run(['publicar','--ambiente','staging','--artefacto',`sha256:${'a'.repeat(64)}`,'--json']);
  assert.equal(denied.status,2); assert.equal(JSON.parse(denied.stderr).code,'CLI_PUBLISH_SIMULATION_REQUIRED');
  const simulated=run(['publicar','--simular','--ambiente','staging','--artefacto',`sha256:${'a'.repeat(64)}`,'--json']);
  assert.equal(simulated.status,0); assert.equal(JSON.parse(simulated.stdout).mutations,0);
});

test('informar produce HTML y JSON explícitamente locales',()=>{
  const directory=mkdtempSync(path.join(tmpdir(),'cobria-report-'));
  const result=run(['informar','--salida',directory,'--json']);
  assert.equal(result.status,0,result.stderr);
  const response=JSON.parse(result.stdout); assert.deepEqual(response.files,['informe.json','informe.html']);
});
