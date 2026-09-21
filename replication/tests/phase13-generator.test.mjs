import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { generate, GENERATOR_TYPES } from '../src/generator.mjs';

test('los quince generadores crean código, prueba, documento y manifiesto',async()=>{
  const root=mkdtempSync(path.join(tmpdir(),'cobria-generators-'));
  for(const type of GENERATOR_TYPES){const result=await generate({type,name:`Ejemplo ${type}`,directory:root});assert.equal(result.created.length,4);assert.equal(result.status,'generated');}
});

test('repetir una generación idéntica no cambia archivos',async()=>{
  const root=mkdtempSync(path.join(tmpdir(),'cobria-idempotent-'));
  const first=await generate({type:'entidad',name:'Observación',directory:root});
  const file=path.join(root,first.created[0]);const before=readFileSync(file,'utf8');
  const second=await generate({type:'entidad',name:'Observación',directory:root});
  assert.equal(second.status,'unchanged');assert.equal(second.created.length,0);assert.equal(second.unchanged.length,4);assert.equal(readFileSync(file,'utf8'),before);
});

test('un archivo divergente detiene todo sin sobrescribir',async()=>{
  const root=mkdtempSync(path.join(tmpdir(),'cobria-conflict-'));
  const first=await generate({type:'puerto',name:'Repositorio',directory:root});const file=path.join(root,first.created[0]);writeFileSync(file,'trabajo humano\n');
  await assert.rejects(()=>generate({type:'puerto',name:'Repositorio',directory:root}),error=>error.code==='CLI_GENERATOR_CONFLICT');
  assert.equal(readFileSync(file,'utf8'),'trabajo humano\n');
});

test('rechaza nombres que podrían escapar rutas o inyectar código',async()=>{
  const root=mkdtempSync(path.join(tmpdir(),'cobria-name-'));
  await assert.rejects(()=>generate({type:'entidad',name:'../../escape',directory:root}),error=>error.code==='CLI_GENERATOR_NAME_INVALID');
  await assert.rejects(()=>generate({type:'desconocido',name:'Ejemplo',directory:root}),error=>error.code==='CLI_GENERATOR_TYPE_INVALID');
});
