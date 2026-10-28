import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const root=fileURLToPath(new URL('../../',import.meta.url));
const lock='replication/protocol/pc2-freeze-v1.json';
const read=relative=>fs.readFile(path.join(root,relative),'utf8');

test('PC2 congelamiento corresponde al protocolo y no regenera archivos',async()=>{
  const before=await read(lock);
  const result=JSON.parse(execFileSync(process.execPath,['replication/scripts/freeze-pc2.mjs','--check'],{cwd:root,encoding:'utf8'}));
  const protocol=await read('replication/protocol/pc2-contracts-v1.json');
  assert.equal(result.protocolSha256,createHash('sha256').update(protocol).digest('hex'));
  assert.equal(result.pc3Executed,false);assert.equal(await read(lock),before);
  const p=JSON.parse(protocol);assert.equal(p.runsPerCell,30);assert.deepEqual(p.engines,['mongodb','couchdb','opensearch']);
  assert.deepEqual(p.experiments,['P1','P2','R1','S1','A1']);
});

test('PC2 congelamiento rechaza archivo alterado y entrada omitida',async()=>{
  const record=JSON.parse(await read(lock));
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'cobria-pc2-lock-'));
  for(const relative of [...Object.keys(record.files),lock]){
    const target=path.join(directory,relative);await fs.mkdir(path.dirname(target),{recursive:true});await fs.copyFile(path.join(root,relative),target);
  }
  const script=path.join(directory,'replication/scripts/freeze-pc2.mjs');
  const changed=path.join(directory,'replication/protocol/pc2-contracts-v1.json');await fs.appendFile(changed,'\n');
  let result=spawnSync(process.execPath,[script,'--check'],{cwd:directory,encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/congelado alterado/);
  delete record.files['replication/src/pc2/contracts.mjs'];await fs.writeFile(path.join(directory,lock),JSON.stringify(record));
  result=spawnSync(process.execPath,[script,'--check'],{cwd:directory,encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/congelamiento inválido/);
});

test('PC2 no permite reemplazar el congelamiento existente',async()=>{
  const before=await read(lock);
  const result=spawnSync(process.execPath,['replication/scripts/freeze-pc2.mjs','--freeze'],{cwd:root,encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/EEXIST/);assert.equal(await read(lock),before);
});
