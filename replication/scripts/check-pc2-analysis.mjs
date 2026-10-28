import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root=new URL('../../',import.meta.url),target=new URL('replication/protocol/pc2-analysis-freeze-01.json',root);
const files=['replication/protocol/pc2-analysis-01.json','replication/src/pc2/sign-test.mjs','replication/scripts/check-pc2-analysis.mjs','replication/tests/pc2-analysis.test.mjs'];
if(process.argv.length!==3||!['--freeze','--check'].includes(process.argv[2]))throw new Error('Use --freeze o --check');
execFileSync(process.execPath,['replication/scripts/freeze-pc2.mjs','--check'],{cwd:root});
const hashes=Object.fromEntries(await Promise.all(files.map(async p=>[p,createHash('sha256').update(await fs.readFile(new URL(p,root))).digest('hex')])));
if(process.argv[2]==='--freeze'){
  await fs.writeFile(target,JSON.stringify({id:'COBRIA-PC2-analisis-01',frozenAt:new Date().toISOString(),scope:'adenda-local-antes-de-PC3',files:hashes},null,2)+'\n',{flag:'wx'});
  console.log('Adenda estadística congelada; el protocolo inicial se conserva.');
}else{
  const record=JSON.parse(await fs.readFile(target,'utf8'));
  if(record.id!=='COBRIA-PC2-analisis-01'||record.scope!=='adenda-local-antes-de-PC3'||JSON.stringify(Object.keys(record.files).sort())!==JSON.stringify([...files].sort()))throw new Error('Adenda de congelamiento inválida');
  for(const p of files)if(hashes[p]!==record.files[p])throw new Error(`Adenda alterada: ${p}`);
  console.log(JSON.stringify({id:record.id,filesChecked:files.length,scope:record.scope,frozenAt:record.frozenAt}));
}
