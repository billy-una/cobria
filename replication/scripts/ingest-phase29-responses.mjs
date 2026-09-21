#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { awaitingDimensionalAgreement, computeDimensionalAgreement } from '../src/dimensional-agreement.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const responseDir = path.join(root, 'specification/phase-29/responses');
const output = path.join(root, 'specification/phase-29/intake-report.json');
fs.mkdirSync(responseDir, { recursive: true });
const files = fs.readdirSync(responseDir).filter(name => name.endsWith('.json')).sort();
if (files.length > 2) throw new Error('se recibieron más de dos respuestas; el coordinador debe resolver la duplicación');
let report;
if (files.length < 2) {
  report = awaitingDimensionalAgreement(files.length);
} else {
  const forms = files.map(file => JSON.parse(fs.readFileSync(path.join(responseDir, file), 'utf8')));
  report = computeDimensionalAgreement(forms[0], forms[1]);
  report.sources = files;
}
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(files.length < 2
  ? `Fase 29 preparada: ${files.length}/2 respuestas recibidas; acuerdo no calculado.`
  : `Fase 29 procesada: ${report.pairedJudgments} pares, acuerdo ${report.observedAgreement.toFixed(3)}, kappa ${report.cohenKappa?.toFixed(3) ?? 'indefinido'}.`);
