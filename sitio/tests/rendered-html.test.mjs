import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const read = path => readFile(new URL(path, import.meta.url), "utf8");
const securityHeaders = ["content-security-policy","strict-transport-security","x-content-type-options","x-frame-options","referrer-policy","permissions-policy"];

test('EP1 ningún recurso construido excede el límite de Workers',async()=>{
  async function inspect(directory){
    for(const entry of await readdir(directory,{withFileTypes:true})){
      const file=new URL(entry.name+(entry.isDirectory()?'/':''),directory);
      assert.ok(!entry.isSymbolicLink(),`Recurso enlazado no permitido: ${file.pathname}`);
      if(entry.isDirectory())await inspect(file);
      else assert.ok((await stat(file)).size<=25*1024**2,`Recurso mayor a 25 MiB: ${file.pathname}`);
    }
  }
  await inspect(new URL('../dist/client/',import.meta.url));
});

async function loadWorker(label) {
  const workerUrl=new URL("../dist/server/index.js",import.meta.url);
  workerUrl.searchParams.set(label,`${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}
const env={ASSETS:{fetch:async request=>{const pathname=new URL(request.url).pathname.replace(/^\//,"");const mime=pathname.endsWith('.html')?'text/html; charset=utf-8':pathname.endsWith('.json')?'application/json':pathname.endsWith('.pdf')?'application/pdf':'application/octet-stream';try{return new Response(await readFile(new URL(`../public/${pathname}`,import.meta.url)),{status:200,headers:{"content-type":mime}})}catch{return new Response("Not found",{status:404})}}}};
const ctx={waitUntil(){},passThroughOnException(){}};

test('EP10 solo el contexto Node confiable puede delegar archivos sin ASSETS',async()=>{
  const worker=await loadWorker('ep10-assets');
  const request=new Request('https://cobria.test/fonts/Inter-400.ttf',{headers:{'x-vinext-host-runtime':'node'}});
  const missing=await worker.fetch(request,{},ctx);assert.equal(missing.status,503);
  const delegated=await worker.fetch(request,{}, {...ctx,hostRuntime:'node'});
  assert.equal(delegated.status,200);
  assert.equal(decodeURIComponent(delegated[Symbol.for('vinext.static-file-signal')]),'/fonts/Inter-400.ttf');
  for(const name of securityHeaders)assert.ok(delegated.headers.has(name));
  const manifest=await worker.fetch(new Request('https://cobria.test/downloads/manifest.json'),{}, {...ctx,hostRuntime:'node'});
  assert.equal(manifest.headers.get('cache-control'),'public, max-age=0, must-revalidate');
});

test('EP9 recursos enlaza seis lecturas y el Worker conserva sus formatos',async()=>{
  const worker=await loadWorker('ep9');
  const response=await worker.fetch(new Request('https://cobria.test/recursos'),env,ctx);
  assert.equal(response.status,200);const html=await response.text();
  for(const name of ['libro','cuaderno','anexo','articulo','maestro','especificacion']){
    assert.ok(html.includes(`/lecturas/${name}.html`),name);
    const reading=await worker.fetch(new Request(`https://cobria.test/lecturas/${name}.html`),env,ctx);
    assert.equal(reading.status,200);const body=await reading.text();
    assert.ok(body.includes('Saltar al contenido'));
    assert.ok(body.includes('Índice de esta lectura'));
    assert.equal((body.match(/<h1\b/g)||[]).length,1);
  }
  assert.ok(html.includes('sin certificación PDF/UA'));
  const manifest=await worker.fetch(new Request('https://cobria.test/lecturas/manifest.json'),env,ctx);
  assert.equal(manifest.status,200);const data=await manifest.json();
  assert.equal(data.items.length,6);assert.equal(data.screenReaderTested,false);
  assert.ok(!data.items.some(x=>x.id==='ciega'));
  const absent=await worker.fetch(new Request('https://cobria.test/lecturas/ciega.html'),env,ctx);
  assert.equal(absent.status,404);
});

test('EP7 sirve lecturas externas por área desde la bibliografía compartida',async()=>{
  const worker=await loadWorker('ep7');
  for(const [route,markers]of [['/datos',['Fuentes para entender y contrastar','Managing Schema Evolution','prepublicacion']],['/ia',['Leakage and the Reproducibility Crisis','Kapoor','doble cribado independiente']],['/calidad',['norma-ficha','ISO/IEC 25010']]]){
    const response=await worker.fetch(new Request('https://cobria.test'+route),env,ctx);assert.equal(response.status,200);const html=await response.text();for(const marker of markers)assert.ok(html.includes(marker),route+': '+marker);
  }
});

test('EP5 la guía, las lecciones y el mapa comparten recorrido y progreso voluntario',async()=>{
  const worker=await loadWorker('ep5');
  for(const [route,markers] of [
    ['/comenzar',['Tu cuaderno de lectura','Continúa a tu ritmo','no una evaluación']],
    ['/aprender/inicio/1',['Marcar como leída','Conectar con el libro y el proyecto','/comenzar/proyecto-integral']],
    ['/mapa',['El libro, la web y el mismo proyecto','Ejercicio de diseño','Ejemplo ejecutable']],
    ['/privacidad',['Marcas de lectura y laboratorios','almacenamiento está bloqueado']]
  ]){const response=await worker.fetch(new Request('https://cobria.test'+route),env,ctx);assert.equal(response.status,200);const html=await response.text();for(const marker of markers)assert.ok(html.includes(marker),`${route}: ${marker}`);}
});

test('EP4 publica instrucciones, responsabilidades, solución y código completo',async()=>{
  const worker=await loadWorker('ep4');
  const response=await worker.fetch(new Request('https://cobria.test/comenzar/proyecto-integral'),env,ctx);
  assert.equal(response.status,200);
  const html=await response.text();
  for(const text of ['Ejercicio y solución verificable','Límites de adopción','Consultar el código real','registrar-durable.mjs']){
    assert.ok(html.includes(text),text);
  }
  assert.ok(html.includes('recorrido-ep4.mjs'));
  const inicio=await worker.fetch(new Request('https://cobria.test/comenzar'),env,ctx);
  assert.ok((await inicio.text()).includes('/comenzar/proyecto-integral'));
});

test('EP3 las diecisiete áreas publican su caso desarrollado y solución',async()=>{
  const worker=await loadWorker('ep3');
  const curriculum=JSON.parse(await read('../../editorial/curriculum.json'));
  for(const area of curriculum.modules){
    const response=await worker.fetch(new Request(`https://cobria.test${area.route}`),env,ctx);
    assert.equal(response.status,200);const html=await response.text();
    assert.ok(html.includes('id="caso-desarrollado"'),area.key);
    assert.ok(html.includes('<summary>Consultar la solución del caso</summary>'),area.key);
    assert.ok(html.includes('Caso adverso y recuperación'),area.key);
    if(area.key==='patrones'){
      assert.ok(html.includes('Revisión de las treinta fichas especializadas'));
      assert.ok(html.includes('Auditoría narrativa reconstruible'));
      assert.ok(html.includes('Factory Method'));
    }
  }
});

test('EP2 el taller desde cero contiene diez cambios, fallos y soluciones',async()=>{
  const worker=await loadWorker('ep2');
  const response=await worker.fetch(new Request('https://cobria.test/comenzar/desde-cero'),env,ctx);
  assert.equal(response.status,200);const html=await response.text();
  for(let number=1;number<=10;number++)assert.ok(html.includes(`id="unidad-${String(number).padStart(2,'0')}"`));
  assert.equal((html.match(/<summary>Ver la solución razonada<\/summary>/g)||[]).length,10);
  assert.equal((html.match(/<h3>Provocar y reparar un fallo<\/h3>/g)||[]).length,10);
  for(const text of ['taller-inicial/09-error.mjs','OBS_QUANTITY_INVALID','IDEMPOTENCY_CONFLICT','sesión confiable','node --test --test-reporter=tap'])assert.ok(html.includes(text),text);
  const start=await worker.fetch(new Request('https://cobria.test/comenzar'),env,ctx);
  assert.match(await start.text(),/href="\/comenzar\/desde-cero"/);
});

test('PC7 glosario compartido y fuentes sin descarga durante la construcción',async()=>{
  const worker=await loadWorker('pc7');
  const response=await worker.fetch(new Request('http://localhost/mapa',{headers:{accept:'text/html'}}),env,ctx);
  assert.equal(response.status,200);const html=(await response.text()).replace(/<!--[\s\S]*?-->/g,'');
  const glossary=JSON.parse(await read('../../editorial/glossary.json'));
  for(const [term,definition] of glossary){assert.ok(html.includes(term));assert.ok(html.includes(definition));}
  assert.doesNotMatch(await read('../app/layout.tsx'),/next\/font\/google/);
});

test('PC6 las 85 lecciones publican su ejercicio y solución propios',async()=>{
  const worker=await loadWorker('pc6');
  const curriculum=JSON.parse(await read('../../editorial/curriculum.json'));
  for(const course of curriculum.modules)for(const [i,lesson] of course.lessons.entries()){
    const response=await worker.fetch(new Request(`http://localhost/aprender/${course.key}/${i+1}`,{headers:{accept:'text/html'}}),env,ctx);
    assert.equal(response.status,200);
    const html=(await response.text()).replace(/<!--[\s\S]*?-->/g,'');
    for(const text of ['Ahora inténtelo','Ver solución explicada','Revise su entrega',lesson.practice.exercise,lesson.practice.solution])assert.ok(html.includes(text),`${course.key}/${i+1}: ${text}`);
    const decoded=html.replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
    for(const value of [lesson.title,lesson.situation,lesson.simple,lesson.example,lesson.mistake,lesson.evidence,lesson.code,...lesson.steps,lesson.practice.recovery])assert.ok(decoded.includes(value),`${course.key}/${i+1}: ${value}`);
  }
});

test('PC1 distingue candidatas y propuestas de efectos persistidos en las fichas',async()=>{
  const worker=await loadWorker('pc1');
  for(const [slug,expected] of [
    ['reconstruccion-total','equivalenciaVerificada'],
    ['publicacion-por-version','activaPropuesta'],
    ['cola-de-salida-transaccional','planCommit'],
    ['retiro-de-proyeccion','retiro-propuesto']
  ]){
    const response=await worker.fetch(new Request(`http://localhost/patrones/${slug}`,{headers:{accept:'text/html'}}),env,ctx);
    assert.equal(response.status,200);
    const html=await response.text();
    assert.ok(html.includes(expected),slug);
    assert.ok(html.includes('regresiones PC1'),slug);
    assert.ok(!html.includes('61 pruebas aprobadas'),slug);
  }
});

test('C10 recorrido, repaso y tipo de fragmento son visibles en el manual y las lecciones',async()=>{
  const worker=await loadWorker('c10-reader');
  const curriculum=JSON.parse(await read('../../editorial/curriculum.json'));
  const reading=JSON.parse(await read('../../editorial/c10/reader-guide.json'));
  for(const course of curriculum.modules){
    const response=await worker.fetch(new Request(`https://cobria.test${course.route}`,{headers:{accept:'text/html'}}),env,ctx);
    assert.equal(response.status,200);const html=(await response.text()).replace(/<!--[\s\S]*?-->/g,'');
    for(const marker of ['En esta parte','id="repaso"','Antes de continuar','Comparar con una respuesta orientativa',reading.codeLabels[course.lessons[0].codeKind]])assert.ok(html.includes(marker),`${course.key}: ${marker}`);
    if(course.key==='inicio')assert.ok(html.includes('Cómo avanzar sin perderse'));
    const lesson=await worker.fetch(new Request(`https://cobria.test/aprender/${course.key}/1`,{headers:{accept:'text/html'}}),env,ctx);
    assert.equal(lesson.status,200);assert.ok((await lesson.text()).includes('Repasar esta parte'));
  }
});

test('C9 conecta documentación y herramientas con simulación y límites',async()=>{
  const worker=await loadWorker('c9-documentation');
  for(const courseKey of ['documentacion','herramientas']){
    const response=await worker.fetch(new Request(`https://cobria.test/${courseKey}`,{headers:{accept:'text/html'}}),env,ctx);
    assert.equal(response.status,200);const html=(await response.text()).replace(/<!--[\s\S]*?-->/g,'');
    for(const marker of ['Documentar y generar sin perder el control','recorrido.mjs','no implementan automáticamente reglas de negocio','ADR-C8-AGREGADO-LOCAL.md','RECUPERACION-C8.md'])assert.ok(html.includes(marker),`${courseKey}: ${marker}`);
  }
});

test('C8 explica integración documental real sin ejecutar un motor en el sitio',async()=>{
  const worker=await loadWorker('c8-integral');
  const response=await worker.fetch(new Request('https://cobria.test/construir',{headers:{accept:'text/html'}}),env,ctx);
  assert.equal(response.status,200);
  const html=(await response.text()).replace(/<!--[\s\S]*?-->/g,'');
  for(const marker of ['El cuaderno que permanece','PouchDB','LevelDB real','1000 documentos','No prueba caída eléctrica','33-aplicacion-integral-neutral.md'])assert.ok(html.includes(marker),marker);
});

test("C7 enseña cortes, abstención y desaciertos sin atribuir calidad de IA",async()=>{
  const worker=await loadWorker('c7');const r=await worker.fetch(new Request('http://localhost/ia',{headers:{accept:'text/html'}}),env,ctx);
  const html=(await r.text()).replace(/<!--[\s\S]*?-->/g,'');assert.equal(r.status,200);
  for(const text of ['Analizar sin mezclar y responder con procedencia','analitica-c7','Doce pruebas locales','no un modelo entrenado','falso positivo y falso negativo','no representa consentimiento real'])assert.ok(html.includes(text),text);
});

test("C6 refleja recuperación y medición acotadas en calidad y operaciones",async()=>{
  const worker=await loadWorker('c6');
  for(const route of ['/calidad','/operaciones']){
    const r=await worker.fetch(new Request(`http://localhost${route}`,{headers:{accept:'text/html'}}),env,ctx);
    const html=(await r.text()).replace(/<!--[\s\S]*?-->/g,'');
    assert.equal(r.status,200);
    for(const text of ['Detectar, medir y recuperar sin improvisar','operacion-c6','Quince pruebas locales','no autentica al autor','no una estimación fiable']) assert.ok(html.includes(text),`${route}: ${text}`);
  }
});

test("C5 refleja el taller local y sus límites en API y seguridad", async () => {
  const worker=await loadWorker("c5");
  for(const route of ['/api-ux','/seguridad']){
    const r=await worker.fetch(new Request(`http://localhost${route}`,{headers:{accept:'text/html'}}),env,ctx);
    const html=(await r.text()).replace(/<!--[\s\S]*?-->/g,'');
    assert.equal(r.status,200);
    for(const text of ['Del formulario al permiso comprobado','api-ux-c5','4096 bytes','sesiones DEMO no sustituyen','Doce pruebas HTTP']) assert.ok(html.includes(text),`${route}: ${text}`);
  }
});

test("C4 enlaza ejemplos, entradas, decisiones y límites en cada ficha renderizada", async () => {
  const worker = await loadWorker("c4");
  const catalog = JSON.parse(await read("../public/pattern-catalog.json"));
  for (const item of catalog.items) {
    const response = await worker.fetch(new Request(`http://localhost/patrones/${item.slug}`, {headers:{accept:"text/html"}}), env, ctx);
    const html = (await response.text()).replace(/<!--[\s\S]*?-->/g, '');
    assert.equal(response.status, 200, item.slug);
    for (const text of ['Ejemplo ejecutable', 'Entrada conforme y resultado esperado', 'Entrada adversa y rechazo o abstención esperados', 'Alternativa más sencilla', 'Cuándo no usarlo', 'Límite de esta demostración', 'patterns-r4']) assert.ok(html.includes(text), `${item.slug}: ${text}`);
  }
});

test("C1 muestra directorio, comando, resultado y práctica en módulo y lección", async () => {
  const worker=await loadWorker("c1");
  for(const route of ["/comenzar","/aprender/inicio/4","/aprender/fundamentos/1"]){
    const response=await worker.fetch(new Request(`http://localhost${route}`,{headers:{accept:"text/html"}}),env,ctx);
    const html=await response.text();
    assert.equal(response.status,200,route);
    assert.match(html,/Práctica verificable/);
    assert.match(html,/raíz de COBRIA/);
    assert.match(html,/Resultado esperado/);
    if(route.includes("inicio/4"))assert.match(html,/OBS_QUANTITY_INVALID/);
  }
});

test("la publicación conserva un sitio, 25 rutas editoriales, 85 lecciones y 30 fichas", async () => {
  const [sitemap,pattern,robots,archive]=await Promise.all([read("../public/sitemap.xml"),read("../public/patrones/objeto-canonico/index.html"),read("../public/robots.txt"),read("../public/archivo/index.html")]);
  assert.equal((sitemap.match(/<url>/g)||[]).length,141);
  assert.match(sitemap,/\/comenzar\/desde-cero<\/loc>/);
  for(const route of ["comenzar","arquitectura","codigo","documentacion"]) assert.match(sitemap,new RegExp(`/${route}</loc>`));
  for(const obsolete of ["core-1-1","core-1-2","caso","rutas","errores","decidir","archivo","engineering"]) assert.doesNotMatch(sitemap,new RegExp(`/${obsolete}`));
  assert.match(sitemap,/\/aprender\/inicio\/1<\/loc>/);
  assert.match(pattern,/application\/ld\+json/); assert.match(pattern,/<h1>Objeto canónico<\/h1>/); assert.match(pattern,/data-copy="contrato"/); assert.match(pattern,/guía de software/);
  assert.match(robots,/Disallow: \/archivo\//); assert.match(archive,/noindex,nofollow/); assert.match(archive,/Archivo histórico/);
  await assert.rejects(access(new URL("../public/index.html",import.meta.url)));
});

test("cada descarga publicada coincide con el manifiesto SHA-256", async () => {
  const [manifest,canonical]=await Promise.all([read("../public/downloads/manifest.json"),read("../public/cobria-canonical.json")].map(async value=>JSON.parse(await value)));
  assert.equal(manifest.items.length,6); assert.equal(manifest.version,canonical.identity.ecosystemVersion); assert.equal(manifest.publicationDate,canonical.release.candidateDate);
  for(const item of manifest.items){const data=await readFile(new URL(`../public${item.href}`,import.meta.url));assert.equal(data.length,item.bytes);assert.equal(createHash("sha256").update(data).digest("hex"),item.sha256);assert.match(item.source,/^output\/pdf\//)}
});

test('EP1 el Worker sirve manifiesto y PDF con huellas, tipo y seguridad',async()=>{
  const worker=await loadWorker('ep1-assets');
  const response=await worker.fetch(new Request('https://cobria.test/downloads/manifest.json'),env,ctx);
  assert.equal(response.status,200);assert.match(response.headers.get('content-type'),/application\/json/);
  assert.equal(response.headers.get('cache-control'),'public, max-age=0, must-revalidate');
  const manifest=await response.json();
  for(const doc of manifest.items){
    const result=await worker.fetch(new Request('https://cobria.test'+doc.href),env,ctx);
    assert.equal(result.status,200);assert.match(result.headers.get('content-type'),/application\/pdf/);
    for(const header of securityHeaders)assert.ok(result.headers.has(header));
    const bytes=Buffer.from(await result.arrayBuffer());assert.equal(bytes.length,doc.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),doc.sha256);
  }
  const redirect=await worker.fetch(new Request('https://cobria.test/downloads/COBRIA-tesis.pdf'),env,ctx);
  assert.equal(redirect.status,308);assert.equal(new URL(redirect.headers.get('location')).pathname,'/downloads/COBRIA-documento-maestro.pdf');
  const missing=await worker.fetch(new Request('https://cobria.test/downloads/no-existe.pdf'),env,ctx);
  assert.equal(missing.status,404);assert.ok(missing.headers.has('x-content-type-options'));
});

test('EP1 un index heredado en ASSETS no sustituye la portada de la aplicación',async()=>{
  const worker=await loadWorker('ep1-shadow');
  const hostile={ASSETS:{fetch:async()=>new Response('<h1>PORTADA-HEREDADA</h1>',{headers:{'content-type':'text/html'}})}};
  const response=await worker.fetch(new Request('https://cobria.test/'),hostile,ctx);
  const html=await response.text();assert.equal(response.status,200);
  assert.doesNotMatch(html,/PORTADA-HEREDADA/);assert.match(html,/Diecisiete partes/);
  assert.equal(response.headers.get('cache-control'),'no-cache');
});

test('EP1 la configuración construida exige Worker antes de ASSETS',async()=>{
  const config=JSON.parse(await read('../dist/server/wrangler.json'));
  assert.equal(config.assets.binding,'ASSETS');
  assert.equal(config.assets.run_worker_first,true);
  assert.equal(config.assets.html_handling,'none');
  assert.equal(config.assets.not_found_handling,'none');
  await access(new URL('../dist/server/'+config.main,import.meta.url));
});

test("la aplicación renderizada conserva identidad, navegación y estado candidato", async () => {
  const worker=await loadWorker("identity");
  for(const route of ["/","/comenzar","/fundamentos","/arquitectura","/codigo","/documentacion","/explorar","/mapa","/laboratorio","/recursos","/historia","/privacidad"]){const response=await worker.fetch(new Request(`http://localhost${route}`,{headers:{accept:"text/html"}}),env,ctx);const html=await response.text();assert.equal(response.status,200,route);assert.match(html,/<html lang="es"/);assert.match(html,/COBRIA/);for(const header of securityHeaders)assert.ok(response.headers.has(header),`${route}: ${header}`)}
  const resources=await worker.fetch(new Request("http://localhost/recursos",{headers:{accept:"text/html"}}),env,ctx);const html=await resources.text();const canonical=JSON.parse(await read("../public/cobria-canonical.json"));assert.match(html,new RegExp(canonical.identity.ecosystemVersion.replaceAll(".","\\.")));assert.match(html,/candidata no estable/i);assert.match(html,/SHA-256/);assert.match(html,/Autoridad y límites/);assert.doesNotMatch(html,/versión estable publicada/i);
});

test("la web refleja el currículo completo sin duplicar su fuente", async () => {
  const pedagogy=JSON.parse(await read("../../editorial/curriculum.json"));
  assert.equal(pedagogy.modules.length,17); assert.equal(pedagogy.lessonCount,85); assert.equal(pedagogy.labs.length,30);
  for(const item of pedagogy.modules) assert.ok(item.lessons.length>=5,`${item.key}: ${item.lessons.length} lecciones`);
  const worker=await loadWorker("pedagogy");
  const home=await (await worker.fetch(new Request("http://localhost/",{headers:{accept:"text/html"}}),env,ctx)).text();
  for(const item of pedagogy.modules){assert.match(home,new RegExp(item.title.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")),item.key)}
  assert.match(home,/No necesitas ser ingeniero en sistemas/);
});

test("las rutas heredadas redirigen y no se publican como páginas paralelas", async () => {
  const worker=await loadWorker("redirects");
  const expected={"/core-1-1":"/core","/core-1-2":"/core","/caso":"/construir","/rutas":"/mapa","/errores":"/calidad","/decidir":"/laboratorio","/engineering":"/construir"};
  for(const [from,to] of Object.entries(expected)){const response=await worker.fetch(new Request(`https://example.test${from}`),env,ctx);assert.equal(response.status,308);assert.equal(new URL(response.headers.get("location")).pathname,to);for(const header of securityHeaders)assert.ok(response.headers.has(header))}
});

test("las prácticas de operación se leen y se encuentran desde sus módulos", async () => {
  const curriculum = JSON.parse(await read("../../editorial/curriculum.json"));
  const worker = await loadWorker("operation-practices");
  const html = await (await worker.fetch(new Request("http://localhost/construir", {headers:{accept:"text/html"}}), env, ctx)).text();
  for (const practice of curriculum.practices) {
    assert.ok(html.includes(`id="practica-${practice.id.toLowerCase()}"`), practice.id);
    assert.ok(html.includes(practice.title), practice.title);
    assert.ok(html.includes(practice.limit), `Límite de ${practice.id}`);
  }
  const data = await (await worker.fetch(new Request("http://localhost/datos", {headers:{accept:"text/html"}}), env, ctx)).text();
  assert.match(data,/\/construir#practica-op05/);
  const search = await (await worker.fetch(new Request("http://localhost/explorar", {headers:{accept:"text/html"}}), env, ctx)).text();
  assert.ok(search.includes("Una caché con ámbito, permisos y vencimiento"));
});

test("las fichas y el archivo se sirven mediante sus rutas limpias", async () => {
  const worker=await loadWorker("static-clean-routes");
  const pattern=await worker.fetch(new Request("https://example.test/patrones/objeto-canonico"),env,ctx);const patternHtml=await pattern.text();assert.equal(pattern.status,200);assert.match(patternHtml,/<main id="contenido">/);assert.match(patternHtml,/Copiar/);
  const archive=await worker.fetch(new Request("https://example.test/archivo"),env,ctx);assert.equal(archive.status,200);assert.equal(archive.headers.get("x-robots-tag"),"noindex, nofollow");
});

test("los estilos conservan tipografía, foco, movimiento reducido y navegación móvil", async () => {
  const [css,manual]=await Promise.all([read("../app/globals.css"),read("../app/manual.css")]);
  assert.match(css,/var\(--font-geist-sans\)/); assert.doesNotMatch(`${css}${manual}`,/Iowan Old Style|Palatino Linotype/); assert.match(css,/:focus-visible/); assert.match(css,/prefers-reduced-motion/); assert.match(css,/min-height:44px/);
});

test("las normas se presentan por área sin atribuir certificación", async () => {
  const worker = await loadWorker("standards");
  const html = await (await worker.fetch(new Request("https://cobria.test/calidad"), env, ctx)).text();
  assert.match(html, /Normas y guías para esta área/);
  assert.match(html, /ISO\/IEC 25010:2023/);
  assert.match(html, /no certificación ni evaluación de cláusulas/);
  assert.match(html, /https:\/\/www.iso.org\/standard\/78176.html/);
  const security = await (await worker.fetch(new Request("https://cobria.test/seguridad"), env, ctx)).text();
  assert.match(security, /ISO\/IEC 27701:2025/);
  assert.match(security, /Evidencia esperada/);
});
test("el caso conductor, roles de apoyo y migración llegan al HTML de las lecciones", async () => {
  const worker = await loadWorker("closure23");
  for (const [route, markers] of [
    ["/fundamentos", ["observación", "Contrato y evidencia"]],
    ["/aprender/capas/3", ["Catalog, Indexer y Connector", "protocolo", "autoridad"]],
    ["/aprender/datos/5", ["Migrar documentos sin detener el mundo", "idempotente", "reversión"]],
  ]) {
    const response = await worker.fetch(new Request(`https://cobria.test${route}`), env, ctx);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    for (const marker of markers) assert.ok(html.includes(marker), `${route}: ${marker}`);
  }
});

test("el paquete no conserva configuración SQLite o D1 activa", async () => {
  const [pkg,vite]=await Promise.all([read("../package.json"),read("../vite.config.ts")]);
  assert.doesNotMatch(`${pkg}${vite}`,/sqlite|drizzle|\bD1\b/i);
});

test('C2 muestra el diccionario y cinco prácticas verificables sin atribuir integración remota', async()=>{
  const worker=await loadWorker('c2-data');
  for(const route of ['/datos',...Array.from({length:5},(_,index)=>`/aprender/datos/${index+1}`)]){
    const response=await worker.fetch(new Request(`https://cobria.test${route}`,{headers:{accept:'text/html'}}),env,ctx);
    assert.equal(response.status,200,route);
    const html=await response.text();
    for(const marker of ['Práctica verificable','datos-c2.test.mjs','Resultado esperado'])assert.ok(html.includes(marker),`${route}: ${marker}`);
    if(route==='/datos'||route==='/aprender/datos/1'){
      for(const marker of ['Diccionario del caso de la reserva','catalogoVersion','2026.2','no crea nodos remotos ni índices'])assert.ok(html.includes(marker),marker);
      assert.match(html,/<caption>/);
    }
  }
});

test('C3 muestra el mapa de responsabilidades y diez prácticas del mismo caso',async()=>{
  const worker=await loadWorker('c3-layers');
  const architecture=JSON.parse(await read('../../replication/examples/ecosistema-app/data/arquitectura.json'));
  for(const courseKey of ['arquitectura','capas']){
    const overview=await worker.fetch(new Request(`https://cobria.test/${courseKey}`,{headers:{accept:'text/html'}}),env,ctx);
    assert.equal(overview.status,200);
    const html=await overview.text();
    const visibleText=html.replace(/<!--[\s\S]*?-->/g,'');
    for(const text of ['El recorrido y sus responsabilidades','Cinco responsabilidades, no cinco servidores',
      `${architecture.files.length} archivos`,'no hay garantía de exactamente una vez','capas-c3.test.mjs'])assert.ok(visibleText.includes(text),`${courseKey}: ${text}`);
    for(let number=1;number<=5;number++){
      const response=await worker.fetch(new Request(`https://cobria.test/aprender/${courseKey}/${number}`,{headers:{accept:'text/html'}}),env,ctx);
      assert.equal(response.status,200);const lesson=await response.text();
      for(const marker of ['Práctica verificable','capas-c3.test.mjs','Resultado esperado'])assert.ok(lesson.includes(marker),`${courseKey}/${number}: ${marker}`);
    }
  }
});
