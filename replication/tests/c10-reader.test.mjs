import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizar,crearIndice,buscar} from '../../editorial/c10/search.mjs';
const root=new URL('../../',import.meta.url),read=file=>fs.readFileSync(new URL(file,root),'utf8'),json=file=>JSON.parse(read(file));
const curriculum=json('editorial/curriculum.json'),guide=json('editorial/c10/reader-guide.json'),catalog=json('sitio/public/catalogo.json');
const index=crearIndice(curriculum,catalog,guide);

test('C10 búsqueda equivale con tildes, espacios y mayúsculas',()=>{
  assert.equal(normalizar('  ÁMBITO '),'ambito');
  assert.deepEqual(buscar(index,'ÁMBITO'),buscar(index,'ambito'));assert.ok(buscar(index,'ambito').length);
  assert.deepEqual(buscar(index,'   '),index);assert.equal(buscar(index,'qzxj-no-existe').length,0);
});
test('C10 cinco talleres son localizables y enlazan sus fuentes reales',()=>{
  assert.equal(index.length,162);assert.equal(new Set(index.map(item=>`${item.kind}:${item.href}`)).size,index.length);
  assert.equal(buscar(index,'','Taller').length,5);
  assert.ok(buscar(index,'pouchdb disco','Taller').some(item=>item.href.includes('integral-c8')));
  assert.ok(buscar(index,'comentarios','Taller').some(item=>item.href.startsWith('/herramientas')));
  for(const w of guide.workshops){assert.ok(fs.existsSync(new URL(w.source,root)));const [route,anchor]=w.route.split('#');assert.ok(curriculum.modules.some(m=>m.route===route));assert.ok(anchor);}
});
test('C10 las cuatro rutas y diecisiete repasos cubren el currículo sin prometer ejecución total',()=>{
  assert.equal(guide.tracks.length,4);assert.equal(guide.reviews.length,17);assert.equal(new Set(guide.reviews.map(r=>r.key)).size,17);
  for(const track of guide.tracks)for(const key of track.keys)assert.ok(curriculum.modules.some(m=>m.key===key));
  for(const course of curriculum.modules){assert.ok(guide.reviews.some(r=>r.key===course.key&&r.question&&r.answer));for(const lesson of course.lessons)assert.ok(guide.codeLabels[lesson.codeKind]);}
  const map=json('editorial/content-map.json');for(const entry of map.modules)assert.equal(entry.route,curriculum.modules.find(m=>m.key===entry.key).route);
  assert.match(guide.codeNote,/no asuma/);
});
test('C10 libro ofrece código legible por lenguaje y repaso compartido',()=>{
  const html=read('libro-cobria/index.html');assert.equal((html.match(/class="book-page code-page"/g)||[]).length,33);
  assert.equal((html.match(/class="module-review"/g)||[]).length,17);assert.equal((html.match(/class="code-kind"/g)||[]).length,85);
  assert.ok(html.includes('id="guia-lectura"'));for(const r of guide.reviews)assert.ok(html.includes(r.question));
  const css=read('libro-cobria/theme.css');assert.match(css,/\.code-grid.single pre[^}]*font-size: 9pt/);assert.doesNotMatch(css,/font-size: 5\.2pt/);
  for(const match of html.matchAll(/<img[^>]*src="([^"]+)"/g))assert.ok(fs.existsSync(new URL(`libro-cobria/${match[1]}`,root)));
});
