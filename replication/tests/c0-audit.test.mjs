import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAudit, renderAudit } from '../../editorial/audit-c0.mjs';
import {createBaselineReader,verifyFrozenInputs} from '../../editorial/c0-inputs.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const review = JSON.parse(fs.readFileSync(new URL('../../editorial/c0/review.json', import.meta.url)));
const probes = JSON.parse(fs.readFileSync(new URL('../../editorial/c0/probes.json', import.meta.url)));
const read=createBaselineReader(root);
const baseline = buildAudit(review, read, probes);

test('EP10 las entradas históricas permiten reconstruir C0 sin historia Git',()=>{
  const saved=JSON.parse(fs.readFileSync(new URL('../../editorial/c0/coverage.json',import.meta.url)));
  const frozen=JSON.parse(fs.readFileSync(new URL('../../editorial/c0/frozen-inputs.json',import.meta.url)));
  const inputs=verifyFrozenInputs(review,saved,frozen);
  assert.deepEqual(buildAudit(review,name=>inputs.get(name)??null,probes),saved);
  frozen.files.find(x=>x.content!==null).content+=' ALTERADO';
  assert.throws(()=>verifyFrozenInputs(review,saved,frozen),/BYTES_DIVERGED/);
});

test('EP10 una distribución sin Git conserva rutas con corchetes literalmente',()=>{
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'cobria-c0-portable-'));
  try{
    const target=path.join(temporary,'editorial/c0');fs.mkdirSync(target,{recursive:true});
    for(const file of ['review.json','coverage.json','frozen-inputs.json'])fs.copyFileSync(path.join(root,'editorial/c0',file),path.join(target,file));
    const readFrozen=createBaselineReader(temporary);
    assert.ok(readFrozen('sitio/app/aprender/[modulo]/[leccion]/page.tsx').includes('Fuentes del módulo'));
    assert.deepEqual(buildAudit(review,readFrozen,probes),baseline);
  }finally{fs.rmSync(temporary,{recursive:true,force:true});}
});

test('C0 registra las 17 áreas sin convertir presencia en completitud', () => {
  assert.equal(baseline.totals.areas, 17);
  assert.equal(baseline.totals.lessons, 85);
  assert.equal(baseline.totals.labs, 30);
  assert.equal(baseline.totals.areasClosed, 0);
  assert.equal(baseline.totals.humanReaderValidationsEstablished, 0);
  assert.ok(baseline.areas.every(area => area.closure === 'parcial'));
});

test('las dos fuentes ausentes siguen visibles y no se reemplazan por suposiciones', () => {
  assert.deepEqual(baseline.sourceInventory.filter(x=>!x.existsAtBaseline).map(x=>x.path).sort(), [
    'specification/phase-3/data-dictionary.json', 'specification/phase-6/code-conventions.json']);
  assert.ok(baseline.areas.flatMap(area=>area.lessons).every(lesson=>!lesson.executionContractPerLesson && !lesson.testBindingPerLesson));
});

test('la ausencia de un anclaje del libro cambia la cobertura', () => {
  const audit = buildAudit(review, name => name === 'libro-cobria/index.html'
    ? read(name).replace('id="leccion-01-1"', 'id="eliminado"') : read(name), probes);
  assert.equal(audit.areas[0].coverage.libro, 'anclajes_incompletos');
});

test('una ruta web ausente no queda marcada como presente', () => {
  const audit = buildAudit(review, name => name === 'sitio/public/sitemap.xml'
    ? read(name).replace('/aprender/inicio/1</loc>', '/eliminado</loc>') : read(name), probes);
  assert.equal(audit.areas[0].coverage.web, 'fuente_o_rutas_incompletas');
});

test('C0 no acepta promover una lectura no realizada ni cerrar un área por conteo', () => {
  const changed = structuredClone(review);
  changed.areas[0].readerValidation = 'validado';
  assert.throws(()=>buildAudit(changed, read, probes), /No se puede inferir/);
  changed.areas[0].readerValidation = review.areas[0].readerValidation;
  changed.areas[0].closure = 'completo';
  assert.throws(()=>buildAudit(changed, read, probes), /No se puede inferir/);
});

test('los hallazgos y sondas deben corresponder a fuentes y commit reales', () => {
  const changed = structuredClone(review);
  changed.findings[0].evidence[0].needle = 'evidencia inventada que no existe';
  assert.throws(()=>buildAudit(changed, read, probes), /Evidencia no encontrada/);
  assert.throws(()=>buildAudit(review, read, {...probes, baselineCommit:'0'.repeat(40)}), /línea base/);
});

test('la sonda crítica registra cuatro archivos temporales sin mutar las fuentes', () => {
  const probe = probes.probes.find(item=>item.id === 'simular-genera');
  assert.equal(probe.createdCount, 4);
  assert.equal(probe.actualFilesPresent, true);
  assert.equal(probes.scope.projectSourceMutated, false);
  assert.equal(probes.scope.scientificResultsMutated, false);
  assert.equal(baseline.totals.critical, 1);
});

test('la representación humana y JSON se derivan de la misma línea base', () => {
  const saved = JSON.parse(fs.readFileSync(new URL('../../editorial/c0/coverage.json', import.meta.url)));
  assert.deepEqual(saved, baseline);
  assert.equal(fs.readFileSync(new URL('../../editorial/c0/AUDITORIA-C0.md', import.meta.url),'utf8'), renderAudit(baseline));
});
