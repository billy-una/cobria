import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawn,execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'../..');
const baseOutput=path.join(root,'output/review/pc8');await fs.mkdir(baseOutput,{recursive:true});
const directory=await fs.mkdtemp(path.join(os.tmpdir(),'cobria-pc8-clean-'));
const output=path.join(baseOutput,path.basename(directory));await fs.mkdir(output);
const capture=(args,cwd=root)=>execFileSync('git',args,{cwd,encoding:'utf8'}).trim();
const digest=data=>createHash('sha256').update(data).digest('hex');
const report={kind:'dos-clones-de-instantanea-local-no-CI-remota',sourceHead:capture(['rev-parse','HEAD']),sourceWorkingTreeClean:capture(['status','--porcelain'])==='',directory,builds:[],published:false,remoteCiVerified:false,status:'preparando'};
async function save(){const text=JSON.stringify(report,null,2)+'\n';await fs.writeFile(path.join(output,'clean-builds.json'),text);await fs.writeFile(path.join(baseOutput,'clean-builds.json'),text);}
async function run(binary,args,cwd,label){
  const log=path.join(output,label+'.log');const handle=await fs.open(log,'w');
  console.log(`${label}: ${binary} ${args.join(' ')}`);
  try{await new Promise((resolve,reject)=>{const child=spawn(binary,args,{cwd,env:{...process.env,COBRIA_PUBLIC_BUILD:'1'},stdio:['ignore',handle.fd,handle.fd]});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error(`${label}: salida ${code}; consulte ${log}`)));});}
  finally{await handle.close();}
}
try{
  const source=path.join(directory,'source');
  capture(['clone','--quiet','--no-checkout','--no-hardlinks',root,source]);
  const files=execFileSync('git',['ls-files','-z','--cached','--others','--exclude-standard'],{cwd:root}).toString().split('\0').filter(Boolean);
  const inventory=[];let total=0;
  for(const file of [...new Set(files)].sort()){
    if(file.split('/').some(x=>['node_modules','.git','__pycache__','dist','.wrangler'].includes(x))||file.startsWith('output/')||file.startsWith('build/'))continue;
    if(file.split('/').some(x=>x.startsWith('.env')||['.npmrc','.netrc'].includes(x))||/\.(pem|key|p12|pfx)$/.test(file))throw Error(`Archivo sensible no permitido: ${file}`);
    const original=path.resolve(root,file);if(!original.startsWith(root+path.sep))throw Error('Ruta ajena');
    let stat;try{stat=await fs.lstat(original);}catch(error){if(error.code==='ENOENT')continue;throw error;}
    if(!stat.isFile()||stat.isSymbolicLink())throw Error(`No es archivo regular: ${file}`);
    const data=await fs.readFile(original);total+=data.length;if(total>1024**3)throw Error('Inventario supera 1 GiB; revisar alcance');
    const destination=path.join(source,file);await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,data,{mode:stat.mode&0o777});
    inventory.push({path:file,bytes:data.length,sha256:digest(data)});
  }
  await fs.writeFile(path.join(output,'source-inventory.json'),JSON.stringify(inventory,null,2)+'\n');
  capture(['add','--all'],source);
  execFileSync('git',['-c','core.hooksPath=/dev/null','-c','commit.gpgsign=false','-c','user.name=COBRIA Local Build','-c','user.email=local-build@invalid','commit','--quiet','-m','Instantánea local de verificación PC8; no release'],{cwd:source,env:{...process.env,GIT_AUTHOR_DATE:'2026-10-19T00:00:00Z',GIT_COMMITTER_DATE:'2026-10-19T00:00:00Z'}});
  report.snapshotCommit=capture(['rev-parse','HEAD'],source);report.inputFiles=inventory.length;report.inputBytes=total;await save();
  const artifacts=['editorial/curriculum.json','editorial/content-map.json','libro-cobria/index.html','libro-cobria/cuaderno.html','libro-cobria/anexo-tecnico.html','sitio/public/catalogo.json','sitio/public/pattern-catalog.json'];
  for(const index of [1,2]){
    const stats=await fs.statfs(directory);if(stats.bavail*stats.bsize<4*1024**3)throw Error('Menos de 4 GiB para construir; no se borran datos');
    const clone=path.join(directory,`clone-${index}`);capture(['clone','--quiet','--no-local',source,clone]);
    if(capture(['status','--porcelain'],clone)!=='')throw Error('El clon no está limpio antes de instalar');
    const item={index,commit:capture(['rev-parse','HEAD'],clone),cleanBeforeBuild:true,referenceAccessAllowed:false,status:'instalando'};report.builds.push(item);await save();
    for(const project of ['replication','sitio','libro-cobria'])await run('npm',['ci','--prefix',project],clone,`clone-${index}-install-${project}`);
    item.status='construyendo';await save();await run('make',['construir-publico'],clone,`clone-${index}-build`);
    item.artifacts=[];for(const file of artifacts)item.artifacts.push({path:file,sha256:digest(await fs.readFile(path.join(clone,file)))});
    item.status='aprobado';await save();
  }
  report.deterministicArtifacts=report.builds[0].artifacts.every((x,i)=>x.sha256===report.builds[1].artifacts[i].sha256);
  if(!report.deterministicArtifacts)throw Error('Artefactos editoriales declarados divergentes');
  report.status='aprobado-local';report.limitations=['La instantánea identifica el árbol copiado; no es el HEAD publicado del repositorio original.','Los siete HTML/JSON declarados se comparan por bytes; los PDF no se declaran idénticos byte a byte.','Un solo equipo macOS ARM; Linux/Node 22 y CI remoto todavía no observados.'];
}catch(error){report.status='fallido';report.error=error.message;process.exitCode=1;}
finally{await save();if(process.env.COBRIA_KEEP_TEMP!=='1')await fs.rm(directory,{recursive:true,force:true});console.log(JSON.stringify(report,null,2));}
