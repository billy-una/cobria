import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildEp3,areaHtml,patternReviewHtml} from '../../editorial/ep3/build.mjs';
import {chapters} from '../../editorial/ep3/chapters.mjs';
const root=new URL('../../',import.meta.url);
const data=buildEp3();
test('EP3 conserva las diecisiete áreas del currículo y desarrolla criterios por área',()=>{
  const curriculum=JSON.parse(fs.readFileSync(new URL('editorial/curriculum.json',root)));
  assert.deepEqual(data.areas.map(area=>area.key),curriculum.modules.map(area=>area.key));
  assert.equal(new Set(chapters.map(area=>area.exercise)).size,17);
  for(const area of data.areas){
    for(const field of ['problem','prerequisites','alternative','cost','adverse','recovery','exercise','solution','next'])assert.ok(area[field]?.trim(),`${area.key}/${field}`);
    assert.ok(area.reasoning.length>=2);assert.equal(area.vocabulary.length,3);assert.equal(area.rubric.length,3);
    assert.match(areaHtml(area),new RegExp(`area-desarrollada-${area.key}`));
  }
});
test('EP3 distingue programas y artefactos sin inventar comandos de evaluación',()=>{
  assert.equal(data.areas.filter(area=>area.command).length,13);
  assert.equal(data.areas.filter(area=>!area.command).length,4);
  for(const area of data.areas){
    if(area.command){assert.match(area.command,/^node replication\/examples\/ecosistema-app\/taller-areas\/ejecutar.mjs [a-z]+$/);assert.ok(area.expected);}
    else{assert.ok(area.artifact);assert.equal(area.codeSource,null);}
  }
});
test('EP3 revisa treinta fichas y cuatro entradas con categorías y procedencia distintas',()=>{
  assert.deepEqual(data.patternReview.map(item=>item.id),Array.from({length:30},(_,index)=>index+1));
  assert.equal(data.entryPatterns.length,4);
  for(const item of data.patternReview){
    assert.ok(item.originalType);assert.ok(item.reason);assert.ok(item.exampleSources.length);
    for(const source of item.exampleSources)assert.ok(fs.existsSync(new URL(source.source,root)));
  }
  assert.equal(data.patternReview[29].category,'experimental');
  assert.equal(data.entryPatterns[3].category,'convención');
  assert.match(patternReviewHtml(data),/ni declaración de novedad/);
});
test('EP3 la publicación web y el libro consumen la misma fuente desarrollada',()=>{
  const site=fs.readFileSync(new URL('sitio/app/area-workshop.tsx',root),'utf8');
  const book=fs.readFileSync(new URL('libro-cobria/build-book.mjs',root),'utf8');
  assert.match(site,/ep3\/areas.json/);assert.match(book,/areaHtml\(worked\)/);
  for(const area of data.areas)assert.ok(fs.existsSync(new URL(`manuales/areas/${area.key}.md`,root)));
});
test('EP3 las treinta fichas conservan contexto, fuerzas, código, fallo, costo y alternativa',()=>{
  const catalog=JSON.parse(fs.readFileSync(new URL('sitio/public/pattern-catalog.json',root)));
  const examples=JSON.parse(fs.readFileSync(new URL('libro-cobria/practical-examples.json',root)));
  for(const item of catalog.items){
    for(const field of ['contexto','fuerzas','cuandoUsar','cuandoEvitar','codigo','casoNegativo','consecuencias','procedencia'])assert.ok(item[field],`${item.id}/${field}`);
    const example=examples.find(value=>value.id===item.id);
    assert.ok(example.costo);assert.ok(example.pruebaPositiva);assert.ok(example.pruebaNegativa);assert.ok(item.decision.alternativa);
  }
});
