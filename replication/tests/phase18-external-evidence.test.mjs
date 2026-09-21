import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateExternalStatus, validateReviewRecord } from '../src/external-evidence.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

test('el estado honesto de fase 18 conserva hitos externos pendientes', async () => {
  const status = JSON.parse(await fs.readFile(path.join(root, 'specification/phase-18/status.json'), 'utf8'));
  assert.equal(validateExternalStatus(status).valid, true);
  assert.equal(status.state, 'prepared-not-externally-validated');
});

test('rechaza una revisión externa marcada como ejecutada sin evidencia humana', () => {
  const status = { milestones: [{ id: 'P18-REVIEW', status: 'executed', evidence: [] }] };
  const result = validateExternalStatus(status);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.code === 'P18_EXTERNAL_EVIDENCE_REQUIRED'));
  assert.ok(result.errors.some((error) => error.code === 'P18_EXTERNAL_ATTESTATION_REQUIRED'));
});

test('un informe de revisión exige identidad seudónima, conflicto, hallazgos y decisión', () => {
  assert.equal(validateReviewRecord({ reviewerCode: 'R01' }).valid, false);
  assert.equal(validateReviewRecord({ reviewerCode: 'R01', date: '2026-09-20', version: 'abcdef1', conflictStatement: 'Sin conflicto declarado.', findings: [{ severity: 'major' }], recommendation: 'major-revision' }).valid, true);
});
