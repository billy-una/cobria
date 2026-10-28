import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {generateDictionary} from '../src/dictionary-generator.mjs';
import {spawnSync} from 'node:child_process';

test('diccionario simula sin escribir, repite y conserva ediciones humanas',async()=>{
  const parent=await fs.mkdtemp(path.join(os.tmpdir(),'cobria-dictionary-'));
  const directory=path.join(parent,'proyecto');
  assert.equal((await generateDictionary({name:'Observaciones',directory,simulate:true})).mutations,0);
  assert.deepEqual(await fs.readdir(parent),[]);
  const first=await generateDictionary({name:'Observaciones',directory});
  const file=path.join(directory,first.created[0]);
  const data=JSON.parse(await fs.readFile(file));
  assert.deepEqual(data.identity,['ambito','id']);
  assert.ok(data.fields.every(field=>field.physical===null));
  assert.equal((await generateDictionary({name:'Observaciones',directory})).status,'unchanged');
  await fs.writeFile(file,'edición humana');
  await assert.rejects(()=>generateDictionary({name:'Observaciones',directory}),{code:'CLI_GENERATOR_CONFLICT'});
  assert.equal(await fs.readFile(file,'utf8'),'edición humana');
});

test('diccionario rechaza rutas y enlaces también durante simulación',async()=>{
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'cobria-dictionary-'));
  await assert.rejects(()=>generateDictionary({name:'../datos',directory}),{code:'CLI_DICTIONARY_NAME_INVALID'});
  const external=await fs.mkdtemp(path.join(os.tmpdir(),'cobria-dictionary-external-'));
  await fs.symlink(external,path.join(directory,'data'));
  await assert.rejects(()=>generateDictionary({name:'Aves',directory,simulate:true}),{code:'CLI_DESTINATION_UNSAFE'});
  assert.deepEqual(await fs.readdir(external),[]);
});

test('CLI acepta la sintaxis del roadmap y rechaza tipos duplicados',()=>{
  const cli=new URL('../src/cli.mjs',import.meta.url).pathname;
  const run=args=>spawnSync(process.execPath,[cli,...args,'--json'],{encoding:'utf8'});
  const result=run(['generar','diccionario','--nombre','Aves','--simular']);
  assert.equal(result.status,0,result.stderr);
  assert.equal(JSON.parse(result.stdout).mutations,0);
  const repeated=run(['generar','diccionario','--tipo','modulo','--nombre','Aves']);
  assert.equal(repeated.status,2);
  assert.equal(JSON.parse(repeated.stderr).code,'CLI_OPTION_DUPLICATED');
});
