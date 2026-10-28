import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../../',import.meta.url);
const read=file=>fs.readFileSync(new URL(file,root),'utf8');
test('C7 comparte recorrido, fronteras y evaluación sin afirmar entrenamiento',()=>{
  const w=JSON.parse(read('editorial/c7/workshop.json'));assert.equal(w.steps.length,5);assert.ok(fs.existsSync(new URL(w.guide,root)));
  const html=read('libro-cobria/index.html');assert.equal((html.match(/class="book-page analytics-workshop"/g)||[]).length,1);
  for(const field of ['command','testCommand','evaluateCommand'])assert.ok(html.includes(w[field]));
  for(const source of ['sitio/app/analytics-workshop.tsx','libro-cobria/build-book.mjs'])assert.match(read(source),/c7\/workshop.json/);
  assert.match(w.limits,/Sin entrenamiento/);assert.match(w.limits,/no representa consentimiento real/);
  const p=JSON.parse(read('replication/examples/analitica-c7/protocolo.json'));assert.equal(p.threshold,.5);assert.equal(p.featureVersion,'cantidad-v1');
});
