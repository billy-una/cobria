import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,readdir,writeFile,mkdir,symlink} from 'node:fs/promises';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {generate,GENERATOR_TYPES} from '../src/generator.mjs';
import {validarManifiestos,inicializar} from '../src/toolkit.mjs';

const cli=new URL('../src/cli.mjs',import.meta.url).pathname;
const temp=()=>mkdtemp(path.join(tmpdir(),'cobria-c9-test-'));
const run=args=>spawnSync(process.execPath,[cli,...args,'--json'],{encoding:'utf8',timeout:20000});

test('C9 todos los argumentos de valor incompletos fallan de forma estable',()=>{
  for(const flag of ['--adaptador','--salida','--tamano','--ruta','--raiz','--id','--directorio','--tipo','--nombre','--codigo','--archivo','--ambiente','--artefacto']){
    const r=run(['generar',flag]);assert.equal(r.status,2,flag);assert.equal(JSON.parse(r.stderr).code,'CLI_OPTION_VALUE_REQUIRED');
  }
  const helpAsValue=run(['generar','--directorio','-h']);assert.equal(helpAsValue.status,2);assert.equal(JSON.parse(helpAsValue.stderr).code,'CLI_OPTION_VALUE_REQUIRED');
});
test('C9 rechaza opciones duplicadas y tamaño no válido',()=>{
  const repeated=run(['validar','--ruta','uno','--ruta','dos']);assert.equal(repeated.status,2);assert.equal(JSON.parse(repeated.stderr).code,'CLI_OPTION_DUPLICATED');
  for(const size of ['0','-1','NaN','1.5','100001']){const r=run(['verificar','--tamano',size]);assert.equal(r.status,2);assert.equal(JSON.parse(r.stderr).code,'CLI_SIZE_INVALID');}
});
test('C9 los quince tipos simulan sin crear destino y generan pruebas ejecutables',async()=>{
  const parent=await temp(),root=path.join(parent,'proyecto');
  for(const type of GENERATOR_TYPES){const r=await generate({type,name:`Reserva ${type}`,directory:root,simulate:true});assert.equal(r.mutations,0);assert.equal(r.planned.length,4);}
  assert.deepEqual(await readdir(parent),[]);
  const tests=[];
  for(const type of GENERATOR_TYPES){const r=await generate({type,name:`Reserva ${type}`,directory:root});assert.equal(r.created.length,4);tests.push(path.join(root,r.created[1]));}
  const r=spawnSync(process.execPath,['--test',...tests],{encoding:'utf8',timeout:20000});assert.equal(r.status,0,r.stderr+r.stdout);
});
test('C9 rechaza símbolos inválidos antes de crear archivos',async()=>{
  const root=await temp();
  for(const name of ['123 Reserva','123','__','森林',123,null])await assert.rejects(()=>generate({type:'entidad',name,directory:root}),e=>e.code==='CLI_GENERATOR_NAME_INVALID');
  assert.deepEqual(await readdir(root),[]);
});
test('C9 enlaces de directorio y archivo se rechazan también en simulación',async()=>{
  const root=await temp(),external=await temp();await symlink(external,path.join(root,'src'));
  for(const simulate of [true,false])await assert.rejects(()=>generate({type:'entidad',name:'Reserva',directory:root,simulate}),e=>e.code==='CLI_DESTINATION_UNSAFE');
  assert.deepEqual(await readdir(external),[]);
  const other=await temp();await mkdir(path.join(other,'src/generated'),{recursive:true});
  const file=path.join(external,'humano.mjs');await writeFile(file,'trabajo humano');await symlink(file,path.join(other,'src/generated/entidad-reserva.mjs'));
  await assert.rejects(()=>generate({type:'entidad',name:'Reserva',directory:other}),e=>e.code==='CLI_DESTINATION_UNSAFE');assert.equal(await readFile(file,'utf8'),'trabajo humano');
});
test('C9 init conflictivo no añade README ni sigue enlaces',async()=>{
  const root=await temp();await mkdir(path.join(root,'.cobria'));await writeFile(path.join(root,'.cobria/project.yaml'),'trabajo humano');
  await assert.rejects(()=>inicializar(root),e=>e.code==='CLI_INIT_CONFLICT');assert.deepEqual(await readdir(root),['.cobria']);
  const other=await temp(),external=await temp();await symlink(external,path.join(other,'.cobria'));
  await assert.rejects(()=>inicializar(other),e=>e.code==='CLI_DESTINATION_UNSAFE');assert.deepEqual(await readdir(external),[]);
});
test('C9 validación documental es pura y tolera envolturas malformadas',()=>{
  const manifests=[{file:'local.json',data:{schemaVersion:'1.0.0',manifestId:'demo',records:[{id:'DEMO',source:'README.md',version:'1.0.0',owner:'brigada',references:['README.md'],data:{status:'proposed'}}]}}];
  const before=JSON.stringify(manifests);assert.equal(validarManifiestos(manifests,'.').valid,true);assert.equal(JSON.stringify(manifests),before);
  for(const data of [null,[],{records:{}},{schemaVersion:'1.0.0',manifestId:'x',records:[null]}]){const report=validarManifiestos([{file:'roto.json',data}],'.');assert.equal(report.valid,false);assert.ok(report.errors.length);}
});

test('C9 un informe existente no se sobrescribe',async()=>{
  const root=await temp();await writeFile(path.join(root,'informe.json'),'informe humano');
  const r=run(['informar','--salida',root]);assert.equal(r.status,4);assert.equal(JSON.parse(r.stderr).code,'CLI_OUTPUT_CONFLICT');
  assert.equal(await readFile(path.join(root,'informe.json'),'utf8'),'informe humano');assert.deepEqual(await readdir(root),['informe.json']);
});
test('C9 contexto y métricas no interpretan manifiestos inválidos como evidencia',async()=>{
  const root=await temp(),file=path.join(root,'roto.json');await writeFile(file,'null');
  for(const command of ['medir','contexto']){const r=run([command,'--ruta',file,'--id','DEMO']);assert.equal(r.status,1);assert.equal(JSON.parse(r.stderr).code,'CLI_MANIFEST_ENVELOPE_INVALID');}
});
