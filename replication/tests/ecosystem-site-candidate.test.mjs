import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../../',import.meta.url);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,root)));

test('QA declara umbrales antes del resultado y no autoriza publicación',()=>{
  const policy=read('editorial/ecosistema-15-16/qa-policy.json');
  assert.equal(policy.maximumAxeViolations,0);
  assert.deepEqual(policy.widths,[390,1440]);
  assert.equal(policy.publicationAuthorized,false);
  assert.ok(policy.routes.includes('/recursos'));
  assert.ok(policy.lighthouse.minimum.accessibility>=.95);
});
test('las entradas por nivel y problema usan rutas canónicas locales',()=>{
  const entries=read('editorial/ecosistema-15-16/entry-points.json');
  const curriculum=read('editorial/curriculum.json');
  const routes=new Set(['/comenzar',...curriculum.modules.map(m=>m.route)]);
  for(const item of [...entries.levels,...entries.problems]){assert.ok(item.title&&item.description);assert.ok(routes.has(item.href),item.href);}
});
