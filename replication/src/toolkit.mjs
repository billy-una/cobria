import fs from 'node:fs/promises';
import path from 'node:path';

export const EXIT = Object.freeze({ OK:0, INVALID:1, USAGE:2, NOT_FOUND:3, CONFLICT:4 });

export async function cargarManifiestos(ruta) {
  const stat=await fs.stat(ruta).catch(()=>null);
  if (!stat) throw Object.assign(new Error(`No existe: ${ruta}`),{code:'CLI_PATH_NOT_FOUND',exit:EXIT.NOT_FOUND});
  const files=stat.isDirectory() ? (await fs.readdir(ruta)).filter(x=>x.endsWith('.yaml')||x.endsWith('.json')).sort().map(x=>path.join(ruta,x)) : [ruta];
  const loaded=[];
  for (const file of files) {
    try { loaded.push({file,data:JSON.parse(await fs.readFile(file,'utf8'))}); }
    catch { throw Object.assign(new Error(`No se pudo interpretar ${file} como JSON/YAML compatible.`),{code:'CLI_MANIFEST_PARSE_ERROR',exit:EXIT.INVALID}); }
  }
  return loaded;
}

export function validarManifiestos(manifests, raiz) {
  const errors=[]; const ids=new Map(); let records=0;
  for (const {file,data} of manifests) {
    if (data.schemaVersion!=='1.0.0'||!data.manifestId||!Array.isArray(data.records)) errors.push({code:'CLI_MANIFEST_ENVELOPE_INVALID',file});
    for (const item of data.records??[]) {
      records++;
      for (const field of ['id','source','version','owner','references','data']) if (item[field]===undefined||item[field]===null||item[field]===''||(Array.isArray(item[field])&&!item[field].length)) errors.push({code:'CLI_RECORD_FIELD_REQUIRED',file,id:item.id,field});
      if (ids.has(item.id)) errors.push({code:'CLI_ID_DUPLICATED',file,id:item.id,first:ids.get(item.id)}); else ids.set(item.id,file);
      if (!/^\d+\.\d+\.\d+$/.test(item.version??'')) errors.push({code:'CLI_VERSION_INVALID',file,id:item.id});
      const source=String(item.source??'').split('#')[0];
      if (source&&!path.isAbsolute(source)) item.__sourcePath=path.join(raiz,source);
    }
  }
  return {valid:errors.length===0,errors,manifests:manifests.length,records,ids};
}

export function buscar(manifests,id) { for (const {file,data} of manifests) for (const item of data.records??[]) if (item.id===id) return {manifest:data.manifestId,file,item}; return null; }
export function impacto(manifests,id) { const direct=[];for(const {data} of manifests)for(const item of data.records??[])if((item.references??[]).includes(id)||item.source===id)direct.push({id:item.id,manifest:data.manifestId,reason:'referencia directa'});return direct; }

export async function inicializar(directorio) {
  const root=path.resolve(directorio); const target=path.join(root,'.cobria'); await fs.mkdir(target,{recursive:true});
  const readme=path.join(root,'README.md');
  try { await fs.writeFile(readme,'# Proyecto COBRIA\n',{flag:'wx'}); } catch(error) { if(error.code!=='EEXIST') throw error; }
  const project=path.join(target,'project.yaml');
  const payload={schemaVersion:'1.0.0',manifestId:'project-local',generatedFrom:['README.md'],records:[{id:'PROJECT-LOCAL',source:'README.md',version:'0.1.0',owner:'POR-DEFINIR',references:['README.md'],data:{status:'proposed'}}]};
  try { await fs.writeFile(project,JSON.stringify(payload,null,2)+'\n',{flag:'wx'}); }
  catch(error) { if(error.code==='EEXIST') throw Object.assign(new Error('El proyecto ya está inicializado; no se sobrescribió.'),{code:'CLI_INIT_CONFLICT',exit:EXIT.CONFLICT}); throw error; }
  return project;
}
