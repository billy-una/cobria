#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {assessAdoption} from '../src/engineering-adoption.mjs';

const args=process.argv.slice(2);
const value=flag=>args[args.indexOf(flag)+1];
const repository=path.resolve(value('--project')??'');
const manifestPath=path.resolve(value('--manifest')??'');
const output=path.resolve(value('--output')??'engineering-adoption-manifest-report.json');
if (!fs.existsSync(path.join(repository,'.git'))) throw new Error('El proyecto debe ser un checkout Git local.');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const report=assessAdoption({repository,manifest});
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,`${JSON.stringify(report,null,2)}\n`);
console.log(`Evaluación por manifiesto: ${report.summary.implementedLocal}/${report.summary.contracts} estructurales; ${report.summary.operationallyValidated} operacionales.`);
