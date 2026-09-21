#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { awaitingDimensionalAdjudication, buildDimensionalAdjudicationForm, finalizeDimensionalAdjudication } from '../src/dimensional-adjudication.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const base = path.join(root, 'specification/phase-30');
const agreement = JSON.parse(fs.readFileSync(path.join(root, 'specification/phase-29/intake-report.json'), 'utf8'));
const response = path.join(base, 'adjudication-response.json');
let report;
if (agreement.status !== 'proposal-review-pair-processed') {
  report = awaitingDimensionalAdjudication(agreement);
} else if (!agreement.disagreements.length) {
  report = { ...buildDimensionalAdjudicationForm(agreement), status: 'no-adjudication-required', adjudicationsCompleted: 0 };
} else if (!fs.existsSync(response)) {
  report = buildDimensionalAdjudicationForm(agreement);
} else {
  report = finalizeDimensionalAdjudication(agreement, JSON.parse(fs.readFileSync(response, 'utf8')));
}
fs.writeFileSync(path.join(base, 'adjudication-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(report.status === 'prepared-awaiting-review-pair'
  ? 'Fase 30 preparada: sin par humano válido; 0 desacuerdos adjudicados.'
  : `Fase 30: ${report.status}, ${report.items?.length ?? 0} elementos.`);
