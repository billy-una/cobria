#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path'; import {blankAssessment} from '../src/engineering-rubric.mjs';
const root=path.resolve(import.meta.dirname,'../..'); const args=process.argv.slice(2); const value=flag=>args[args.indexOf(flag)+1];
const rubric=JSON.parse(fs.readFileSync(path.join(root,'specification/phase-26/engineering-dimensional-rubric.json'),'utf8'));
const output=path.resolve(value('--output')??path.join(root,'specification/phase-26/assessment-template.json'));
fs.writeFileSync(output,`${JSON.stringify(blankAssessment(rubric,value('--subject')??'muestra'),null,2)}\n`); console.log('Plantilla dimensional generada: 8 contratos, 24 dimensiones, 0 decisiones precargadas.');
