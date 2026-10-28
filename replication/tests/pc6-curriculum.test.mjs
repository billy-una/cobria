import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const curriculum=JSON.parse(fs.readFileSync(path.join(root,'editorial/curriculum.json')));
test('PC6 cada una de 85 lecciones conserva práctica, guía y rúbrica',()=>{
  const lessons=curriculum.modules.flatMap(m=>m.lessons);assert.equal(lessons.length,85);
  assert.equal(lessons.filter(l=>l.execution).length,25);
  assert.equal(lessons.filter(l=>l.practice.kind==='artefacto-con-rubrica').length,60);
  assert.equal(new Set(lessons.map(l=>l.practice.exercise)).size,85);
  for(const lesson of lessons){
    assert.ok(fs.existsSync(path.join(root,lesson.guide)),lesson.guide);
    for(const key of ['exercise','expected','frequentError','recovery','solution','assessment'])assert.ok(lesson.practice[key]?.length>20,`${lesson.title}: ${key}`);
    assert.ok(lesson.practice.steps.length>=3);assert.ok(lesson.practice.rubric.length>=4);
    for(const item of lesson.practice.files)assert.ok(fs.existsSync(path.join(root,item.path)),item.path);
    assert.ok(lesson.practice.vocabulary.length>=2);
  }
});
