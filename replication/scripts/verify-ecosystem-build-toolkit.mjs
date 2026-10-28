import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const directory=await fs.mkdtemp(path.join(os.tmpdir(),'cobria-build-toolkit-'));
const evidence=path.join(root,'output/review/ecosistema-11-12',path.basename(directory));
await fs.mkdir(evidence,{recursive:true});
const report={scope:'construcción e instalación locales; no transferencia humana',directory,node:process.version,platform:process.platform,architecture:process.arch,installScriptsEnabled:false,steps:[],published:false,status:'ejecutando'};
function run(command,args,cwd,label){
  const result=spawnSync(command,args,{cwd,encoding:'utf8',timeout:180000,maxBuffer:16*1024**2});
  report.steps.push({label,exit:result.status});
  return fs.writeFile(path.join(evidence,label+'.log'),(result.stdout??'')+(result.stderr??'')).then(()=>{
    if(result.status!==0)throw Error(`${label}: ${result.error?.message??result.status}`);
    return result.stdout;
  });
}
try{
  const app=path.join(directory,'aplicacion');
  await fs.mkdir(app);
  const origin=path.join(root,'replication/examples/ecosistema-app');
  // Copia explícita sin dependencias, credenciales ni datos de usuario.
  for(const name of ['src','test','data','package.json'])await fs.cp(path.join(origin,name),path.join(app,name),{recursive:true,filter:async p=>{if((await fs.lstat(p)).isSymbolicLink())throw Error('Enlace rechazado');return true;}});
  await run('npm',['test'],app,'aplicacion-pruebas');
  await run(process.execPath,['src/recorrido-build.mjs'],app,'aplicacion-recorrido');
  const packed=JSON.parse(await run('npm',['pack','--json','--pack-destination',directory],path.join(root,'replication'),'toolkit-pack'));
  const archive=await fs.readFile(path.join(directory,packed[0].filename));
  await fs.writeFile(path.join(evidence,packed[0].filename),archive,{flag:'wx'});
  report.packageSha256=createHash('sha256').update(archive).digest('hex');
  const consumer=path.join(directory,'consumidor');await fs.mkdir(consumer);
  await run('npm',['install','--ignore-scripts','--no-audit','--no-fund','--prefix',consumer,path.join(directory,packed[0].filename)],directory,'toolkit-install');
  const cli=path.join(consumer,'node_modules/.bin/cobria');
  for(const command of ['validar','medir'])await run(cli,[command,'--json'],consumer,'instalado-'+command);
  await run(cli,['contexto','--id','SEC-OP-001','--json'],consumer,'instalado-contexto');
  await run(cli,['generar','diccionario','--nombre','Aves','--directorio',path.join(consumer,'reserva'),'--simular','--json'],consumer,'instalado-diccionario');
  if(await fs.stat(path.join(consumer,'reserva')).catch(()=>null))throw Error('La simulación escribió en el destino');
  await run(cli,['verificar','--adaptador','lokijs','--tamano','20','--salida',path.join(consumer,'conformidad'),'--json'],consumer,'instalado-conformidad');
  report.status='aprobado-local';
  report.package=packed[0].filename;
}catch(error){report.status='fallido';report.error=error.message;process.exitCode=1;}
await fs.writeFile(path.join(evidence,'resultado.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,evidence},null,2));
