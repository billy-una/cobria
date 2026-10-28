import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../../',import.meta.url);
const read=file=>fs.readFileSync(new URL(file,root),'utf8');
test('C8 comparte integración real y límites sin prometer producción',()=>{
  const w=JSON.parse(read('editorial/c8/workshop.json'));
  assert.equal(w.steps.length,4);assert.ok(fs.existsSync(new URL(w.guide,root)));
  const html=read('libro-cobria/index.html');assert.equal((html.match(/class="book-page integral-workshop"/g)||[]).length,1);
  for(const field of ['command','installCommand','testCommand','verifyCommand'])assert.ok(html.includes(w[field]));
  for(const source of ['sitio/app/integral-workshop.tsx','libro-cobria/build-book.mjs'])assert.match(read(source),/c8\/workshop.json/);
  assert.match(w.limits,/no producción/);assert.match(w.limits,/No prueba caída eléctrica/);
  const useCase=read('replication/examples/integral-c8/application/registrar-durable.mjs');
  assert.doesNotMatch(useCase,/from ['"].*(pouch|infrastructure)/);
});
