import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const app = 'replication/examples/ecosistema-app';
const unitFile = `${app}/test/app.test.mjs`;
export function requireExecutedTests(output, minimum = 1) {
  const passed = Number(output.match(/^# pass (\d+)\s*$/m)?.[1] ?? 0);
  const failed = Number(output.match(/^# fail (\d+)\s*$/m)?.[1] ?? -1);
  if (passed < minimum || failed !== 0) throw new Error('No hay pruebas pertinentes aprobadas o hay fallos');
  return passed;
}

export function validateExecution(value, knownNames) {
  if (value.cwd !== '.') throw new Error('C1 debe partir de la raíz');
  if (value.binary === 'npm' && JSON.stringify(value.argv) === JSON.stringify(['--prefix',app,'start'])) return 'demo';
  if (value.binary !== 'node' || value.argv.length !== 4 || value.argv[0] !== '--test' ||
      value.argv[1] !== '--test-reporter=tap' || value.argv[3] !== unitFile ||
      !knownNames.some(name => value.argv[2] === `--test-name-pattern=^${name}$`)) {
    throw new Error('La instrucción no pertenece a la lista de pruebas C1; no se ejecutan comandos arbitrarios del texto');
  }
  return 'test';
}

export function verifyC1Start() {
  const course = JSON.parse(fs.readFileSync(path.join(root, 'editorial/curriculum.json')));
  const lessons = course.modules.filter(module=>['inicio','fundamentos'].includes(module.key))
    .flatMap(module=>module.lessons.map((lesson,index)=>({id:`${module.key}/${index+1}`,lesson})));
  if (lessons.length !== 10) throw new Error('Falta la ruta C1 de diez lecciones');
  const names = [...fs.readFileSync(path.join(root,unitFile),'utf8').matchAll(/^test\('([^']+)'/gm)].map(match=>match[1]);
  for (const {lesson} of lessons) validateExecution(lesson.execution,names);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(),'cobria-c1-clean-'));
  const destination = path.join(temporary,app);
  fs.mkdirSync(destination,{recursive:true});
  for (const name of ['src','test','data','package.json']) fs.cpSync(path.join(root,app,name),path.join(destination,name),{
    recursive:true, filter: filename=>{
      if (fs.lstatSync(filename).isSymbolicLink()) throw new Error('C1 no copia enlaces simbólicos');
      return !path.basename(filename).startsWith('.env');
    }
  });
  const files = [];
  const collect = directory=>{for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    const filename=path.join(directory,entry.name);if(entry.isDirectory())collect(filename);else files.push(filename);
  }};
  collect(destination);
  const sourceHash = createHash('sha256');
  for(const filename of files.sort())sourceHash.update(path.relative(destination,filename)).update('\0').update(fs.readFileSync(filename)).update('\0');
  const results=[];
  function run(binary,argv){
    const result=spawnSync(binary==='node'?process.execPath:'npm',argv,{cwd:temporary,encoding:'utf8',timeout:60000});
    if(result.error||result.status!==0)throw new Error(`${binary}: ${result.error??result.stderr??result.status}`);
    return result.stdout;
  }
  const suite=run('node',['--test','--test-reporter=tap',...fs.readdirSync(path.join(destination,'test')).filter(name=>name.endsWith('.test.mjs')).sort().map(name=>`${app}/test/${name}`)]);
  const suitePassed=requireExecutedTests(suite);
  for(const {id,lesson}of lessons){
    const value=lesson.execution;
    const kind=validateExecution(value,names);
    const output=run(value.binary,value.argv);
    if(kind==='test'){
      const passed=requireExecutedTests(output,value.minimumPassed);
      if(passed!==1)throw new Error(`Filtro no selectivo: ${id}`);
      results.push({id,passed,exitCode:0});
    }else{
      if(!output.includes(value.expected)||!output.includes('al cerrar se pierden los datos'))throw new Error('Salida inicial distinta de la enseñada');
      results.push({id,expectedOutputMatched:true,exitCode:0});
    }
  }
  const report={phase:'C1',kind:'local-fresh-copy-not-external-replication',node:process.version,
    commitAtRun:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),
    sourceTreeDirtyAtRun:Boolean(execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim()),
    sourceSnapshotSha256:sourceHash.digest('hex'),temporary,externalPackagesInstalled:0,
    suitePassed,lessons:results,readerComprehensionValidated:false,published:false,
    limitations:['Copia de la aplicación, no clon Git ni réplica independiente.','Memoria y contexto sintético; no demuestra autenticación ni motores remotos.']};
  const output=path.join(root,'output/review/c1',`${path.basename(temporary)}.json`);
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  console.log(`C1 en copia nueva: ${results.length} instrucciones verificadas, ${suitePassed} pruebas; informe ${output}`);
  return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))verifyC1Start();
