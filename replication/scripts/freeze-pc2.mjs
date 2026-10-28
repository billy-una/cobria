import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root=new URL('../../',import.meta.url);
const target=new URL('replication/protocol/pc2-freeze-v1.json',root);
const files=[
  'replication/protocol/pc2-contracts-v1.json',
  'replication/protocol/PC2-CONTRATOS-V1.md',
  'replication/src/pc2/contracts.mjs',
  'replication/tests/pc2-contracts.test.mjs',
  'replication/tests/pc2-freeze.test.mjs',
  'replication/scripts/freeze-pc2.mjs',
  'replication/package-lock.json',
  'specification/COBRIA-CORE-1.0.md'
];
const sha=async file=>createHash('sha256').update(await fs.readFile(new URL(file,root))).digest('hex');
const current=Object.fromEntries(await Promise.all(files.map(async file=>[file,await sha(file)])));
if(process.argv.length!==3||!['--freeze','--check'].includes(process.argv[2]))throw new Error('Use --freeze o --check');
if(process.argv[2]==='--freeze'){
  const record={protocol:'COBRIA-PC2-contratos-v1',frozenAt:new Date().toISOString(),
    sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
    workingTreeClean:execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim()==='',
    scope:'congelamiento-local-sin-corridas-PC3',independentRegistration:false,files:current};
  await fs.writeFile(target,JSON.stringify(record,null,2)+'\n',{flag:'wx'});
  console.log('Protocolo PC2 congelado localmente; no se ha ejecutado PC3.');
}else{
  const record=JSON.parse(await fs.readFile(target,'utf8'));
  if(record.protocol!=='COBRIA-PC2-contratos-v1'||record.scope!=='congelamiento-local-sin-corridas-PC3'||record.independentRegistration!==false||
    JSON.stringify(Object.keys(record.files).sort())!==JSON.stringify(files.sort()))throw new Error('Registro de congelamiento inválido');
  for(const [file,hash] of Object.entries(current))if(record.files[file]!==hash)throw new Error(`Protocolo congelado alterado: ${file}`);
  console.log(JSON.stringify({protocol:record.protocol,filesChecked:files.length,frozenAt:record.frozenAt,protocolSha256:current['replication/protocol/pc2-contracts-v1.json'],pc3Executed:false}));
}
