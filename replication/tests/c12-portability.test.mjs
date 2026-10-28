import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { loadBrowserRuntime } from '../scripts/browser-runtime.mjs';

test('C12 resuelve Playwright desde la instalación declarada o explica cómo instalar', () => {
  let runtime;
  try { runtime = loadBrowserRuntime(); }
  catch (error) { assert.match(error.message, /npm ci --prefix libro-cobria/); return; }
  assert.equal(typeof runtime.chromium.launch, 'function');
});

test('C12 separa CI pública sin secretos de validación con referencias', async () => {
  const source = await fs.readFile(new URL('../../.github/workflows/portable.yml', import.meta.url), 'utf8');
  assert.match(source, /node: \[22, 24\]/);
  assert.match(source, /npm ci --prefix replication/);
  assert.doesNotMatch(source, /secrets\./);
  assert.match(source, /persist-credentials: false/);
});

test('C12 revisores de navegador no dependen de rutas personales', async () => {
  for (const name of ['review-site-c10.mjs', 'review-reader-c10.mjs', 'browser-runtime.mjs']) {
    const source = await fs.readFile(new URL(`../scripts/${name}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /\/Users\/|\/Volumes\//);
  }
});
