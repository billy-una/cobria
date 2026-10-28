import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { auditProject, analyzeArchitecture } from '../scripts/audit-c3-layers.mjs';

const root=new URL('../../',import.meta.url);
const policy=JSON.parse(fs.readFileSync(new URL('specification/phase-5/architecture.yaml',root)));
const analyze=(sources,resources)=>analyzeArchitecture(sources,policy,resources);
const read=file=>fs.readFileSync(new URL(file,root),'utf8');

test('el grafo real de la aplicación conserva las fronteras y no tiene ciclos',()=>{
  const result=auditProject();assert.deepEqual(result.errors,[]);assert.ok(result.files>=27);assert.ok(result.edges.length>0);
});

test('el auditor detecta imports multilínea, reexportaciones y dependencias externas',()=>{
  for(const text of ["import {\n cliente\n} from '../infrastructure/proveedor.mjs';",
    "export {cliente} from '../infrastructure/proveedor.mjs';",
    "const modulo=import('../infrastructure/proveedor.mjs');",
    "const modulo=import('../infrastructure/proveedor.mjs', {with:{type:'json'}});"]){
    assert.ok(analyze({'domain/entidad.mjs':text,'infrastructure/proveedor.mjs':'export const cliente=1;'}).errors.some(error=>error.code==='C3_LAYER_IMPORT'));
  }
  for(const imported of ['node:fs','mongodb'])assert.ok(analyze({'application/caso.mjs':`import x from '${imported}';`}).errors.some(error=>error.code==='C3_EXTERNAL_IMPORT'));
});

test('comentarios y cadenas con apariencia de import no crean falsos positivos',()=>{
  const result=analyze({'domain/entidad.mjs':`// import x from '../infrastructure/no.mjs';\nconst ejemplo="import x from 'mongodb'";`});
  assert.deepEqual(result.errors,[]);
});

test('el auditor rechaza ciclos, imports ausentes, entorno y dependencias calculadas',()=>{
  assert.ok(analyze({'domain/a.mjs':"import {"}).errors.some(error=>error.code==='C3_PARSE'));
  assert.ok(analyze({'domain/a.mjs':"import './b.mjs';",'domain/b.mjs':"import './a.mjs';"}).errors.some(error=>error.code==='C3_CYCLE'));
  assert.ok(analyze({'domain/a.mjs':"import './ausente.mjs';"}).errors.some(error=>error.code==='C3_MISSING_IMPORT'));
  assert.ok(analyze({'application/a.mjs':"const proveedor=process.env.PROVEEDOR;"}).errors.some(error=>error.code==='C3_ENVIRONMENT'));
  assert.ok(analyze({'infrastructure/a.mjs':"const modulo=import(variable);"}).errors.some(error=>error.code==='C3_DYNAMIC_IMPORT'));
});

test('el contrato físico JSON solo entra por infraestructura o composición',()=>{
  const resources=new Set(['../data/fisico.json']);
  assert.ok(analyze({'domain/a.mjs':"import x from '../../data/fisico.json' with {type:'json'};"},resources).errors.some(error=>error.code==='C3_RESOURCE_IMPORT'));
  assert.ok(analyze({'infrastructure/a.mjs':"import x from '../../data/fisico.json' with {type:'json'};"},resources).passed);
});

test('las pruebas declaradas por archivo existen con su nombre exacto',()=>{
  const mapa=JSON.parse(read('replication/examples/ecosistema-app/data/arquitectura.json'));
  for(const item of mapa.files){
    const text=read(`replication/examples/ecosistema-app/${item.proof.file}`);
    assert.ok(text.includes(`test('${item.proof.name}'`),`${item.path}: ${item.proof.name}`);
  }
});

test('C3 conecta diez prácticas al libro y a la web sin perder las anteriores',()=>{
  const curriculum=JSON.parse(read('editorial/curriculum.json'));
  const lessons=curriculum.modules.filter(module=>['arquitectura','capas'].includes(module.key)).flatMap(module=>module.lessons);
  assert.equal(lessons.length,10);
  for(const lesson of lessons){assert.equal(lesson.execution.cwd,'.');assert.equal(lesson.execution.minimumPassed,1);
    assert.equal(lesson.guide,'manuales/28-arquitectura-y-capas-paso-a-paso.md');assert.ok(lesson.execution.expected);}
  assert.equal(curriculum.lessonCount,85);
  assert.equal(curriculum.modules.flatMap(module=>module.lessons).filter(lesson=>lesson.execution).length,25);
  assert.match(read('libro-cobria/build-book.mjs'),/architectureMap/);
  assert.match(read('sitio/app/manual.tsx'),/ArchitectureMap/);
});
