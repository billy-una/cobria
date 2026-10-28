import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root=fileURLToPath(new URL('../../',import.meta.url));
const app=path.join(root,'replication/examples/ecosistema-app');
const layerIds={domain:'LAY-DOMAIN',application:'LAY-APPLICATION',presentation:'LAY-PRESENTATION',infrastructure:'LAY-INFRASTRUCTURE',composition:'LAY-COMPOSITION'};
const layerOf=filename=>layerIds[filename.split('/')[0]]??'LAY-COMPOSITION';

// Analiza sintaxis, no ejecuta fuentes. Recibe fuentes virtuales para probar rechazos
// sin introducir dependencias deliberadamente inválidas dentro de la aplicación.
export function analyzeArchitecture(sources, policy, resources=new Set()) {
  const errors=[],edges=[];
  const allowed=new Map(policy.layers.map(layer=>[layer.id,new Set(layer.mayDependOn)]));
  for(const [filename,content] of Object.entries(sources)){
    const source=ts.createSourceFile(filename,content,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
    const layer=layerOf(filename);
    const report=(code,node,detail)=>errors.push({code,file:filename,line:source.getLineAndCharacterOfPosition(node.getStart(source)).line+1,detail});
    for(const diagnostic of source.parseDiagnostics)errors.push({code:'C3_PARSE',file:filename,detail:ts.flattenDiagnosticMessageText(diagnostic.messageText,' ')});
    function dependency(specifier,node){
      if(!specifier.startsWith('.')){
        if(['LAY-DOMAIN','LAY-APPLICATION'].includes(layer))report('C3_EXTERNAL_IMPORT',node,specifier);
        return;
      }
      const target=path.posix.normalize(path.posix.join(path.posix.dirname(filename),specifier));
      if(resources.has(target)){
        if(!['LAY-INFRASTRUCTURE','LAY-COMPOSITION'].includes(layer))report('C3_RESOURCE_IMPORT',node,target);
        return;
      }
      if(!Object.hasOwn(sources,target)){report('C3_MISSING_IMPORT',node,target);return;}
      edges.push({from:filename,to:target});
      if(!allowed.get(layer)?.has(layerOf(target)))report('C3_LAYER_IMPORT',node,target);
    }
    function visit(node){
      if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier){
        if(ts.isStringLiteralLike(node.moduleSpecifier))dependency(node.moduleSpecifier.text,node);
      }
      if(ts.isCallExpression(node)&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||
        (ts.isIdentifier(node.expression)&&node.expression.text==='require'))){
        const argument=node.arguments[0];
        const importEstatico = argument&&ts.isStringLiteralLike(argument)&&
          (node.expression.kind===ts.SyntaxKind.ImportKeyword ? node.arguments.length<=2 : node.arguments.length===1);
        if(importEstatico)dependency(argument.text,node);
        else report('C3_DYNAMIC_IMPORT',node,'Dependencia calculada: requiere revisión explícita');
      }
      if(['LAY-DOMAIN','LAY-APPLICATION'].includes(layer)&&ts.isPropertyAccessExpression(node)&&
        ts.isIdentifier(node.expression)&&node.expression.text==='process'&&node.name.text==='env'){
        report('C3_ENVIRONMENT',node,'Entorno leído desde el núcleo');
      }
      ts.forEachChild(node,visit);
    }
    visit(source);
  }
  const adjacency=new Map(Object.keys(sources).map(file=>[file,[]]));
  for(const edge of edges)adjacency.get(edge.from).push(edge.to);
  const visiting=new Set(),visited=new Set();
  function walk(file,trail){
    if(visiting.has(file)){errors.push({code:'C3_CYCLE',file,detail:[...trail,file].join(' -> ')});return;}
    if(visited.has(file))return;
    visiting.add(file);for(const target of adjacency.get(file)??[])walk(target,[...trail,file]);
    visiting.delete(file);visited.add(file);
  }
  for(const file of Object.keys(sources))walk(file,[]);
  return {files:Object.keys(sources).length,edges,errors,passed:errors.length===0,
    limits:['Control estático de importaciones y lecturas directas process.env; no prueba semántica de negocio, reflexión, globals o seguridad completa.',
      'Dependencias calculadas se rechazan para revisión, no se resuelven ni se ejecutan.']};
}

export function auditProject(){
  const sources={};
  function collect(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    const filename=path.join(directory,entry.name);
    if(entry.isSymbolicLink())throw new Error('El auditor no sigue enlaces simbólicos');
    if(entry.isDirectory())collect(filename);
    else if(entry.name.endsWith('.mjs'))sources[path.relative(path.join(app,'src'),filename).split(path.sep).join('/')]=fs.readFileSync(filename,'utf8');
  }}
  collect(path.join(app,'src'));
  const policy=JSON.parse(fs.readFileSync(path.join(root,'specification/phase-5/architecture.yaml')));
  const resources=new Set(fs.readdirSync(path.join(app,'data')).filter(name=>name.endsWith('.json')).map(name=>`../data/${name}`));
  return analyzeArchitecture(sources,policy,resources);
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const report=auditProject();console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
}
