#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { blankOperationalRun } from '../src/operational-validation.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const plan = JSON.parse(fs.readFileSync(path.join(root, 'specification/phase-31/operational-plan.json'), 'utf8'));
const output = path.join(root, 'specification/phase-31/operational-run-template.json');
fs.writeFileSync(output, `${JSON.stringify(blankOperationalRun(plan), null, 2)}\n`);
console.log('Plantilla operacional generada: 5 escenarios, 0 ejecutados y 0 certificaciones.');
