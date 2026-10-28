import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'../..');
test('EP1 alias tesis apunta al maestro, nunca al archivo histórico',()=>{
  const policy=JSON.parse(fs.readFileSync(path.join(root,'sitio/worker/routing-policy.json')));
  assert.equal(policy.redirects['/downloads/COBRIA-tesis.pdf'],'/downloads/COBRIA-documento-maestro.pdf');
  assert.ok(!policy.assetPrefixes.includes('/'));
  assert.ok(!policy.assetPaths.includes('/index.html'));
  assert.ok(policy.assetPrefixes.includes('/downloads/'));
});
test('EP1 el generador rechaza una portada heredada sin eliminarla',t=>{
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'cobria-ep1-guard-'));
  t.after(()=>fs.rmSync(temporary,{recursive:true}));
  for(const directory of ['sitio/scripts','sitio/public','editorial'])fs.mkdirSync(path.join(temporary,directory),{recursive:true});
  for(const relative of ['sitio/scripts/generate-search-pages.mjs','sitio/public/catalogo.json',
    'sitio/public/cobria-canonical.json','sitio/public/pattern-catalog.json','editorial/curriculum.json'])
    fs.copyFileSync(path.join(root,relative),path.join(temporary,relative));
  const old=path.join(temporary,'sitio/public/index.html');fs.writeFileSync(old,'EVIDENCIA-HISTORICA-NO-BORRAR');
  const result=spawnSync(process.execPath,['sitio/scripts/generate-search-pages.mjs'],{cwd:temporary,encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/Rutas heredadas/);
  assert.equal(fs.readFileSync(old,'utf8'),'EVIDENCIA-HISTORICA-NO-BORRAR');
  assert.equal(fs.existsSync(path.join(temporary,'sitio/public/archivo')),false);
});
