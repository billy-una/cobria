import fs from 'node:fs';
import path from 'node:path';
import { buildEngineeringEvidenceDossier } from '../src/engineering-evidence-dossier.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const rubric = read('specification/phase-26/engineering-dimensional-rubric.json');
const projects = [
  ['posguapiles', 'specification/phase-23/report.posguapiles.json'],
  ['crmhotel', 'specification/phase-23/report.crmhotel.json'],
  ['bshandball', 'specification/phase-23/report.bshandball.json']
].map(([id, file]) => ({ id, report: read(file) }));
const dossier = buildEngineeringEvidenceDossier(rubric, projects);
const output = path.join(root, 'specification/phase-27/evidence-dossier.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(dossier, null, 2)}\n`);
console.log(`Expediente generado: ${dossier.summary.decisions} decisiones pendientes en ${dossier.summary.projects} proyectos.`);
