import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {buildEp2} from '../../editorial/ep2/build.mjs';
const root=path.resolve(import.meta.dirname,'../..');
const digest=value=>createHash('sha256').update(value).digest('hex');
export function editOnce(text,from,to){
  if(!from||text.split(from).length!==2)throw new Error('El cambio debe localizar exactamente un fragmento');
  return text.replace(from,to);
}
export function verifyEp2(){
  const workshop=buildEp2();
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'cobria-ep2-inicio-'));
  const application=path.join(temporary,'ecosistema-app');
  const original=path.join(root,workshop.directory);
  for(const relative of ['src','test','data','taller-inicial','package.json']){
    fs.cpSync(path.join(original,relative),path.join(application,relative),{recursive:true,filter:filename=>{
      if(fs.lstatSync(filename).isSymbolicLink())throw new Error('No se copian enlaces');
      return !path.basename(filename).startsWith('.env');
    }});
  }
  const snapshots={};
  function collect(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())collect(file);else snapshots[path.relative(application,file)]=digest(fs.readFileSync(file));
  }}
  collect(application);
  const allowed=new Set(fs.readdirSync(path.join(application,'taller-inicial')));
  const target=file=>{
    if(!allowed.has(file)||path.basename(file)!==file)throw new Error('Archivo de cambio no permitido');
    return path.join(application,'taller-inicial',file);
  };
  const baseline=new Map([...allowed].map(file=>[file,fs.readFileSync(target(file),'utf8')]));
  function restore(){for(const [file,text]of baseline)fs.writeFileSync(target(file),text);}
  function edit(file,from,to){fs.writeFileSync(target(file),editOnce(fs.readFileSync(target(file),'utf8'),from,to));}
  const executions=[];
  function run(unit,stage,expected,exit=0,marker=null){
    const args=unit.id==='10'?['--test','--test-reporter=tap',`taller-inicial/${unit.file}`]:[`taller-inicial/${unit.file}`];
    const result=spawnSync(process.execPath,args,{cwd:application,encoding:'utf8',timeout:15000});
    const output=result.stdout.trim();const combined=output+'\n'+result.stderr;
    if(result.error||result.status!==exit)throw new Error(`${unit.id}/${stage}: salida ${result.status}: ${combined}`);
    if(marker){if(!combined.includes(marker))throw new Error(`${unit.id}/${stage}: falta ${marker}`);}
    else if(unit.id==='10'){
      if(!/^# pass 1$/m.test(output)||!/^# fail 0$/m.test(output))throw new Error('La prueba debe ejecutar un caso y aprobarlo');
    }else if(output!==expected)throw new Error(`${unit.id}/${stage}: ${JSON.stringify(output)} != ${JSON.stringify(expected)}`);
    executions.push({unit:unit.id,stage,args,exitCode:result.status,stdout:result.stdout,stderr:result.stderr});
  }
  for(const unit of workshop.units){
    restore();run(unit,'ejemplo',unit.expected);
    for(const editSpec of unit.edits)edit(...editSpec);
    run(unit,'cambio-del-lector',unit.changed);
    restore();edit(unit.failure.file,unit.failure.from,unit.failure.to);
    run(unit,'fallo-provocado',null,unit.failure.exit,unit.failure.marker);
    restore();
    if(unit.id==='10')for(const editSpec of unit.edits)edit(...editSpec);
    run(unit,'recuperacion',unit.id==='10'?unit.changed:unit.expected);
  }
  const record=workshop.units.find(unit=>unit.id==='09');
  const negatives=[
    ['ambito-ajeno',"id: 'obs-taller-001', ambito: 'reserva-sur'","id: 'obs-taller-001', ambito: 'reserva-norte'",'ACCESS_DENIED'],
    ['capacidad-ausente',"['observaciones:escribir', 'observaciones:leer']","['observaciones:leer']",'ACCESS_DENIED'],
    ['contenido-distinto',"await app.registrar.ejecutar(entrada, contexto);\n  const lista", "await app.registrar.ejecutar({...entrada, cantidad: 4}, contexto);\n  const lista",'IDEMPOTENCY_CONFLICT']
  ];
  for(const [name,from,to,code]of negatives){restore();edit(record.file,from,to);run(record,name,null,1,`Registro rechazado: ${code}`);}
  restore();
  const suite=spawnSync(process.execPath,['--test','--test-reporter=tap'],{cwd:application,encoding:'utf8',timeout:60000});
  const suitePassed=Number(suite.stdout.match(/^# pass (\d+)$/m)?.[1]??0);
  if(suite.error||suite.status!==0||suitePassed<1||!/^# fail 0$/m.test(suite.stdout))throw new Error(`Suite de la copia: ${suite.stdout}\n${suite.stderr}`);
  const report={phase:'EP2',kind:'copia-nueva-local-no-estudio-humano',node:process.version,
    status:'aprobado-local',temporary:application,units:workshop.units.length,
    sourceFilesSha256:snapshots,executions,suitePassed,suiteOutput:suite.stdout,
    readerComprehensionValidated:false,published:false,
    limitations:['No es clon Git limpio ni réplica externa.','Identidad sintética, memoria y ejecución secuencial; no acredita producción ni comprensión humana.']};
  const output=path.join(root,'output/review/ep2',`${path.basename(temporary)}.json`);
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  console.log(`EP2 aprobada: ${workshop.units.length} unidades, ${executions.length} ejecuciones y ${suitePassed} pruebas en copia nueva. Informe: ${output}`);
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.join(import.meta.dirname,'verify-ep2-start.mjs'))verifyEp2();
