import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync,execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { requireExecutedTests } from './verify-c1-start.mjs';
import { auditProject } from './audit-c3-layers.mjs';

const root=fileURLToPath(new URL('../../',import.meta.url));
const app='replication/examples/ecosistema-app';
const testFile=`${app}/test/capas-c3.test.mjs`;
export function verifyC3Layers(){
  const course=JSON.parse(fs.readFileSync(path.join(root,'editorial/curriculum.json')));
  const lessons=course.modules.filter(module=>['arquitectura','capas'].includes(module.key))
    .flatMap(module=>module.lessons.map((lesson,index)=>({id:`${module.key}/${index+1}`,lesson})));
  const names=[...fs.readFileSync(path.join(root,testFile),'utf8').matchAll(/^test\('([^']+)'/gm)].map(match=>match[1]);
  if(lessons.length!==10||names.length!==10)throw new Error('Faltan las diez prácticas y casos C3');
  for(const {lesson} of lessons){
    const expected=['--test','--test-reporter=tap',`--test-name-pattern=^${lesson.testName}$`,testFile];
    if(lesson.execution?.cwd!=='.'||lesson.execution.binary!=='node'||!names.includes(lesson.testName)||
      JSON.stringify(lesson.execution.argv)!==JSON.stringify(expected))throw new Error('Instrucción fuera de las pruebas permitidas');
  }
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'cobria-c3-clean-'));
  const destination=path.join(temporary,app);fs.mkdirSync(destination,{recursive:true});
  for(const relative of ['src','test','data','package.json'])fs.cpSync(path.join(root,app,relative),path.join(destination,relative),{
    recursive:true,filter:filename=>{
      if(fs.lstatSync(filename).isSymbolicLink())throw new Error('La copia C3 no sigue enlaces simbólicos');
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
  const files=fs.readdirSync(path.join(destination,'test')).filter(file=>file.endsWith('.test.mjs')).sort().map(file=>`${app}/test/${file}`);
  const suitePassed=requireExecutedTests(run(['--test','--test-reporter=tap',...files]));
  const results=lessons.map(({id,lesson})=>{
    const passed=requireExecutedTests(run(lesson.execution.argv),1);
    if(passed!==1)throw new Error('Filtro C3 no selectivo');return {id,passed};
  });
  const audit=auditProject();if(!audit.passed)throw new Error(JSON.stringify(audit.errors));
  const report={phase:'C3',kind:'local-fresh-copy-not-external-replication',node:process.version,
    commitAtRun:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
    sourceTreeDirtyAtRun:Boolean(execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim()),
    sourceSnapshotSha256:snapshot.digest('hex'),temporary,suitePassed,lessons:results,
    staticAudit:audit,staticAuditScope:'Fuentes originales de la aplicación; AST mediante dependencias de réplica instaladas, no dentro de la copia mínima.',
    applicationExternalPackagesInstalled:0,remoteEngineValidated:false,readerComprehensionValidated:false,published:false};
  const output=path.join(root,'output/review/c3',`${path.basename(temporary)}.json`);
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,`${JSON.stringify(report,null,2)}\n`,{flag:'wx'});
  console.log(`C3 en copia nueva: ${results.length} instrucciones, ${suitePassed} pruebas; grafo de ${audit.files} archivos aprobado; informe ${output}`);
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))verifyC3Layers();
