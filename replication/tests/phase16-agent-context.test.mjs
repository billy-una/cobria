import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAgentContext, validateChangePlan } from '../src/agent-context.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = async (file) => JSON.parse(await fs.readFile(path.join(root, file), 'utf8'));

test('construye contexto con tarea, política e instrucciones', async () => {
  const context = await buildAgentContext(root, 'specification/phase-16/tasks/CHANGE-001.json');
  assert.equal(context.task.id, 'CHANGE-001');
  assert.equal(context.policy.language, 'es');
  assert.ok(context.instructions.some((item) => item.file === 'AGENTS.md'));
});

test('acepta un plan acotado que conserva invariantes y pruebas', async () => {
  const result = validateChangePlan(await read('specification/phase-16/agent-policy.json'), await read('specification/phase-16/tasks/CHANGE-001.json'), await read('specification/phase-16/fixtures/valid-plan.json'));
  assert.equal(result.valid, true);
});

test('rechaza edición de norma congelada y resultados experimentales', async () => {
  const result = validateChangePlan(await read('specification/phase-16/agent-policy.json'), await read('specification/phase-16/tasks/CHANGE-001.json'), await read('specification/phase-16/fixtures/invalid-plan.json'));
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.code === 'AI_PROTECTED_PATH'));
  assert.ok(result.errors.some((error) => error.code === 'AI_INVARIANT_MISSING'));
  assert.ok(result.errors.some((error) => error.code === 'AI_TEST_MISSING'));
});
