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

/**
 * Comprueba la envoltura y campos básicos sin modificar las entradas.
 * @param {Array<{file:string,data:unknown}>} manifests Documentos ya interpretados.
 * @param {string} raiz Parámetro conservado por compatibilidad; no resuelve referencias.
 * @returns {{valid:boolean,errors:Array,manifests:number,records:number,ids:Map}}
 * No escribe archivos ni sustituye la validación completa de JSON Schema.
 */
export function validarManifiestos(manifests, raiz) {
  const errors=[]; const ids=new Map(); let records=0;
  for (const {file,data} of manifests) {
    if (!data || typeof data!=='object' || data.schemaVersion!=='1.0.0'||!data.manifestId||!Array.isArray(data.records)) {errors.push({code:'CLI_MANIFEST_ENVELOPE_INVALID',file});continue;}
    for (const item of data.records) {
      records++;
      if(!item || typeof item!=='object' || Array.isArray(item)){errors.push({code:'CLI_RECORD_FIELD_REQUIRED',file,field:'record'});continue;}
      for (const field of ['id','source','version','owner']) if(typeof item[field]!=='string'||!item[field].trim())errors.push({code:'CLI_RECORD_FIELD_REQUIRED',file,id:item.id,field});
      if(!Array.isArray(item.references)||!item.references.length||!item.references.every(ref=>typeof ref==='string'&&ref.trim()))errors.push({code:'CLI_RECORD_FIELD_REQUIRED',file,id:item.id,field:'references'});
      if(!item.data||typeof item.data!=='object'||Array.isArray(item.data))errors.push({code:'CLI_RECORD_FIELD_REQUIRED',file,id:item.id,field:'data'});
      if (ids.has(item.id)) errors.push({code:'CLI_ID_DUPLICATED',file,id:item.id,first:ids.get(item.id)}); else ids.set(item.id,file);
      if (!/^\d+\.\d+\.\d+$/.test(item.version??'')) errors.push({code:'CLI_VERSION_INVALID',file,id:item.id});
    }
  }
  return {valid:errors.length===0,errors,manifests:manifests.length,records,ids};
}

export function buscar(manifests,id) { for (const {file,data} of manifests) for (const item of data.records??[]) if (item.id===id) return {manifest:data.manifestId,file,item}; return null; }
export function impacto(manifests,id) { const direct=[];for(const {data} of manifests)for(const item of data.records??[])if((item.references??[]).includes(id)||item.source===id)direct.push({id:item.id,manifest:data.manifestId,reason:'referencia directa'});return direct; }

export async function inicializar(directorio) {
  const root=path.resolve(directorio); const target=path.join(root,'.cobria');
  await comprobarDestino(root,[path.join(root,'README.md'),path.join(target,'project.yaml')]);
  if(await fs.lstat(path.join(target,'project.yaml')).catch(error=>{if(error.code==='ENOENT')return null;throw error;}))throw Object.assign(new Error('El proyecto ya está inicializado; no se sobrescribió.'),{code:'CLI_INIT_CONFLICT',exit:EXIT.CONFLICT});
  await fs.mkdir(target,{recursive:true});
  const readme=path.join(root,'README.md');
  try { await fs.writeFile(readme,'# Proyecto COBRIA\n',{flag:'wx'}); } catch(error) { if(error.code!=='EEXIST') throw error; }
  const project=path.join(target,'project.yaml');
  const payload={schemaVersion:'1.0.0',manifestId:'project-local',generatedFrom:['README.md'],records:[{id:'PROJECT-LOCAL',source:'README.md',version:'0.1.0',owner:'POR-DEFINIR',references:['README.md'],data:{status:'proposed'}}]};
  try { await fs.writeFile(project,JSON.stringify(payload,null,2)+'\n',{flag:'wx'}); }
  catch(error) { if(error.code==='EEXIST') throw Object.assign(new Error('El proyecto ya está inicializado; no se sobrescribió.'),{code:'CLI_INIT_CONFLICT',exit:EXIT.CONFLICT}); throw error; }
  return project;
}

/**
 * Inspecciona raíz y rutas internas antes de una escritura local.
 * @param {string} root Raíz absoluta autorizada por quien invoca la herramienta.
 * @param {string[]} files Rutas absolutas que se planea escribir bajo esa raíz.
 * @returns {Promise<void>} Sin efectos de escritura; repetir solo vuelve a inspeccionar.
 * @throws {Error} CLI_DESTINATION_UNSAFE ante enlace detectado o ruta no admisible.
 * No inspecciona la semántica del contenido ni elimina carreras TOCTOU: otro proceso
 * podría cambiar las rutas después de la comprobación. Use destinos propios y aislados.
 */
export async function comprobarDestino(root,files){
  const paths=new Set([root]);
  for(const file of files){
    const relative=path.relative(root,file);
    if(relative.startsWith('..')||path.isAbsolute(relative))throw Object.assign(new Error('Destino fuera de la raíz.'),{code:'CLI_DESTINATION_UNSAFE',exit:EXIT.CONFLICT});
    let current=root;
    for(const part of relative.split(path.sep)){current=path.join(current,part);paths.add(current);}
  }
  for(const target of paths){
    const stat=await fs.lstat(target).catch(error=>{if(error.code==='ENOENT')return null;throw error;});
    if(stat?.isSymbolicLink())throw Object.assign(new Error('El destino contiene un enlace simbólico; no se escribió.'),{code:'CLI_DESTINATION_UNSAFE',exit:EXIT.CONFLICT});
    if(stat && target!==root && !files.includes(target) && !stat.isDirectory())throw Object.assign(new Error('Un directorio del destino es un archivo.'),{code:'CLI_DESTINATION_UNSAFE',exit:EXIT.CONFLICT});
  }
}
