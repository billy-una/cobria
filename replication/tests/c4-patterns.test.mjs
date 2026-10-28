import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { decisiones } from '../../editorial/pattern-decisions.mjs';

const root = new URL('../../', import.meta.url);
const read = relative => fs.readFileSync(new URL(relative, root), 'utf8');
const catalog = JSON.parse(read('editorial/generated/pattern-catalog.json'));
const cases = JSON.parse(read('replication/examples/patterns-r4/cases.json'));

test('C4 conserva treinta decisiones específicas y casos enlazados', () => {
  assert.equal(decisiones.length, 30);
  assert.equal(new Set(decisiones.map(item => item.id)).size, 30);
  assert.equal(new Set(decisiones.map(item => item.limite)).size, 30);
  for (const item of catalog.items) {
    const caso = cases.find(entry => entry.id === item.id);
    assert.deepEqual(item.decision, decisiones.find(entry => entry.id === item.id));
    for (const field of ['alternativa', 'criterio', 'limite']) assert.ok(item.decision[field].trim().length > 0, `${item.slug}: ${field}`);
    assert.deepEqual(item.ejemplo.pruebaPositiva.entrada, caso.valid);
    assert.deepEqual(item.ejemplo.pruebaNegativa.entrada, caso.invalid);
    assert.match(item.autoridad, /no es una declaración de conformidad/);
    assert.ok(item.ejemplo.costo && item.cuandoEvitar);
  }
});

test('C4 publica entradas, alternativas y límites en las treinta fichas estáticas', () => {
  for (const item of catalog.items) {
    const html = read(`sitio/public/patrones/${item.slug}/index.html`);
    for (const heading of ['Entrada conforme y resultado esperado', 'Entrada adversa y rechazo o abstención esperados', 'Alternativa más sencilla', 'Cuándo no usarlo', 'Límite de esta demostración']) assert.ok(html.includes(heading), `${item.slug}: ${heading}`);
    assert.ok(html.includes('patterns-r4'));
  }
});

test('C4 no confunde precondiciones simuladas con garantías del motor', () => {
  assert.match(decisiones.find(item => item.id === 12).limite, /no una transacción/);
  assert.match(decisiones.find(item => item.id === 3).limite, /no autentica/);
  assert.match(decisiones.find(item => item.id === 10).limite, /concurrente/);
});

test('C4 refleja las treinta decisiones en las prácticas del libro', () => {
  const html = read('libro-cobria/index.html');
  assert.equal((html.match(/<h2>Alternativa más sencilla<\/h2>/g) || []).length, 30);
  assert.equal((html.match(/No acredita conformidad Core\./g) || []).length, 30);
  for (const decision of decisiones) {
    assert.ok(html.includes(decision.limite), `Libro: límite ${decision.id}`);
    assert.ok(html.includes(decision.alternativa), `Libro: alternativa ${decision.id}`);
  }
});
