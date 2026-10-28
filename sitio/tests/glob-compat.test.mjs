import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const glob = require('fast-glob');
const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'cobria-glob-fixture-'));
for (const name of ['pages/a.js', 'pages/b.ts', 'pages/a.test.js', 'pages/nido/c.js', 'pages/.hidden.js', 'pages/item/index.js']) {
  const target = path.join(cwd, name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, '// fixture sintética\n');
}

test('selecciona extensiones y rutas de importación dinámica', () => {
  assert.deepEqual(glob.sync(['./pages/*.{js,ts}', './pages/*/index.{js,ts}'], { cwd }),
    ['pages/a.js', 'pages/a.test.js', 'pages/b.ts', 'pages/item/index.js']);
});
test('globstar, exclusiones y deduplicación conservan el conjunto esperado', () => {
  assert.deepEqual(glob.sync(['pages/**/*.js', 'pages/a.js', '!**/*.test.js'], { cwd }),
    ['pages/a.js', 'pages/item/index.js', 'pages/nido/c.js']);
  assert.deepEqual(glob.sync('pages/*.js', { cwd, ignore: '**/*.test.js' }), ['pages/a.js']);
});
test('la búsqueda de raíces devuelve directorios y no expande su contenido', () => {
  assert.deepEqual(glob.globSync('pages/*', { cwd, onlyDirectories: true }), ['pages/item', 'pages/nido']);
  assert.deepEqual(glob.sync('pages', { cwd }), []);
  assert.deepEqual(glob.sync('pages', { cwd, onlyDirectories: true }), ['pages']);
});
test('dot y rutas absolutas solo se activan explícitamente', () => {
  assert.ok(!glob.sync('pages/*', { cwd }).some(value => value.includes('.hidden')));
  assert.ok(glob.sync('pages/*', { cwd, dot: true }).includes('pages/.hidden.js'));
  assert.deepEqual(glob.sync('pages/a.js', { cwd, absolute: true }), [path.join(cwd, 'pages/a.js')]);
});
test('la interfaz asíncrona y síncrona coinciden', async () => {
  assert.deepEqual(await glob('pages/**/*.js', { cwd }), glob.sync('pages/**/*.js', { cwd }));
});
test('rechaza opciones no soportadas en vez de ignorarlas', () => {
  assert.throws(() => glob.sync('*', { cwd, objectMode: true }), /GLOB_OPTIONS/);
  assert.throws(() => glob.sync('*', { cwd, onlyDirectories: 'sí' }), /GLOB_OPTIONS/);
  assert.throws(() => glob.sync('*', { cwd, deep: -1 }), /GLOB_OPTIONS/);
});
test('rechaza patrones vacíos, largos o demasiados antes de recorrer', async () => {
  for (const input of ['', [], Array(65).fill('*'), 'x'.repeat(2049), 'a\0b']) {
    assert.throws(() => glob.sync(input, { cwd }), /GLOB_LIMIT/);
  }
  await assert.rejects(glob('x'.repeat(2049), { cwd }), /GLOB_LIMIT/);
});
test('rechaza anidamiento hostil también en ignore', () => {
  const nested = '{'.repeat(17) + 'a,b' + '}'.repeat(17);
  assert.throws(() => glob.sync(nested, { cwd }), /GLOB_LIMIT/);
  assert.throws(() => glob.sync('*', { cwd, ignore: nested }), /GLOB_LIMIT/);
  assert.throws(() => glob.sync('(x', { cwd }), /GLOB_LIMIT/);
});
test('ESLint usa realmente el adaptador para resolver raíces', () => {
  const consumer = createRequire(require.resolve('@next/eslint-plugin-next'));
  assert.equal(consumer('fast-glob'), glob);
  const { getRootDirs } = consumer('./utils/get-root-dirs.js');
  assert.deepEqual(getRootDirs({ cwd, settings: { next: { rootDir: path.join(cwd, 'pages/*') } } }),
    [path.join(cwd, 'pages/item'), path.join(cwd, 'pages/nido')]);
});
test('acota expansiones combinatorias y no mezcla formas de rutas', () => {
  assert.throws(() => glob.sync('{a,b}'.repeat(9), { cwd }), /GLOB_LIMIT/);
  assert.throws(() => glob.sync(['pages/*', path.join(cwd, 'pages/*')], { cwd }), /GLOB_OPTIONS/);
});
test('el consumidor de imports dinámicos resuelve la misma implementación', () => {
  const consumer = createRequire(require.resolve('vite-plugin-dynamic-import'));
  assert.equal(consumer('fast-glob'), glob);
});
test('el lockfile no conserva la cadena vulnerable', async () => {
  const lock = JSON.parse(await fs.readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
  for (const name of Object.keys(lock.packages)) {
    assert.ok(!/(?:^|\/)node_modules\/(?:braces|micromatch)$/.test(name), name);
  }
  const adapter = lock.packages['vendor/glob-compat'] ?? lock.packages['node_modules/fast-glob'];
  assert.equal(adapter.version, '0.0.0-cobria.1');
});
test('el código y metadatos instalados coinciden con las fuentes de la sustitución', async () => {
  const directory = path.dirname(require.resolve('fast-glob'));
  for (const name of ['index.cjs', 'package.json']) {
    const installed = await fs.readFile(path.join(directory, name), 'utf8');
    const source = await fs.readFile(new URL(`../vendor/glob-compat/${name}`, import.meta.url), 'utf8');
    assert.equal(installed, source, name);
  }
});
