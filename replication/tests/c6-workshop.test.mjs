import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root = new URL('../../',import.meta.url);
const read = file => fs.readFileSync(new URL(file,root),'utf8');
test('C6 comparte comandos, límites y protocolo sin alterar resultados científicos',()=>{
  const workshop=JSON.parse(read('editorial/c6/workshop.json'));
  assert.equal(workshop.steps.length,5);assert.ok(fs.existsSync(new URL(workshop.guide,root)));
  for(const file of ['sitio/app/operation-workshop.tsx','libro-cobria/build-book.mjs']) assert.match(read(file),/c6\/workshop.json/);
  const html=read('libro-cobria/index.html');
  assert.equal((html.match(/class="book-page operation-workshop"/g)||[]).length,1);
  for(const field of ['command','testCommand','measureCommand'])assert.ok(html.includes(workshop[field]));
  assert.match(workshop.limits,/sin nube/);assert.match(workshop.limits,/no autentica/);
  const protocol=JSON.parse(read('replication/examples/operacion-c6/protocolo.json'));
  assert.equal(protocol.measuredPairs,30);assert.equal(protocol.warmupPairs,5);assert.equal(protocol.queriesPerPair,100);
});
