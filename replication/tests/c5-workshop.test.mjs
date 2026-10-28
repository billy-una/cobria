import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root = new URL('../../', import.meta.url);
const read = file => fs.readFileSync(new URL(file,root),'utf8');
test('C5 conserva contrato compartido, comandos y límites de enseñanza',()=>{
  const workshop = JSON.parse(read('editorial/c5/workshop.json'));
  assert.equal(workshop.steps.length,5); assert.equal(workshop.controls.length,4);
  assert.ok(fs.existsSync(new URL(workshop.guide,root)));
  assert.match(workshop.limits,/memoria/);assert.match(workshop.limits,/no certifica/);
  for(const file of ['sitio/app/api-workshop.tsx','libro-cobria/build-book.mjs']) assert.match(read(file),/c5\/workshop.json/);
  const book = read('libro-cobria/index.html');
  assert.equal((book.match(/class="book-page api-workshop"/g)||[]).length,1);
  assert.ok(book.includes(workshop.command));assert.ok(book.includes(workshop.testCommand));
});
