#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildAgentContext } from '../src/agent-context.mjs';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const value = (name, fallback) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : fallback; };
const task = value('--tarea', 'specification/phase-16/tasks/CHANGE-001.json');
const output = path.resolve(repository, value('--salida', 'replication/results/agent-context.json'));
const context = await buildAgentContext(repository, task);
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, `${JSON.stringify(context, null, 2)}\n`);
console.log(`Contexto de agente generado: ${output}`);
