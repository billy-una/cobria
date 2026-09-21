#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { buildDimensionalReviewForms, evidenceAlias, validateBlankDimensionalReviewForm } from '../src/dimensional-review.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const output = path.join(root, 'output/review/phase28');
const rubric = JSON.parse(fs.readFileSync(path.join(root, 'specification/phase-26/engineering-dimensional-rubric.json'), 'utf8'));
const sources = [
  { code: 'M-01', repo: path.resolve(root, '../POSGUAPILES-1'), manifest: 'posguapiles' },
  { code: 'M-02', repo: path.resolve(root, '../CRMHOTEL_NUEVO'), manifest: 'crmhotel' },
  { code: 'M-03', repo: path.resolve(root, '../BSHandball'), manifest: 'bshandball' }
];
const git = (repo, args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
const redact = content => content
  .replace(/https?:\/\/github\.com\/[^\s"')]+/gi, '[repositorio-redactado]')
  .replace(/pos\s*gu[aá]piles|posguapiles|crmhotel|bshandball/gi, '[muestra]');
const excerpt = (content, token) => {
  const normalized = redact(content).replace(/\s+/g, ' ').trim();
  const at = normalized.toLowerCase().indexOf(String(token ?? '').toLowerCase());
  const start = Math.max(0, at < 0 ? 0 : at - 220);
  return normalized.slice(start, start + 700);
};

fs.mkdirSync(output, { recursive: true });
const samples = sources.map(source => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, `specification/phase-23/adoption-manifest.${source.manifest}.json`), 'utf8'));
  const evidenceByContract = {};
  for (const contract of manifest.contracts) {
    evidenceByContract[contract.id] = contract.evidence.map((item, index) => {
      let content = '';
      try { content = git(source.repo, ['show', `${manifest.project.expectedCommit}:${item.path}`]); } catch {}
      return evidenceAlias(source.code, contract.id, index, excerpt(content, item.containsAll?.[0]));
    });
  }
  return { code: source.code, evidenceByContract };
});

const forms = buildDimensionalReviewForms({ rubric, samples });
const files = [];
for (const form of forms) {
  const validation = validateBlankDimensionalReviewForm(form);
  if (!validation.valid) throw new Error(validation.errors.join('; '));
  const filename = `FORMULARIO-${form.reviewer}.json`;
  const serialized = `${JSON.stringify(form, null, 2)}\n`;
  fs.writeFileSync(path.join(output, filename), serialized);
  files.push({ file: filename, sha256: crypto.createHash('sha256').update(serialized).digest('hex') });
}
for (const name of ['INSTRUCCIONES.md', 'PROTOCOLO.md', 'review-response.schema.json']) {
  fs.copyFileSync(path.join(root, 'specification/phase-28', name), path.join(output, name));
}
const manifest = { schemaVersion: '1.0.0', phase: 28, state: 'prepared-not-reviewed', samples: 3, reviewersRequired: 2, judgmentsExpected: 144, judgmentsReceived: 0, identityKeyExcluded: true, officialCertification: false, files };
fs.writeFileSync(path.join(output, 'MANIFEST-SHA256.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('Paquete Fase 28 preparado: 2 formularios, 144 juicios vacíos y 0 certificaciones.');
