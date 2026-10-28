import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(import.meta.dirname,'../..');
export const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export const admitted=name=>name&&!path.isAbsolute(name)&&!name.includes('\\')&&!name.split('/').some(x=>
  ['..','.git','node_modules','dist','__pycache__','.wrangler'].includes(x)||x.startsWith('.env')||['.npmrc','.netrc'].includes(x))&&
  !/\.(pem|key|p12|pfx)$/i.test(name)&&!name.startsWith('output/')&&!name.startsWith('build/');

export function curriculumStats(curriculum){
  const lessons=curriculum.modules.flatMap(module=>module.lessons);
  const words=lessons.map(lesson=>[lesson.situation,lesson.simple,lesson.example,...lesson.steps].join(' ').trim().split(/\s+/).length).sort((a,b)=>a-b);
  return {modules:curriculum.modules.length,lessons:lessons.length,withExecution:lessons.filter(x=>x.execution).length,
    withoutExecution:lessons.filter(x=>!x.execution).length,explanationWords:{minimum:words[0]??0,median:words[Math.floor(words.length/2)]??0,maximum:words.at(-1)??0},
    interpretation:'Conteos descriptivos, no evaluación de calidad. No se exige ejecución artificial a ejercicios de diseño.'};
}

export async function inspectRemote(url,{maxBytes=2*1024**2,retain=true,fetcher=fetch}={}){
  const observedAt=new Date().toISOString();
  try{
    const response=await fetcher(url,{redirect:'manual',signal:AbortSignal.timeout(60000)});
    const hash=createHash('sha256'),parts=[];let bytes=0;
    for await(const chunk of response.body??[]){
      bytes+=chunk.length;if(bytes>maxBytes)throw Error('Respuesta supera el límite de captura');
      hash.update(chunk);if(retain)parts.push(Buffer.from(chunk));
    }
    const body=retain?Buffer.concat(parts):null;
    const headers=Object.fromEntries(['content-type','content-security-policy','strict-transport-security','x-content-type-options','x-frame-options','cache-control','etag'].map(key=>[key,response.headers.get(key)]));
    return {observedAt,url,status:response.status,bytes,sha256:hash.digest('hex'),headers,
      title:body?.toString().match(/<title[^>]*>(.*?)<\/title>/is)?.[1]??null,body};
  }catch(error){return {observedAt,url,status:null,error:error.message,body:null};}
}

async function regular(relative){
  const target=path.resolve(root,relative);
  if(target!==root&&!target.startsWith(root+path.sep))throw Error('Ruta ajena');
  const stat=await fs.lstat(target);
  if(!stat.isFile()||stat.isSymbolicLink()||await fs.realpath(target)!==target)throw Error('No es archivo regular: '+relative);
  const bytes=await fs.readFile(target);
  return {path:relative,bytes:bytes.length,sha256:digest(bytes)};
}

async function main(){
  if(process.argv.length!==2)throw Error('Esta captura no acepta rutas, dominios ni opciones externos');
  const git=args=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
  const base=path.join(root,'output/review/ep0');await fs.mkdir(base,{recursive:true});
  if(await fs.realpath(base)!==base)throw Error('Destino enlazado');
  const output=path.join(base,new Date().toISOString().replace(/[:.]/g,'-'));await fs.mkdir(output);
  const write=async(name,data)=>fs.writeFile(path.join(output,name),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
  const policy=JSON.parse(await fs.readFile(path.join(root,'editorial/ep0/alcance.json')));
  const canonical=JSON.parse(await fs.readFile(path.join(root,'editorial/canonical.json')));
  const report={kind:'linea-base-EP0-no-publicacion',createdAt:new Date().toISOString(),sourceHead:git(['rev-parse','HEAD']),
    branch:git(['branch','--show-current']),canonicalRelease:canonical.release,scope:policy,
    captureToolSha256:digest(await fs.readFile(fileURLToPath(import.meta.url))),published:false,productsModified:false,
    limitations:['Captura anónima sin ejecutar JavaScript: no acredita interacción, accesibilidad o identidad de despliegue.',
      'Sin identificador verificable del proveedor, no se infiere el SHA desplegado desde un título o una huella HTML.',
      'El inventario Git no es una auditoría de secretos ni autoriza distribuir historia.',
      'No se construyen productos ni se repiten experimentos.']};
  const status=execFileSync('git',['status','--porcelain=v1','-z'],{cwd:root}).toString().split('\0').filter(Boolean);
  report.gitChanges=[];
  for(let i=0;i<status.length;i++){
    const item={status:status[i].slice(0,2),path:status[i].slice(3)};
    if(/[RC]/.test(item.status))item.originalPath=status[++i];
    report.gitChanges.push(item);
  }
  report.sourceWorkingTreeClean=report.gitChanges.length===0;
  const names=execFileSync('git',['ls-files','-z','--cached','--others','--exclude-standard'],{cwd:root}).toString().split('\0').filter(Boolean);
  const source=[],excluded=[],deleted=[];
  for(const name of [...new Set(names)].sort()){
    if(!admitted(name)){excluded.push(name);continue;}
    try{source.push(await regular(name));}catch(error){if(error.code==='ENOENT')deleted.push(name);else throw error;}
  }
  await write('FUENTES.json',{files:source,excluded,deleted,scope:'Rutas Git existentes no ignoradas, sin salidas ni dependencias ni rutas sensibles conocidas; no garantiza ausencia de secretos.'});
  report.sourceInventory={count:source.length,sha256:digest(await fs.readFile(path.join(output,'FUENTES.json')))};
  const productCatalog=JSON.parse(await fs.readFile(path.join(root,'editorial/products.json')));
  report.localArtifacts=[];
  for(const item of productCatalog.products.filter(item=>item.output.endsWith('.pdf'))){
    try{report.localArtifacts.push({id:item.id,authority:item.authority,...await regular(item.output)});}
    catch(error){report.localArtifacts.push({id:item.id,path:item.output,error:error.message});}
  }
  const pdfCode='import json,sys; from pypdf import PdfReader\nrows=[]\nfor item in json.loads(sys.argv[1]):\n r=PdfReader(item); rows.append({"path":item,"pages":len(r.pages),"taggedStructure":"/StructTreeRoot" in r.trailer["/Root"],"language":str(r.trailer["/Root"].get("/Lang","")),"title":str((r.metadata or {}).get("/Title",""))})\nprint(json.dumps(rows))';
  try{report.pdfMetadata=JSON.parse(execFileSync('python3',['-c',pdfCode,JSON.stringify(report.localArtifacts.filter(x=>!x.error).map(x=>x.path))],{cwd:root,encoding:'utf8',timeout:120000}));}
  catch(error){report.pdfMetadataError=error.message;}
  report.previousEvidence=[];
  for(const name of ['output/release/ecosistema-16-local/20261019T170850767529Z/RECIBO.json',
    'output/release/ecosistema-16-local/20261019T170850767529Z/DECISION.json',
    'output/review/ecosistema-17-18/revision-2/REVISION.json',
    'output/review/ecosistema-17-18/decision-2/DECISION.json']){
    try{report.previousEvidence.push({...await regular(name),status:'antecedente-no-revalidado-por-EP0'});}
    catch(error){report.previousEvidence.push({path:name,error:error.message,status:'no-disponible'});}
  }
  const downloads=JSON.parse(await fs.readFile(path.join(root,'sitio/public/downloads/manifest.json')));
  report.localDownloadManifest=await regular('sitio/public/downloads/manifest.json');
  await write('MANIFIESTO-DESCARGAS-LOCAL.json',downloads);
  report.localDownloads=[];
  for(const item of downloads.items){
    if(!item.href.startsWith('/downloads/')||path.posix.basename(item.href)!==item.href.slice('/downloads/'.length))throw Error('Descarga no canónica');
    const file=await regular('sitio/public'+item.href);
    report.localDownloads.push({id:item.id,...file,matchesManifest:file.sha256===item.sha256&&file.bytes===item.bytes});
  }
  report.curriculum=curriculumStats(JSON.parse(await fs.readFile(path.join(root,'editorial/curriculum.json'))));
  report.core=await regular('specification/COBRIA-CORE-1.0.md');
  report.public=[];const origin='https://cobria-atlas.sectagpt.chatgpt.site';
  const routes=['/','/recursos','/comenzar','/explorar','/mapa','/laboratorio','/downloads/manifest.json','/downloads/COBRIA-tesis.pdf','/robots.txt','/sitemap.xml','/llms.txt'];
  await fs.mkdir(path.join(output,'http'));
  for(let index=0;index<routes.length;index++){
    const route=routes[index];console.log('GET anónimo',route);
    const {body,...result}=await inspectRemote(origin+route,{retain:!route.endsWith('.pdf'),maxBytes:route.endsWith('.pdf')?70*1024**2:2*1024**2});
    if(body){const name=`http/${String(index).padStart(2,'0')}.body`;await fs.writeFile(path.join(output,name),body,{flag:'wx'});result.bodyFile=name;
      if(route==='/recursos')result.downloadLinks=[...body.toString().matchAll(/href="([^"]+)"/g)].map(x=>x[1]).filter(x=>/downloads\//.test(x));
    }
    report.public.push({route,...result});
  }
  report.publicDownloads=[];
  for(const item of downloads.items){
    console.log('Huella pública',item.id);
    const {body,...result}=await inspectRemote(origin+item.href,{retain:false,maxBytes:70*1024**2});
    report.publicDownloads.push({id:item.id,...result,expectedLocalSha256:item.sha256,expectedLocalBytes:item.bytes,
      matchesCurrentLocal:result.status===200?result.sha256===item.sha256&&result.bytes===item.bytes:null});
  }
  report.deploymentIdentity={status:'no-acreditada',observedPageTitles:report.public.filter(x=>x.title).map(x=>({route:x.route,title:x.title})),
    note:'Títulos y bytes observados no identifican por sí solos una versión del proveedor ni su commit.'};
  const problemRoutes=report.public.filter(x=>x.error||x.status!==200).map(x=>({route:x.route,status:x.status,error:x.error}));
  report.observations={problemRoutes,downloadDifferences:report.publicDownloads.filter(x=>x.matchesCurrentLocal===false).map(x=>x.id),
    missingSecurityHeaders:report.public.filter(x=>x.headers?.['content-type']?.includes('text/html')).map(x=>({route:x.route,
      missing:['content-security-policy','strict-transport-security','x-content-type-options','x-frame-options'].filter(key=>!x.headers[key])})).filter(x=>x.missing.length)};
  report.captureComplete=report.public.length===routes.length&&report.publicDownloads.length===downloads.items.length&&
    ![...report.public,...report.publicDownloads].some(x=>x.error)&&report.localArtifacts.every(x=>!x.error)&&
    report.localDownloads.every(x=>x.matchesManifest)&&!report.pdfMetadataError;
  report.state=report.captureComplete?'captura-completa-con-incidencias-no-corregidas':'captura-incompleta';
  await write('BASELINE.json',report);
  const listed=[];
  for(const name of ['FUENTES.json','MANIFIESTO-DESCARGAS-LOCAL.json','BASELINE.json',...report.public.map(x=>x.bodyFile).filter(Boolean)]){
    const bytes=await fs.readFile(path.join(output,name));listed.push({path:name,bytes:bytes.length,sha256:digest(bytes)});
  }
  await write('RECIBO.json',{kind:'integridad-de-captura-no-firma-ni-aprobacion',createdAt:new Date().toISOString(),files:listed,published:false});
  console.log(JSON.stringify({output,state:report.state,sourceFiles:source.length,observations:report.observations},null,2));
  if(!report.captureComplete)process.exitCode=2;
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))main().catch(error=>{console.error(error.message);process.exitCode=1;});
