import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {buildEp4,ep4Html} from '../../editorial/ep4/build.mjs';
test('EP4 comparte guía y código real entre libro y sitio',()=>{
  const data=buildEp4();
  assert.equal(data.sections.length,5);
  assert.equal(data.sourceSha256,createHash('sha256').update(fs.readFileSync(new URL('../examples/integral-c8/recorrido-ep4.mjs',import.meta.url))).digest('hex'));
  assert.match(ep4Html(data),/Ejercicio y solución verificable/);
  assert.match(ep4Html(data),/DEMO no autentican/);
  assert.ok(data.sections.some(s=>s.blocks.some(b=>b.kind==='table')));
  const page=fs.readFileSync(new URL('../../sitio/app/comenzar/proyecto-integral/page.tsx',import.meta.url),'utf8');
  assert.match(page,/editorial\/ep4\/recorrido.json/);
  assert.match(page,/CopyCode/);
});
