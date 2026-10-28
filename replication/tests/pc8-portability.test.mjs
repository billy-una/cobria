import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
const root=new URL('../../',import.meta.url);
test('PC8 exportador y talleres no dependen de rutas personales',()=>{
  for(const file of ['libro-cobria/export-pdf.mjs','replication/examples/api-ux-c5/verificar-interfaz.mjs','replication/examples/integral-c8/verificar-interfaz.mjs'])
    assert.doesNotMatch(fs.readFileSync(new URL(file,root),'utf8'),/\/Users\/|\/Volumes\/|codex-runtimes|\/Applications\//);
});
test('PC8 CI pública no requiere secretos y referencias congeladas son optativas',()=>{
  const workflow=fs.readFileSync(new URL('.github/workflows/ci.yml',root),'utf8');
  const publicJob=workflow.split('  public-build:')[1].split('  publication-candidate:')[0];
  assert.ok(publicJob.includes('make construir-publico'));assert.doesNotMatch(publicJob,/secrets\.|REFERENCE_TOKEN|repository: billy-una/);
  assert.ok(workflow.includes("github.event_name == 'workflow_dispatch' && inputs.verify_references"));
  for(const name of ['posguapiles','crmhotel','bshandball']){
    const manifest=JSON.parse(fs.readFileSync(new URL(`specification/phase-23/adoption-manifest.${name}.json`,root)));
    assert.ok(workflow.includes(`ref: ${manifest.project.expectedCommit}`));
  }
});
