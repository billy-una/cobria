import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {workshop} from '../../editorial/ep2/recorrido.mjs';
import {buildEp2,chapterHtml} from '../../editorial/ep2/build.mjs';
import {editOnce} from '../scripts/verify-ep2-start.mjs';
test('EP2 enseña los diez términos en orden y pide modificar código',()=>{
  assert.deepEqual(workshop.units.map(unit=>unit.term),['problema','dato','variable','condición','función','objeto','archivo','módulo','error','prueba']);
  for(const unit of workshop.units){
    assert.ok(unit.paragraphs.length>=2);assert.ok(unit.exercise);assert.ok(unit.edits.length);
    assert.ok(unit.failure.description);assert.ok(unit.failure.recovery);assert.ok(unit.solution);assert.ok(unit.expected);assert.ok(unit.changed);
  }
});
test('EP2 el libro y la web reciben código idéntico al ejecutable',()=>{
  const data=buildEp2();const html=chapterHtml(data);
  for(const unit of data.units){
    const file=new URL(`../examples/ecosistema-app/taller-inicial/${unit.file}`,import.meta.url);
    assert.equal(unit.code,fs.readFileSync(file,'utf8').trim());
    assert.ok(html.includes(`desde-cero-${unit.id}`));
  }
  assert.match(fs.readFileSync(new URL('../../sitio/app/comenzar/desde-cero/page.tsx',import.meta.url),'utf8'),/ep2\/recorrido.json/);
});
test('EP2 los cambios son selectivos y rechazan un fragmento ambiguo',()=>{
  assert.equal(editOnce('cantidad: 3','3','4'),'cantidad: 4');
  assert.throws(()=>editOnce('33','3','4'));
  assert.throws(()=>editOnce('3','9','4'));
  assert.throws(()=>editOnce('3','','4'));
});
test('EP2 conserva controles y no declara comprensión humana',()=>{
  const unit=workshop.units[8];
  assert.match(unit.paragraphs.join(' '),/sesión confiable/);
  assert.match(unit.paragraphs.join(' '),/IDEMPOTENCY_CONFLICT/);
  assert.match(workshop.finish.join(' '),/consentimiento/);
});
