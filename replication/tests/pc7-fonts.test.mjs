import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
const root=path.resolve(import.meta.dirname,'../..');
test('PC7 fuentes y licencias locales coinciden en libro y web',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'editorial/fonts.json')));
  assert.equal(manifest.license,'OFL-1.1');assert.equal(manifest.files.length,4);
  const derived=JSON.parse(fs.readFileSync(path.join(root,'editorial/fonts-static.json')));
  assert.equal(derived.files.length,6);
  for(const item of [...manifest.files,...derived.files])for(const directory of ['libro-cobria/fonts','sitio/public/fonts']){
    const data=fs.readFileSync(path.join(root,directory,item.file));
    assert.equal(data.length,item.bytes);assert.equal(createHash('sha256').update(data).digest('hex'),item.sha256);
  }
  assert.doesNotMatch(fs.readFileSync(path.join(root,'sitio/app/layout.tsx'),'utf8'),/next\/font\/google/);
});
