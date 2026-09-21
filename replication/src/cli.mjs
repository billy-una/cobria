#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { LokiJsAdapter } from './adapters/lokijs-adapter.mjs';
import { PouchDbAdapter } from './adapters/pouchdb-adapter.mjs';
import { runConformance } from './conformance.mjs';
import { EXIT, cargarManifiestos, validarManifiestos, buscar, impacto, inicializar } from './toolkit.mjs';
import { generate, GENERATOR_TYPES } from './generator.mjs';
import { auditProject, analyzeFileImpact } from './auditor.mjs';

const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const HELP=`COBRIA Toolkit — ayuda

Uso: cobria <comando> [opciones]

  init       Inicializa .cobria/project.yaml sin sobrescribir
  validar    Valida estructura e IDs de manifiestos
  explicar   Explica un concepto por --id
  contexto   Devuelve concepto, fuente y referencias
  impacto    Lista conceptos afectados por un ID
  auditar    Busca duplicados y contratos inválidos
  medir      Resume manifiestos, conceptos y estados
  verificar  Ejecuta conformidad Core de un adaptador
  generar    Genera código, prueba, documento y manifiesto
  informar   Genera un informe local HTML y JSON
  publicar   Solo prepara un plan con --simular; nunca despliega

Alias: iniciar equivale a init

Opciones comunes: --ruta, --raiz, --id, --json, --ayuda
Generar: --tipo ${GENERATOR_TYPES.join('|')} --nombre NOMBRE --directorio RUTA
Auditar código: --codigo RUTA
Impacto de archivo: --archivo RUTA --raiz PROYECTO
Verificar: --adaptador lokijs|pouchdb|archivo --salida directorio --tamano 1000`;

function parse(argv){const first=argv[0];const raw=first?.startsWith('--')?undefined:first;const command=raw==='iniciar'?'init':raw;const o={command,adapter:'lokijs',output:'cobria-informe',root:REPO,json:false,simulate:false,help:first==='--ayuda'||first==='-h'};for(let i=o.command?1:0;i<argv.length;i++){const a=argv[i];if(a==='--json')o.json=true;else if(a==='--simular')o.simulate=true;else if(a==='--ayuda'||a==='-h')o.help=true;else if(a==='--adaptador')o.adapter=argv[++i];else if(a==='--salida')o.output=argv[++i];else if(a==='--tamano')o.size=Number(argv[++i]);else if(a==='--ruta')o.route=argv[++i];else if(a==='--raiz')o.root=path.resolve(argv[++i]);else if(a==='--id')o.id=argv[++i];else if(a==='--directorio')o.directory=argv[++i];else if(a==='--tipo')o.type=argv[++i];else if(a==='--nombre')o.name=argv[++i];else if(a==='--codigo')o.codePath=argv[++i];else if(a==='--archivo')o.file=argv[++i];else if(a==='--ambiente')o.environment=argv[++i];else if(a==='--artefacto')o.artifact=argv[++i];else throw Object.assign(new Error(`Opción desconocida: ${a}`),{code:'CLI_OPTION_UNKNOWN',exit:EXIT.USAGE});}return o;}
function emit(value,json){if(json)console.log(JSON.stringify(value,null,2));else if(typeof value==='string')console.log(value);else console.log(Object.entries(value).map(([k,v])=>`${k}: ${typeof v==='object'?JSON.stringify(v):v}`).join('\n'));}
function fail(error,json){const body={ok:false,code:error.code??'CLI_INTERNAL_ERROR',message:error.message};if(json)console.error(JSON.stringify(body));else console.error(`${body.code}: ${body.message}`);process.exitCode=error.exit??EXIT.INVALID;}
async function adapterOf(value){if(value==='lokijs')return new LokiJsAdapter();if(value==='pouchdb')return new PouchDbAdapter();const url=value.startsWith('file:')?value:pathToFileURL(path.resolve(value)).href;const loaded=await import(url);if(typeof loaded.crearAdaptador==='function')return loaded.crearAdaptador();if(loaded.default&&typeof loaded.default==='function')return new loaded.default();throw new Error('El módulo debe exportar crearAdaptador() o una clase predeterminada.');}
function profileOf(r){if(!r.P1.pass||!r.S1.pass)return'NO CONFORME';if(!r.P2.pass||!r.R1.pass)return'C1 FUNCIONAL';if(!r.A1.pass)return'C2 FUNCIONAL';return'C3 FUNCIONAL';}

let options;try{options=parse(process.argv.slice(2));}catch(e){fail(e,process.argv.includes('--json'));}
if(options){
  try{
    if(options.help||!options.command){emit(HELP,options.json);process.exitCode=options.help?0:EXIT.USAGE;}
    else if(options.command==='init'){emit({ok:true,path:await inicializar(options.directory??process.cwd())},options.json);}
    else if(options.command==='generar'){if(!options.type||!options.name)throw Object.assign(new Error('generar requiere --tipo y --nombre.'),{code:'CLI_GENERATOR_ARGUMENT_REQUIRED',exit:EXIT.USAGE});emit({ok:true,...await generate({type:options.type,name:options.name,directory:options.directory??process.cwd()})},options.json);}
    else if(options.command==='publicar'){
      if(!options.simulate)throw Object.assign(new Error('publicar solo está disponible con --simular; no se realizó ningún despliegue.'),{code:'CLI_PUBLISH_SIMULATION_REQUIRED',exit:EXIT.USAGE});
      if(!['preview','staging','production'].includes(options.environment)||!/^sha256:[a-f0-9]{64}$/.test(options.artifact??''))throw Object.assign(new Error('La simulación requiere --ambiente preview|staging|production y --artefacto sha256:<64 hex>.'),{code:'CLI_PUBLISH_ARGUMENT_INVALID',exit:EXIT.USAGE});
      emit({ok:true,mode:'simulation',mutations:0,environment:options.environment,artifact:options.artifact,checks:['cuenta','variables','reglas','pruebas','humo','rollback'],limitations:['No desplegó, no usó credenciales y no valida el proveedor.']},options.json);
    }
    else if(options.command==='informar'){
      const route=path.resolve(options.route??path.join(options.root,'specification/phase-11'));const manifests=await cargarManifiestos(route);const validation=validarManifiestos(manifests,options.root);const report={ok:validation.valid,scope:'auditoría documental local',generatedAt:new Date().toISOString(),manifests:validation.manifests,records:validation.records,errors:validation.errors,limitations:['No es revisión humana ni certificación.']};const output=path.resolve(options.output);await fs.mkdir(output,{recursive:true});await fs.writeFile(path.join(output,'informe.json'),JSON.stringify(report,null,2));const rows=validation.errors.map(error=>`<li><code>${String(error.code)}</code></li>`).join('')||'<li>Sin errores estructurales.</li>';await fs.writeFile(path.join(output,'informe.html'),`<!doctype html><html lang="es"><meta charset="utf-8"><title>Informe COBRIA</title><main><h1>Informe COBRIA</h1><p>Alcance: auditoría documental local; no es certificación.</p><p>Manifiestos: ${validation.manifests}. Registros: ${validation.records}.</p><ul>${rows}</ul></main></html>`);emit({ok:validation.valid,output,files:['informe.json','informe.html']},options.json);if(!validation.valid)process.exitCode=EXIT.INVALID;
    }
    else if(options.command==='auditar'&&options.codePath){const report=await auditProject(options.codePath);emit({ok:report.passed,...report},options.json);if(!report.passed)process.exitCode=EXIT.INVALID;}
    else if(options.command==='impacto'&&options.file){emit({ok:true,...await analyzeFileImpact(options.root,options.file)},options.json);}
    else if(['validar','auditar','medir','explicar','contexto','impacto'].includes(options.command)){
      const route=path.resolve(options.route??path.join(options.root,'specification/phase-11'));const manifests=await cargarManifiestos(route);const validation=validarManifiestos(manifests,options.root);
      if(options.command==='validar'||options.command==='auditar'){emit({ok:validation.valid,manifests:validation.manifests,records:validation.records,errors:validation.errors},options.json);if(!validation.valid)process.exitCode=EXIT.INVALID;}
      else if(options.command==='medir'){const statuses={};for(const {data} of manifests)for(const r of data.records??[]){const s=r.data?.status??'sin-estado';statuses[s]=(statuses[s]??0)+1;}emit({ok:true,manifests:validation.manifests,records:validation.records,statuses},options.json);}
      else {if(!options.id)throw Object.assign(new Error('El comando requiere --id.'),{code:'CLI_ID_REQUIRED',exit:EXIT.USAGE});const found=buscar(manifests,options.id);if(!found)throw Object.assign(new Error(`No existe el concepto ${options.id}.`),{code:'CLI_CONCEPT_NOT_FOUND',exit:EXIT.NOT_FOUND});if(options.command==='explicar')emit({ok:true,id:found.item.id,owner:found.item.owner,source:found.item.source,summary:found.item.data},options.json);else if(options.command==='contexto')emit({ok:true,concept:found.item,manifest:found.manifest,references:found.item.references},options.json);else emit({ok:true,id:options.id,affected:impacto(manifests,options.id)},options.json);}
    } else if(options.command==='verificar'){
      let adapter;try{adapter=await adapterOf(options.adapter);const result=await runConformance(adapter,{engine:options.adapter,size:options.size||1000});const profile=profileOf(result);const report={specification:'COBRIA Core 1.0',scope:'conformidad funcional del arnés local',generatedAt:new Date().toISOString(),adapter:options.adapter,profile,tests:Object.fromEntries(['P1','P2','R1','S1','A1'].map(n=>[n,result[n]])),limitations:['No sustituye auditoría independiente.','C3 funcional no demuestra seguridad operativa en producción.','El perfil describe únicamente este adaptador, configuración y ejecución.']};await fs.mkdir(options.output,{recursive:true});await fs.writeFile(path.join(options.output,'informe.json'),JSON.stringify(report,null,2));await fs.writeFile(path.join(options.output,'informe.md'),`# Informe COBRIA Core 1.0\n\nAdaptador: **${options.adapter}**\n\nResultado: **${profile}**\n\nAlcance: conformidad funcional del arnés local; no constituye certificación independiente.\n`);emit({ok:profile!=='NO CONFORME',profile,output:path.resolve(options.output)},options.json);if(profile==='NO CONFORME')process.exitCode=EXIT.INVALID;}finally{if(adapter?.close)await adapter.close();}
    } else throw Object.assign(new Error(`Comando desconocido: ${options.command}`),{code:'CLI_COMMAND_UNKNOWN',exit:EXIT.USAGE});
  }catch(error){fail(error,options.json);}
}
