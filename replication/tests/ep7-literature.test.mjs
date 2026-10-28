import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {readBib,root,parseBib} from '../../editorial/ep7/bib.mjs';
import {buildEp7,validateSelection,checkIdentity,bibliographyHtml} from '../../editorial/ep7/build.mjs';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const selection=JSON.parse(read('editorial/ep7/selection.json'));
test('EP7 verifica derivados sin red ni modificación de fuentes',()=>{
  const r=buildEp7({check:true});assert.equal(r.references.length,46);assert.equal(r.systematicReviewComplete,false);assert.equal(Object.keys(r.moduleSources).length,17);assert.equal(r.comparisons.length,6);
});
test('EP7 conserva la identidad bibliográfica corregida',()=>{
  const b=readBib();const find=id=>b.find(x=>x.id===id);
  assert.equal(find('aulbach2009flexibleschemas').doi,'10.1145/1559845.1559941');assert.match(find('aulbach2009flexibleschemas').author,/Seibold/);
  assert.equal(find('ni2014adaptiveschema').doi,'10.1109/TKDE.2013.94');assert.match(find('ni2014adaptiveschema').author,/Ni, Jiacai/);assert.equal(find('yaish2014adaptiveschema'),undefined);
  assert.match(find('li2023featurestore').author,/Li, Anya/);assert.equal(find('scherzinger2013schema').type,'misc');assert.match(find('roa2015iso25000').note,/difiere/);
});
test('EP7 rechaza claves y DOI duplicados o referencias faltantes',()=>{
  const b=readBib();assert.throws(()=>validateSelection(selection,[...b,b[0]]),/duplicada/);
  assert.throws(()=>validateSelection({...selection,moduleSources:{...selection.moduleSources,datos:['ausente']}},b),/ausente/);
  const clone=structuredClone(b);clone[0].doi=clone.find(r=>r.doi).doi;assert.throws(()=>validateSelection(selection,clone),/DOI duplicado/);
});
test('EP7 detecta un DOI resoluble de otro título',()=>{
  const row=readBib().find(x=>x.id==='ni2014adaptiveschema');assert.throws(()=>checkIdentity(row,{doi:{ok:true,metadata:{title:['Spatially Aware Term Selection for Geotagging']}}}),/divergentes/);
});
test('EP7 no inventa doble cribado ni confunde documentos técnicos con normas',()=>{
  assert.throws(()=>validateSelection({...selection,independentScreeners:2},readBib()),/cribado/);
  const r=buildEp7({check:true});assert.equal(r.references.find(x=>x.id==='iso25010_2023').kind,'norma-ficha');assert.equal(r.references.find(x=>x.id==='li2023featurestore').kind,'prepublicacion');assert.equal(r.references.find(x=>x.id==='roa2015iso25000').kind,'publicacion-academica');
});
test('EP7 libro y web consumen el mismo corpus sin bibliografía copiada',()=>{
  assert.match(read('libro-cobria/build-book.mjs'),/bibliographyHtml\(literature\)/);assert.match(read('sitio/app/topic-references.tsx'),/editorial\/ep7\/references.json/);assert.match(read('sitio/app/manual.tsx'),/<TopicReferences kind=\{kind\}/);
  const html=bibliographyHtml(buildEp7({check:true}));assert.equal((html.match(/id="ref-/g)||[]).length,46);assert.match(html,/no se ha completado una revisión sistemática/);
});
test('EP7 analizador de BibTeX conserva llaves internas y autores corporativos',()=>{
  const r=parseBib('@book{a, author={{W3C}}, title={T{é}cnica}, year={2020}, url={https://example.test}}');assert.equal(r[0].author,'{W3C}');assert.equal(r[0].title,'T{é}cnica');
});
test('EP7 procedencia incluye originales, copias, fuentes y límites de IA',()=>{
  const p=JSON.parse(read('editorial/ep7/provenance-audit.json'));assert.ok(p.assets.length>=20);assert.ok(p.fonts.length>=16);assert.ok(p.assets.some(x=>x.generationReceipt==='no-acreditado-por-este-inventario'));assert.ok(p.limits.some(x=>x.includes('no peritaje legal')));
});
