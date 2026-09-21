import fs from 'node:fs/promises';
import path from 'node:path';

const inside = (file, directory) => file === directory || file.startsWith(`${directory}/`);

export function validateChangePlan(policy, task, plan) {
  const errors = [];
  for (const field of policy.changeContract) {
    if (plan[field] === undefined || plan[field] === '' || (Array.isArray(plan[field]) && field !== 'humanPending' && plan[field].length === 0)) errors.push({ code: 'AI_PLAN_FIELD_REQUIRED', field });
  }
  for (const file of plan.files ?? []) {
    if (!(task.allowedPaths ?? []).some((allowed) => inside(file, allowed))) errors.push({ code: 'AI_FILE_OUT_OF_SCOPE', file });
    if ((task.forbiddenPaths ?? []).some((forbidden) => inside(file, forbidden))) errors.push({ code: 'AI_PROTECTED_PATH', file });
    for (const protectedItem of policy.protectedPaths) if (inside(file, protectedItem.path)) errors.push({ code: 'AI_PROTECTED_PATH', file, reason: protectedItem.reason });
  }
  for (const invariant of task.requiredInvariants ?? []) if (!(plan.invariants ?? []).includes(invariant)) errors.push({ code: 'AI_INVARIANT_MISSING', invariant });
  for (const command of task.requiredTests ?? []) if (!(plan.tests ?? []).includes(command)) errors.push({ code: 'AI_TEST_MISSING', command });
  if (plan.authority !== task.authority) errors.push({ code: 'AI_AUTHORITY_MISMATCH', expected: task.authority });
  return { valid: errors.length === 0, errors };
}

export async function buildAgentContext(rootValue, taskValue) {
  const root = path.resolve(rootValue);
  const policyPath = path.join(root, 'specification/phase-16/agent-policy.json');
  const policy = JSON.parse(await fs.readFile(policyPath, 'utf8'));
  const task = JSON.parse(await fs.readFile(path.resolve(root, taskValue), 'utf8'));
  const instructionFiles = ['AGENTS.md', 'specification/AGENTS.md', 'replication/AGENTS.md'];
  const instructions = [];
  for (const file of instructionFiles) {
    try { instructions.push({ file, content: await fs.readFile(path.join(root, file), 'utf8') }); } catch {}
  }
  return { schemaVersion: '1.0.0', generatedAt: new Date().toISOString(), task, policy, instructions, recommendedChecks: task.requiredTests };
}
