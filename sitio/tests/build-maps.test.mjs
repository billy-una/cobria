import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeMap } from '../scripts/normalize-build-maps.mjs';

test('la ruta del clon no altera el nombre generado del mapa', () => {
  const base = {version: 3, sources: ['app.tsx'], sourcesContent: ['render()'], mappings: 'AAAA', names: []};
  const a = {...base, names: ['__vite_rsc_importer_resources_6663048de9cf.Resources', 'render']};
  const b = {...base, names: ['__vite_rsc_importer_resources_09ec486735cf.Resources', 'render']};
  assert.deepEqual(normalizeMap(a), normalizeMap(b));
  assert.deepEqual(a.names, ['__vite_rsc_importer_resources_6663048de9cf.Resources', 'render']);
  assert.equal(normalizeMap(a).mappings, a.mappings);
  assert.deepEqual(normalizeMap(a).sourcesContent, a.sourcesContent);
  assert.deepEqual(normalizeMap(normalizeMap(a)), normalizeMap(a));
});

test('no normaliza nombres de aplicación ni otros sufijos', () => {
  const map = {version: 3, names: ['reserva', '__vite_rsc_importer_resources_6663048de9cf.Other']};
  assert.deepEqual(normalizeMap(map), map);
  assert.throws(() => normalizeMap({version: 2, names: []}), /no compatible/);
});
