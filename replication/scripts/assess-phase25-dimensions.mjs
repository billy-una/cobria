#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path'; import {assessDimensions} from '../src/dimensional-evidence.mjs';
const args=process.argv.slice(2); const value=flag=>args[args.indexOf(flag)+1];
const project=path.resolve(value('--project')??''); const profilePath=path.resolve(value('--profile')??''); const output=path.resolve(value('--output')??'phase25-result.json');
const result=assessDimensions({repository:project,profile:JSON.parse(fs.readFileSync(profilePath,'utf8'))});
fs.mkdirSync(path.dirname(output),{recursive:true}); fs.writeFileSync(output,`${JSON.stringify(result,null,2)}\n`); console.log(`${result.contract}: ${result.summary.satisfied}/${result.summary.required} dimensiones; ${result.summary.strictStatus}.`);
