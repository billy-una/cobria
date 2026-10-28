import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../../', import.meta.url);
const read = relative => fs.readFileSync(new URL(relative, root), 'utf8');

test('el registro RC2 no se confunde con validación humana, pública o externa', () => {
  const receipt = JSON.parse(read('review/RC2-LOCAL-2026-10-17.json'));
  assert.equal(receipt.kind, 'automatic-local-verification-not-independent-review');
  assert.equal(receipt.builds, 2);
  assert.equal(receipt.decision, 'pass');
  for (const flag of ['published', 'remoteCiVerified', 'externalReplicationVerified', 'humanReviewVerifiedByThisReceipt']) {
    assert.equal(receipt[flag], false, flag);
  }
  assert.equal(receipt.referenceInputs.publicStandaloneReproduction, false);
  assert.equal(receipt.referenceInputs.includedInArchive, false);
  assert.match(receipt.candidateCommit, /^[a-f0-9]{40}$/);
  assert.match(receipt.archive.sha256, /^[a-f0-9]{64}$/);
  assert.ok(receipt.archive.bytes > 0);
  assert.ok(!receipt.archive.path.includes('..'));
});

test('CI prepara las referencias fuera del checkout y no persiste sus credenciales', () => {
  const workflow = read('.github/workflows/ci.yml');
  const candidate = workflow.split('  publication-candidate:')[1].split('  package-integrity:')[0];
  assert.ok(candidate.includes('working-directory: cobria'));
  assert.ok(candidate.includes('path: cobria'));
  assert.equal((candidate.match(/persist-credentials: false/g) ?? []).length, 4);
  const names = {posguapiles: 'POSGUAPILES-1', crmhotel: 'CRMHOTEL_NUEVO', bshandball: 'BSHandball'};
  for (const [project, directory] of Object.entries(names)) {
    const manifest = JSON.parse(read(`specification/phase-23/adoption-manifest.${project}.json`));
    const repository = manifest.project.repository.replace('https://github.com/', '').replace(/\.git$/, '');
    assert.ok(candidate.includes(`repository: ${repository}`));
    assert.ok(candidate.includes(`path: references/${directory}`));
  }
  assert.equal((candidate.match(/fetch-depth: 0/g) ?? []).length, 4);
  assert.ok(candidate.includes('--reference-root "$GITHUB_WORKSPACE/references"'));
  assert.ok(candidate.includes('cobria/output/release/ecosistema-1.0.0-rc2/**'));
  assert.ok(!candidate.includes('continue-on-error'));
  assert.ok(!candidate.includes('echo "$REFERENCE_TOKEN"'));
});

test('el control de credenciales falla antes de descargar referencias', () => {
  const workflow = read('.github/workflows/ci.yml');
  const check = workflow.indexOf('if [ -z "$REFERENCE_TOKEN" ]');
  const firstReference = workflow.indexOf('repository: billy-una/posguapiles');
  assert.ok(check > 0 && check < firstReference);
  assert.ok(workflow.slice(check, firstReference).includes('exit 1'));
});

test('la preparación de publicación conserva la identidad exacta de la candidata', () => {
  const receipt = JSON.parse(read('review/RC2-LOCAL-2026-10-17.json'));
  const readiness = read('PUBLICATION-READINESS-1.0.0.md');
  assert.ok(readiness.includes(receipt.candidateCommit));
  assert.ok(readiness.includes(receipt.archive.sha256));
  assert.ok(readiness.includes('ecosistema-1.0.0-rc2'));
  assert.ok(!readiness.includes('**Candidata:** `ecosistema-1.0.0-rc1`'));
  assert.ok(fs.existsSync(fileURLToPath(new URL('replication/scripts/record-rc2-verification.py', root))));
});
