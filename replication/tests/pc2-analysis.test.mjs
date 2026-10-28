import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {signTest} from '../src/pc2/sign-test.mjs';

test('PC2 análisis exacto tiene valores conocidos sin exigir simetría de magnitudes',()=>{
  assert.equal(signTest([-1,-2,-300]).p,.25);
  assert.equal(signTest([0,-1,-2,-300]).p,.25);
  assert.equal(signTest([-1,1]).p,1);assert.equal(signTest([0,0]).p,1);
  assert.equal(signTest(Array(30).fill(-1)).p,2/2**30);
  assert.throws(()=>signTest([Infinity]),/INVALID/);
});

test('PC2 adenda verifica sin reemplazar el congelamiento inicial',()=>{
  const report=JSON.parse(execFileSync(process.execPath,['replication/scripts/check-pc2-analysis.mjs','--check'],{cwd:new URL('../../',import.meta.url),encoding:'utf8'}));
  assert.equal(report.filesChecked,4);assert.equal(report.scope,'adenda-local-antes-de-PC3');
});
