import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('los comandos Node declarados conservan sus archivos de entrada', () => {
  for (const [name, command] of Object.entries(pkg.scripts)) {
    for (const match of command.matchAll(/\bnode\s+(?:--[\w-]+\s+)*([\w./-]+\.mjs)\b/g)) {
      assert.ok(fs.statSync(path.join(root, match[1]), { throwIfNoEntry: false })?.isFile(),
        `${name}: no existe ${match[1]}`);
    }
  }
});

test('los experimentos en memoria usan el modelo histórico y sus entradas existen', () => {
  for (const filename of ['run-experiments.mjs', 'run-ai-evaluation.mjs']) {
    const source = fs.readFileSync(path.join(root, 'scripts', filename), 'utf8');
    assert.ok(source.includes('../historical/memory-model/cobria.mjs'));
    assert.ok(!source.includes('../src/cobria.mjs'));
    for (const match of source.matchAll(/from\s+["'](\.[^"']+)["']/g)) {
      assert.ok(fs.existsSync(path.resolve(root, 'scripts', match[1])),
        `${filename}: import ausente ${match[1]}`);
    }
  }
  assert.ok(fs.existsSync(path.join(root, 'protocol', 'frozen-config.json')));
});
