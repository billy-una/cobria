import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildEngineeringEvidenceDossier, validateEngineeringEvidenceDossier } from '../src/engineering-evidence-dossier.mjs';

const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const rubric = read('../specification/phase-26/engineering-dimensional-rubric.json');
const projects = ['posguapiles', 'crmhotel', 'bshandball'].map(id => ({ id, report: read(`../specification/phase-23/report.${id}.json`) }));

test('genera 72 decisiones dimensionales pendientes', () => {
  const dossier = buildEngineeringEvidenceDossier(rubric, projects);
  assert.deepEqual(dossier.summary, { projects: 3, contractsPerProject: 8, decisions: 72, pendingSemanticReview: 72, supported: 0, operationallyValidated: 0 });
  assert.equal(validateEngineeringEvidenceDossier(dossier).valid, true);
});

test('conserva commit, huella y procedencia sin resolver la semántica', () => {
  const dossier = buildEngineeringEvidenceDossier(rubric, projects);
  const first = dossier.assessments[0];
  assert.match(first.source.commit, /^[a-f0-9]{40}$/);
  assert.equal(first.contracts[0].dimensions[0].decision, 'pending-semantic-review');
  assert.match(first.contracts[0].dimensions[0].candidateEvidence[0].sha256, /^[a-f0-9]{64}$/);
});

test('rechaza convertir el expediente en certificación automática', () => {
  const dossier = buildEngineeringEvidenceDossier(rubric, projects);
  dossier.assessments[0].contracts[0].dimensions[0].decision = 'supported';
  dossier.summary.supported = 1;
  assert.equal(validateEngineeringEvidenceDossier(dossier).valid, false);
});
