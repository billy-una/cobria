import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

export function verifyFrozenInputs(review,coverage,frozen){
  if(frozen.baselineCommit!==review.baselineCommit||coverage.baselineCommit!==review.baselineCommit)throw Error('C0_BASELINE_COMMIT_DIVERGED');
  const expected=new Map(coverage.sourceInventory.map(x=>[x.path,x]));
  if(frozen.files.length!==expected.size||new Set(frozen.files.map(x=>x.path)).size!==expected.size)throw Error('C0_BASELINE_INVENTORY_DIVERGED');
  const result=new Map();
  for(const row of frozen.files){
    const reference=expected.get(row.path);
    if(!reference||path.isAbsolute(row.path)||row.path.split('/').includes('..'))throw Error('C0_BASELINE_PATH_INVALID');
    if(reference.existsAtBaseline){
      if(typeof row.content!=='string'||createHash('sha256').update(row.content).digest('hex')!==reference.sha256)throw Error('C0_BASELINE_BYTES_DIVERGED');
    }else if(row.content!==null)throw Error('C0_BASELINE_ABSENCE_DIVERGED');
    result.set(row.path,row.content);
  }
  return result;
}

export function createBaselineReader(root){
  const review=JSON.parse(fs.readFileSync(path.join(root,'editorial/c0/review.json')));
  const frozenPath=path.join(root,'editorial/c0/frozen-inputs.json');
  const frozen=fs.existsSync(frozenPath)?verifyFrozenInputs(review,
    JSON.parse(fs.readFileSync(path.join(root,'editorial/c0/coverage.json'))),JSON.parse(fs.readFileSync(frozenPath))):null;
  let hasCommit=false;
  try{execFileSync('git',['cat-file','-e',`${review.baselineCommit}^{commit}`],{cwd:root,stdio:'ignore'});hasCommit=true;}catch{}
  const cache=new Map();
  return filename=>{
    if(path.isAbsolute(filename)||filename.split('/').includes('..'))throw Error('Ruta C0 no válida');
    if(!cache.has(filename)){
      try{
        if(!hasCommit)throw Error('C0_GIT_OBJECT_ABSENT');
        cache.set(filename,execFileSync('git',['--literal-pathspecs','show',`${review.baselineCommit}:${filename}`],{cwd:root,encoding:'utf8',maxBuffer:16*1024**2,stdio:['ignore','pipe','pipe']}));
      }
      catch{cache.set(filename,frozen?.get(filename)??null);}
    }
    return cache.get(filename);
  };
}
