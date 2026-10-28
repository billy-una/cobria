import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Observacion } from '../examples/ecosistema-app/src/domain/observacion.mjs';
import { requireExecutedTests, validateExecution } from '../scripts/verify-c1-start.mjs';

const root=new URL('../../',import.meta.url);
const read=name=>fs.readFileSync(new URL(name,root),'utf8');
const curriculum=JSON.parse(read('editorial/curriculum.json'));

test('las diez primeras lecciones declaran contexto, comando, resultado y prueba real',()=>{
  const lessons=curriculum.modules.filter(x=>['inicio','fundamentos'].includes(x.key)).flatMap(x=>x.lessons);
  assert.equal(lessons.length,10);
  for(const lesson of lessons){
    assert.equal(lesson.execution.cwd,'.');assert.ok(lesson.execution.expected);
    assert.ok(lesson.execution.prerequisites.length);assert.ok(lesson.execution.troubleshooting.length);
    for(const filename of lesson.execution.tests)assert.ok(fs.existsSync(fileURLToPath(new URL(filename,root))));
  }
});

test('los treinta laboratorios declaran directorio y no invocan metas inexistentes',()=>{
  for(const lab of curriculum.labs){
    assert.equal(lab.cwd,'.');assert.ok(lab.prerequisites.length);assert.ok(lab.verificationScope);
    assert.ok(!lab.command.includes('verificar-ejemplos-patrones'));
    assert.ok(!lab.command.includes('paquete-candidato'));
    if(lab.command.startsWith('npm '))assert.ok(lab.command.includes('--prefix'));
  }
});

test('la entidad enseñada usa constructor y rechaza cero y negativos',()=>{
  const entrada={id:'obs-1',ambito:'reserva-sur',especie:'colibri',revision:1,observadaEn:'2026-10-17T12:00:00Z'};
  assert.equal(new Observacion({...entrada,cantidad:1}).cantidad,1);
  for(const cantidad of [0,-1,1.5])assert.throws(()=>new Observacion({...entrada,cantidad}),error=>error.codigo==='OBS_QUANTITY_INVALID');
  assert.equal(Observacion.crear,undefined);
  assert.ok(!JSON.stringify(curriculum.modules).includes('Observacion.crear'));
});

test('cero pruebas y fallos no se aceptan como éxito de una lección',()=>{
  assert.throws(()=>requireExecutedTests('# pass 0\n# fail 0\n'));
  assert.throws(()=>requireExecutedTests('# pass 1\n# fail 1\n'));
  assert.equal(requireExecutedTests('# pass 1\n# fail 0\n'),1);
});

test('el verificador no ejecuta comandos arbitrarios copiados de documentación',()=>{
  assert.throws(()=>validateExecution({cwd:'.',binary:'node',argv:['-e','escribir()']},[]));
  assert.throws(()=>validateExecution({cwd:'otra',binary:'npm',argv:[]},[]));
});

test('libro y web representan los contratos de práctica y su resultado esperado',()=>{
  assert.match(read('libro-cobria/build-book.mjs'),/renderLessonExecution/);
  assert.match(read('sitio/app/manual.tsx'),/LessonExecution execution=/);
  assert.match(read('sitio/app/aprender/[modulo]/[leccion]/page.tsx'),/LessonExecution execution=/);
  assert.match(read('manuales/26-primer-proyecto-paso-a-paso.md'),/Cantidad cero: OBS_QUANTITY_INVALID/);
});
