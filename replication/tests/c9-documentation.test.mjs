import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../../',import.meta.url),read=file=>fs.readFileSync(new URL(file,root),'utf8');
test('C9 conserva cuatro funciones documentales y un recorrido compartido',()=>{
  const w=JSON.parse(read('editorial/c9/workshop.json')),registry=JSON.parse(read('editorial/c9/documents.json'));
  assert.equal(w.steps.length,4);assert.equal(registry.documents.length,4);assert.ok(registry.owner);assert.ok(registry.reviewWhen);
  for(const d of registry.documents){const source=read(d.path);for(const section of d.sections)assert.ok(source.includes(section),`${d.path}: ${section}`);assert.ok(fs.existsSync(new URL(d.test,root)));}
  const html=read('libro-cobria/index.html');assert.equal((html.match(/class="book-page documentation-workshop"/g)||[]).length,1);
  for(const field of ['command','installCommand','testCommand'])assert.ok(html.includes(w[field]));
  for(const file of ['sitio/app/documentation-workshop.tsx','libro-cobria/build-book.mjs'])assert.match(read(file),/c9\/workshop.json/);
  assert.match(w.limits,/no implementan automáticamente reglas/);assert.match(w.limits,/no eliminan carreras/);
  const codes=JSON.parse(read('specification/phase-12/ERROR-CODES.json')).codes;
  for(const code of ['CLI_OPTION_VALUE_REQUIRED','CLI_OPTION_DUPLICATED','CLI_DESTINATION_UNSAFE','CLI_OUTPUT_CONFLICT'])assert.ok(codes.some(c=>c.code===code));
});
