import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { requireExecutedTests } from './verify-c1-start.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const app='replication/examples/ecosistema-app';
const testFile=`${app}/test/datos-c2.test.mjs`;
export function verifyC2Data(){
  const course=JSON.parse(fs.readFileSync(path.join(root,'editorial/curriculum.json')));
  const lessons=course.modules.find(module=>module.key==='datos').lessons;
  const names=[...fs.readFileSync(path.join(root,testFile),'utf8').matchAll(/^test\('([^']+)'/gm)].map(match=>match[1]);
  if(lessons.length!==5||names.length!==9)throw new Error('Se requieren cinco lecciones y nueve casos de datos');
  for(const lesson of lessons){
    const expected=['--test','--test-reporter=tap',`--test-name-pattern=^${lesson.testName}$`,testFile];
    if(lesson.execution?.cwd!=='.'||lesson.execution.binary!=='node'||
      !names.includes(lesson.testName)||JSON.stringify(lesson.execution.argv)!==JSON.stringify(expected)){
      throw new Error('Contrato de ejecución C2 ajeno a las pruebas permitidas');
    }
  }
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'cobria-c2-clean-'));
  const destination=path.join(temporary,app);
  fs.mkdirSync(destination,{recursive:true});
  for(const relative of ['src','test','data','package.json'])fs.cpSync(path.join(root,app,relative),path.join(destination,relative),{
    recursive:true,filter:filename=>{
      if(fs.lstatSync(filename).isSymbolicLink())throw new Error('El taller no copia enlaces simbólicos');
      return !path.basename(filename).startsWith('.env');
    }
  });
  const snapshot=createHash('sha256');
  function hash(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
    const filename=path.join(directory,entry.name);
    if(entry.isDirectory())hash(filename);else snapshot.update(path.relative(destination,filename)).update('\0').update(fs.readFileSync(filename)).update('\0');
  }}
  hash(destination);
  const run=argv=>{
    const result=spawnSync(process.execPath,argv,{cwd:temporary,encoding:'utf8',timeout:60000});
    if(result.error||result.status!==0)throw new Error(result.stderr||String(result.error||result.status));
    return result.stdout;
  };
  const suitePassed=requireExecutedTests(run(['--test','--test-reporter=tap',testFile]),9);
  const results=lessons.map((lesson,index)=>{
    const passed=requireExecutedTests(run(lesson.execution.argv),1);
    if(passed!==1)throw new Error('Filtro de lección no selectivo');
    return {lesson:`datos/${index+1}`,passed};
  });
  const demo=run([`${app}/src/demo-datos.mjs`]);
  if(!demo.includes('Segunda migración idéntica: true')||!demo.includes('sin índice ni motor remoto'))throw new Error('Salida de demostración distinta');
  const report={phase:'C2',kind:'local-fresh-copy-not-external-replication',node:process.version,
    commitAtRun:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
    sourceTreeDirtyAtRun:Boolean(execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim()),
    sourceSnapshotSha256:snapshot.digest('hex'),temporary,suitePassed,lessons:results,demo,
    externalPackagesInstalled:0,remoteEngineValidated:false,readerComprehensionValidated:false,published:false};
  const output=path.join(root,'output/review/c2',`${path.basename(temporary)}.json`);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,`${JSON.stringify(report,null,2)}\n`,{flag:'wx'});
  console.log(`C2 en copia nueva: ${results.length} instrucciones y ${suitePassed} pruebas; informe ${output}`);
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))verifyC2Data();
