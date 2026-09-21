import fs from 'node:fs/promises';
import path from 'node:path';
import { EXIT } from './toolkit.mjs';

export const GENERATOR_TYPES=Object.freeze(['proyecto','modulo','entidad','valor','caso-uso','puerto','adaptador','dater','nodo','catalogo','function','evento','adr','prueba','runbook']);
const TYPE_LABELS=Object.freeze({'proyecto':'Proyecto','modulo':'Módulo','entidad':'Entidad','valor':'Objeto de valor','caso-uso':'Caso de uso','puerto':'Puerto','adaptador':'Adaptador','dater':'Dater','nodo':'Nodo','catalogo':'Catálogo','function':'Function','evento':'Evento','adr':'ADR','prueba':'Prueba','runbook':'Runbook'});

function slugify(value){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function pascal(value){return value.split('-').map(x=>x.charAt(0).toUpperCase()+x.slice(1)).join('');}

function artifacts(type,name,root){
  if(!GENERATOR_TYPES.includes(type))throw Object.assign(new Error(`Tipo no soportado: ${type}`),{code:'CLI_GENERATOR_TYPE_INVALID',exit:EXIT.USAGE});
  if(!/^[\p{L}\p{N} _-]{2,80}$/u.test(name??''))throw Object.assign(new Error('El nombre solo admite letras, números, espacios, guion y guion bajo (2–80 caracteres).'),{code:'CLI_GENERATOR_NAME_INVALID',exit:EXIT.USAGE});
  const slug=slugify(name??'');
  const key=`${type}-${slug}`;const symbol=pascal(slug);const label=TYPE_LABELS[type];
  const code=`/** ${label} generado por COBRIA. Complete el contrato sin añadir dependencias de proveedor. */\nexport const definition = Object.freeze({ id: '${key}', type: '${type}', name: ${JSON.stringify(name)}, version: '0.1.0' });\n\nexport class ${symbol} {\n  constructor(dependencies = {}) { this.dependencies = Object.freeze({ ...dependencies }); }\n  execute(input) { if (input == null) throw new Error('INPUT_REQUIRED'); return { accepted: true, input }; }\n}\n`;
  const test=`import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { definition, ${symbol} } from '../../src/generated/${key}.mjs';\n\ntest('${key} conserva identidad y rechaza entrada ausente', () => {\n  assert.equal(definition.id, '${key}');\n  const subject = new ${symbol}();\n  assert.throws(() => subject.execute(null), /INPUT_REQUIRED/);\n  assert.equal(subject.execute({ id: 'ejemplo' }).accepted, true);\n});\n`;
  const doc=`# ${label}: ${name}\n\n**ID:** \`${key}\`  \n**Versión:** 0.1.0  \n**Estado:** propuesto  \n**Responsable:** POR-DEFINIR\n\n## Propósito\n\nDescriba el problema observable y por qué este artefacto es necesario.\n\n## Contrato\n\nDeclare entrada, precondiciones, salida, errores, ámbito, evidencia y límites.\n\n## Criterios de aceptación\n\n- [ ] caso permitido probado;\n- [ ] caso negativo probado;\n- [ ] dependencias y consecuencias documentadas.\n`;
  const refs=[`src/generated/${key}.mjs`,`test/generated/${key}.test.mjs`,`docs/generated/${key}.md`];
  const manifest=JSON.stringify({schemaVersion:'1.0.0',id:key,type,name,version:'0.1.0',owner:'POR-DEFINIR',status:'proposed',artifacts:refs,generatedBy:'cobria-toolkit-phase-13'},null,2)+'\n';
  return [
    [path.join(root,refs[0]),code],[path.join(root,refs[1]),test],[path.join(root,refs[2]),doc],
    [path.join(root,'.cobria/generated',`${key}.json`),manifest]
  ];
}

export async function generate({type,name,directory}){
  const root=path.resolve(directory);const planned=artifacts(type,name,root);const conflicts=[];const created=[];const unchanged=[];
  for(const [file,content] of planned){const existing=await fs.readFile(file,'utf8').catch(error=>error.code==='ENOENT'?null:Promise.reject(error));if(existing===null)continue;if(existing===content)unchanged.push(path.relative(root,file));else conflicts.push(path.relative(root,file));}
  if(conflicts.length)throw Object.assign(new Error(`No se sobrescribieron archivos divergentes: ${conflicts.join(', ')}`),{code:'CLI_GENERATOR_CONFLICT',exit:EXIT.CONFLICT,conflicts});
  for(const [file,content] of planned){if(unchanged.includes(path.relative(root,file)))continue;await fs.mkdir(path.dirname(file),{recursive:true});try{await fs.writeFile(file,content,{flag:'wx'});created.push(path.relative(root,file));}catch(error){if(error.code==='EEXIST')throw Object.assign(new Error(`Conflicto concurrente: ${path.relative(root,file)}`),{code:'CLI_GENERATOR_CONFLICT',exit:EXIT.CONFLICT});throw error;}}
  return {type,name,root,created,unchanged,status:created.length?'generated':'unchanged'};
}
