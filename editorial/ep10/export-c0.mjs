// Exportación explícita desde Git; nunca sustituye bytes históricos por los actuales.
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {verifyFrozenInputs} from '../c0-inputs.mjs';
const root=new URL('../../',import.meta.url);
const read=name=>JSON.parse(fs.readFileSync(new URL(name,root)));
const review=read('editorial/c0/review.json'),coverage=read('editorial/c0/coverage.json');
const frozen={schemaVersion:'1.0.0',baselineCommit:review.baselineCommit,files:coverage.sourceInventory.map(row=>({path:row.path,content:row.existsAtBaseline?execFileSync('git',['show',`${review.baselineCommit}:${row.path}`],{cwd:root,encoding:'utf8',maxBuffer:16*1024**2}):null}))};
verifyFrozenInputs(review,coverage,frozen);
fs.writeFileSync(new URL('editorial/c0/frozen-inputs.json',root),JSON.stringify(frozen,null,2)+'\n',{flag:'wx'});
console.log(`C0: ${frozen.files.length} entradas históricas exportadas y verificadas; no se modifica su auditoría.`);
