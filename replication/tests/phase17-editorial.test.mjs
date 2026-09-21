import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = async (relative) => JSON.parse(await fs.readFile(path.join(root, relative), 'utf8'));

test('la identidad editorial tiene una sola versión y diecisiete partes', async () => {
  const canonical = await readJson('editorial/canonical.json');
  assert.equal(canonical.identity.coreVersion, '1.0');
  assert.equal(canonical.ecosystem.moduleCount, canonical.ecosystem.modules.length);
  assert.equal(canonical.ecosystem.moduleCount, 17);
});

test('la afirmación de 630 observaciones coincide con evidencia ejecutada', async () => {
  const canonical = await readJson('editorial/canonical.json');
  const evidence = await readJson('replication/results/core-1.3-alternatives/summary.json');
  const claim = canonical.claims.find((item) => item.id === 'CLAIM-ALT-630');
  assert.equal(claim.status, 'ejecutado');
  assert.equal(claim.value, evidence.rawCount);
});

test('cada producto declara fuente, autoridad y salida', async () => {
  const registry = await readJson('editorial/products.json');
  assert.deepEqual(registry.products.map((item) => item.id), ['specification', 'article', 'master', 'book', 'workbook', 'technical-annex', 'site', 'toolkit', 'evidence']);
  for (const product of registry.products) {
    assert.ok(product.authority);
    assert.ok(product.source);
    assert.ok(product.output);
  }
});
