import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {admitted,curriculumStats,inspectRemote} from '../scripts/capture-ep0.mjs';

test('EP0 excluye escapes, secretos conocidos, dependencias y salidas',()=>{
  for(const name of ['../fuera','/fuera','a\\b','sitio/.env.local','a/.npmrc','a/token.key','output/review/a.json','build/a.pdf','a/node_modules/x'])assert.equal(Boolean(admitted(name)),false,name);
  assert.equal(admitted('editorial/data-lessons.json'),true);
});
test('EP0 describe cobertura sin convertir diseño en fallo',()=>{
  const result=curriculumStats({modules:[{lessons:[{situation:'Un problema',simple:'Una explicación',example:'Un ejemplo',steps:['Un paso'],execution:null}]}]});
  assert.equal(result.withExecution,0);assert.equal(result.withoutExecution,1);assert.match(result.interpretation,/no evaluación/);
});
test('EP0 conserva 404, no guarda cookies ni interpreta fallo de red como éxito',async()=>{
  const result=await inspectRemote('https://example.invalid/',{fetcher:async()=>new Response('ausente',{status:404,headers:{'set-cookie':'no guardar','content-type':'text/plain'}})});
  assert.equal(result.status,404);assert.equal(result.bytes,7);assert.equal(result.headers['set-cookie'],undefined);
  const failed=await inspectRemote('https://example.invalid/',{fetcher:async()=>{throw Error('sin red');}});
  assert.equal(failed.status,null);assert.equal(failed.error,'sin red');
});
test('EP0 impone límite de captura',async()=>{
  const result=await inspectRemote('https://example.invalid/',{maxBytes:2,fetcher:async()=>new Response('grande')});
  assert.equal(result.status,null);assert.match(result.error,/límite/);
});
test('EP0 enlaza todas las incidencias y conserva la decisión humana sin autorización de despliegue',()=>{
  const root=path.resolve(import.meta.dirname,'../..');
  const issues=JSON.parse(fs.readFileSync(path.join(root,'editorial/ep0/incidencias.json'))).issues;
  const ids=new Set(issues.map(x=>x.id));assert.equal(ids.size,20);
  for(const issue of issues){for(const key of ['product','priority','phase','owner','location','finding','impact','action','acceptance','evidence','status'])assert.ok(issue[key],issue.id+':'+key);
    for(const dependency of issue.dependsOn)assert.ok(ids.has(dependency)||/^EP\d+$/.test(dependency));}
  const scope=JSON.parse(fs.readFileSync(path.join(root,'editorial/ep0/alcance.json')));
  assert.equal(scope.deliveryTarget,'candidata-educativa-y-preprint');assert.equal(scope.deploymentAuthorized,false);assert.equal(scope.stablePromotionAuthorized,false);
  const products=JSON.parse(fs.readFileSync(path.join(root,'editorial/ep0/productos.json'))).products;
  for(const product of products){assert.ok(product.checks.length);assert.ok(product.gaps.length);assert.ok(product.invalidatedBy.length);
    for(const source of product.sources)assert.ok(fs.existsSync(path.join(root,source)),source);}
});
