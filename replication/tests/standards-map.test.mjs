import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const map = JSON.parse(fs.readFileSync(path.join(root, 'editorial/standards-map.json'), 'utf8'));
const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'editorial/curriculum.json'), 'utf8'));

test('el registro no declara certificación, cambio Core ni evaluación de cláusulas', () => {
  assert.equal(map.status, 'orientacion-tematica-no-conformidad');
  assert.equal(map.certified, false);
  assert.equal(map.coreChanged, false);
  assert.ok(map.accessBasis.includes('no revisión íntegra'));
  assert.ok(fs.existsSync(path.join(root, map.guide)));
  for (const row of map.references) {
    assert.equal(row.clauseMappingReviewed, false);
    assert.equal(row.status, 'seleccionada-para-adopcion-no-evaluada');
  }
});

test('las referencias tienen fuente oficial, responsabilidad temática y evidencia esperada', () => {
  assert.equal(map.references.length, 19);
  assert.equal(new Set(map.references.map(row => row.id)).size, 19);
  const modules = new Set(curriculum.modules.map(module => module.key));
  for (const row of map.references) {
    const url = new URL(row.url);
    assert.equal(url.protocol, 'https:');
    assert.ok(['www.iso.org', 'standards.ieee.org', 'www.w3.org', 'csrc.nist.gov'].includes(url.hostname));
    for (const field of ['reference', 'practice', 'evidence', 'limit', 'localSource']) assert.ok(row[field]);
    assert.ok(fs.existsSync(path.join(root, row.localSource)));
    assert.ok(row.modules.length);
    for (const key of row.modules) assert.ok(modules.has(key), key);
  }
});

test('producto, calidad en uso y evaluación no mezclan las ediciones de 2015', () => {
  for (const reference of ['ISO/IEC 25010:2023', 'ISO/IEC 25019:2023', 'ISO/IEC 25040:2024']) {
    assert.ok(map.references.some(row => row.reference === reference));
  }
  const guide = fs.readFileSync(path.join(root, map.guide), 'utf8');
  assert.match(guide, /no el texto de una norma ISO/);
  assert.match(guide, /umbrales son decisiones del ejemplo/);
  assert.match(guide, /La ausencia de evidencia no significa aprobado/);
});
