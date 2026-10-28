import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { traducirErrorEs } from '../examples/ecosistema-app/src/presentation/i18n/mensajes-es.mjs';

const root=new URL('../../',import.meta.url);
const read=relative=>fs.readFileSync(new URL(relative,root),'utf8');
const curriculum=JSON.parse(read('editorial/curriculum.json'));
const datos=curriculum.modules.find(module=>module.key==='datos');

test('los ocho rechazos C2 tienen código catalogado y mensaje español',()=>{
  const catalog=JSON.parse(read('specification/phase-6/ERROR-CATALOG.json'));
  for(const code of ['DATA_FIELDS_INVALID','DATA_SCOPE_REQUIRED','DATA_SPECIES_REQUIRED','DATA_LIMIT_INVALID',
    'CAT_VERSION_UNKNOWN','CAT_CODE_UNKNOWN','CAT_VERSION_REQUIRED','CAT_VERSION_CONFLICT']){
    assert.ok(catalog.errors.some(item=>item.code===code));
    assert.notEqual(traducirErrorEs(code),traducirErrorEs('CODIGO_DESCONOCIDO'));
  }
});

test('C2 tiene cinco lecciones con comandos, resultados y pruebas concretas',()=>{
  assert.equal(datos.lessons.length,5);
  for(const lesson of datos.lessons){
    assert.equal(lesson.execution.cwd,'.');assert.equal(lesson.execution.binary,'node');
    assert.equal(lesson.guide,'manuales/27-datos-desde-cero.md');
    assert.ok(lesson.execution.expected);assert.equal(lesson.execution.minimumPassed,1);
    assert.equal(lesson.execution.tests[0],'replication/examples/ecosistema-app/test/datos-c2.test.mjs');
  }
  assert.ok(datos.sources.includes('replication/examples/ecosistema-app/data/diccionario-observaciones.json'));
});

test('C2 distingue el contrato local de la referencia y no atribuye motores al taller',()=>{
  const manual=read('manuales/27-datos-desde-cero.md');
  for(const text of ['No mezcles el esquema 3','`cantidad` | `g`','O(N + M log M)',
    'no reemplaza esa autorización','no un despliegue sin interrupciones'])assert.ok(manual.includes(text),text);
  assert.ok(!read('manuales/04-bases-de-datos.md').includes('"c":"colibri"'));
});

test('C2 publica quince contratos ejecutables sin reemplazar la ruta C1',()=>{
  const lessons=curriculum.modules.filter(module=>['inicio','fundamentos','datos'].includes(module.key)).flatMap(module=>module.lessons);
  assert.equal(lessons.filter(lesson=>lesson.execution).length,15);
  assert.equal(curriculum.lessonCount,85);
  assert.match(read('libro-cobria/build-book.mjs'),/htmlText\(lesson.guide/);
  assert.match(read('sitio/app/aprender/[modulo]/[leccion]/page.tsx'),/LessonExecution execution=/);
});
