import fs from 'node:fs/promises';
import path from 'node:path';
const IGNORED = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.wrangler', 'phase18-transfer']);
async function walk(root) { const out=[]; async function visit(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){if(IGNORED.has(entry.name))continue;const item=path.join(dir,entry.name);if(entry.isDirectory())await visit(item);else out.push(item);}} await visit(root); return out; }
function finding(rule,file,line,message,remediation){return{rule,severity:rule==='AUD-007'?'high':'medium',file,line,message,remediation};}
const lineOf=(text,index)=>text.slice(0,index).split('\n').length;
const negativeFixture=relative=>relative.startsWith('replication/fixtures/')||relative.includes('/replication/fixtures/')||/specification\/[^/]+\/examples\/invalid[-/]/.test(relative);

export async function auditProject(rootValue){
  const root=path.resolve(rootValue), files=await walk(root), findings=[];
  for(const file of files){
    const rel=path.relative(root,file), lower=rel.toLowerCase(), ext=path.extname(file);
    if(negativeFixture(lower)||!['.mjs','.js','.ts','.tsx','.json','.md'].includes(ext))continue;
    const text=await fs.readFile(file,'utf8');
    if(['.mjs','.js','.ts','.tsx'].includes(ext)){
      const imports=[...text.matchAll(/(?:import\s+[^'"\n]*from\s*|import\s*\(|require\s*\()\s*['"]([^'"]+)['"]/g)];
      for(const match of imports){
        const spec=match[1];
        if(lower.includes('/domain/')&&(spec.includes('infrastructure')||spec.includes('presentation')))findings.push(finding('AUD-001',rel,lineOf(text,match.index),'Dominio depende de una capa externa.','Invierta la dependencia mediante un puerto.'));
        if(lower.includes('/application/')&&(spec.includes('infrastructure')||spec.includes('presentation')))findings.push(finding('AUD-001',rel,lineOf(text,match.index),'Aplicación depende de infraestructura o presentación.','Declare un puerto y conecte en composición.'));
        if(/^(mongodb|firebase|firebase-admin|pouchdb|@opensearch-project\/)/.test(spec)&&/(domain|application|presentation)/.test(lower))findings.push(finding('AUD-003',rel,lineOf(text,match.index),`Acceso directo al proveedor ${spec}.`,'Mueva el SDK a infraestructura.'));
      }
      if(!lower.includes('dater')&&!lower.includes('/infrastructure/')&&!lower.includes('/adapters/'))for(const match of text.matchAll(/\b(?:documento|doc|registro)\.([a-h])\b/g))findings.push(finding('AUD-002',rel,lineOf(text,match.index),`Clave física ${match[1]} fuera de un Dater.`,'Traduzca la clave en un Dater versionado.'));
      if(lower.includes('functions/')&&!lower.endsWith('.test.mjs')){
        const config=file.replace(/\.(?:mjs|js|ts|tsx)$/,'.config.json');let value=null;try{value=JSON.parse(await fs.readFile(config,'utf8'));}catch{}
        const required=['memoryMiB','timeoutSeconds','concurrency','maxInstances'];
        if(!value||required.some(key=>!Number.isFinite(value[key])||value[key]<=0))findings.push(finding('AUD-004',rel,1,'Function sin límites completos.','Añada configuración de memoria, timeout, concurrencia e instancias.'));
      }
    }
    if(ext==='.json'){
      let data;try{data=JSON.parse(text);}catch{continue;}
      if(path.basename(lower).includes('catalog')&&data.version===undefined&&data.catalogVersion===undefined)findings.push(finding('AUD-005',rel,1,'Catálogo sin versión.','Declare version o catalogVersion.'));
      const inspect=(value,pointer='$')=>{if(Array.isArray(value)){if(pointer.endsWith('.permissions')&&value.includes('*'))findings.push(finding('AUD-006',rel,1,'Permiso comodín detectado.','Enumere capacidades mínimas.'));value.forEach((item,index)=>inspect(item,`${pointer}[${index}]`));}else if(value&&typeof value==='object')for(const[key,item]of Object.entries(value))inspect(item,`${pointer}.${key}`);};inspect(data);
    }
    if(ext==='.md'&&path.basename(lower).includes('requisitos')){
      const headings=[...text.matchAll(/^###\s+([A-Z][A-Z0-9-]+)[^\n]*$/gm)];
      for(let index=0;index<headings.length;index+=1){const section=headings[index],body=text.slice(section.index+section[0].length,headings[index+1]?.index??text.length);if(!/\*\*Prueba:\*\*/.test(body))findings.push(finding('AUD-007',rel,lineOf(text,section.index),`Requisito ${section[1]} sin prueba declarada.`,'Añada **Prueba:** con gate o estado planificado.'));}
    }
  }
  return{root,filesScanned:files.length,findings,passed:findings.length===0};
}

export async function analyzeFileImpact(rootValue,fileValue){const root=path.resolve(rootValue),target=path.resolve(root,fileValue),files=(await walk(root)).filter(file=>/\.(mjs|js|ts|tsx)$/.test(file)),affected=[];for(const file of files){const text=await fs.readFile(file,'utf8');for(const match of text.matchAll(/from\s+['"]([^'"]+)['"]/g)){if(!match[1].startsWith('.'))continue;const base=path.resolve(path.dirname(file),match[1]);if([base,`${base}.mjs`,`${base}.js`,`${base}.ts`,path.join(base,'index.mjs')].includes(target)){affected.push({file:path.relative(root,file),line:lineOf(text,match.index),reason:'importa el archivo'});break;}}}return{target:path.relative(root,target),affected};}
