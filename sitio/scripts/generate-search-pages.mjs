import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
const catalog = JSON.parse(fs.readFileSync(path.join(publicDir, 'catalogo.json'), 'utf8'));
const patterns = catalog.items ?? catalog;
const origin = 'https://cobria-atlas.sectagpt.chatgpt.site';
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

for (const [route, file] of [['recursos','recursos.html'],['core','core.html'],['core-1-1','core-1-1.html'],['core-1-2','core-1-2.html'],['caso','caso.html'],['rutas','rutas.html'],['errores','errores.html'],['decidir','decidir.html'],['historia','historia.html'],['privacidad','privacidad.html']]) {
  const target = path.join(publicDir, route);
  fs.mkdirSync(target, {recursive: true});
  const nested = fs.readFileSync(path.join(publicDir, file), 'utf8')
    .replaceAll('href="styles.css"', 'href="../styles.css"')
    .replaceAll('src="page.js"', 'src="../page.js"')
    .replaceAll('href="index.html', 'href="../index.html')
    .replaceAll('href="recursos.html"', 'href="/recursos"')
    .replaceAll('href="historia.html"', 'href="/historia"')
    .replaceAll('href="privacidad.html"', 'href="/privacidad"')
    .replaceAll('href="downloads/', 'href="../downloads/')
    .replaceAll('src="images/', 'src="../images/');
  fs.writeFileSync(path.join(target, 'index.html'), nested);
}

for (const pattern of patterns) {
  const route = `/patrones/${pattern.slug}`;
  const target = path.join(publicDir, 'patrones', pattern.slug);
  fs.mkdirSync(target, {recursive: true});
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${pattern.nombre}: patrón COBRIA para arquitectura NoSQL`,
    description: pattern.proposito,
    url: `${origin}${route}`,
    inLanguage: 'es',
    articleSection: pattern.familia,
    keywords: ['arquitectura de software','NoSQL',pattern.nombre,pattern.familia,'datos reconstruibles'],
    author: {'@type':'Person', name:'Billy Jak Cordero Porras'},
    isPartOf: {'@type':'WebSite', name:'COBRIA Arquitectura de Software', url:origin}
  };
  const related = (pattern.relaciones || []).map(name => `<li>${esc(name)}</li>`).join('');
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(pattern.nombre)} · Patrón COBRIA NoSQL</title><meta name="description" content="${esc(pattern.proposito)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${origin}${route}"><meta property="og:type" content="article"><meta property="og:url" content="${origin}${route}"><meta property="og:title" content="${esc(pattern.nombre)} · COBRIA"><meta property="og:description" content="${esc(pattern.proposito)}"><meta property="og:image" content="${origin}/og.png"><script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g,'\\u003c')}</script><link rel="stylesheet" href="../../styles.css"></head><body class="inner-page pattern-search-page"><header class="nav"><a class="brand" href="/">COBRIA <span>arquitectura de software</span></a><nav><a href="/#catalogo">Patrones</a><a href="/recursos">Recursos</a><a href="/historia">Historia</a></nav></header><main><nav class="breadcrumbs" aria-label="Ruta"><a href="/">Inicio</a><span>/</span><a href="/#catalogo">Patrones</a><span>/</span><strong>${esc(pattern.nombre)}</strong></nav><article class="search-article"><header><p class="eyebrow">${esc(pattern.familia)} · Patrón ${String(pattern.id).padStart(2,'0')}</p><h1>${esc(pattern.nombre)}</h1><p class="lead">${esc(pattern.proposito)}</p></header><aside class="ad-space ad-horizontal"><small>PUBLICIDAD</small><span>Unidad adaptable</span></aside><section><h2>Problema que resuelve</h2><p>${esc(pattern.problema)}</p></section><section class="search-callout"><h2>Analogía</h2><p>${esc(pattern.analogia)}</p></section><section><h2>Solución y contrato</h2><p>${esc(pattern.solucion)}</p><pre><code>${esc(pattern.contrato)}</code></pre></section><section><h2>Cuándo aplicarlo</h2><p>${esc(pattern.aplicacion)}</p></section><section class="exercise search-exercise"><div class="exercise-label">Práctica guiada</div><div><h2>Laboratorio</h2><p>${esc(pattern.ejercicio)}</p></div><ol><li>Prepare un caso válido.</li><li>Provoque un fallo controlado.</li><li>Conserve la evidencia.</li></ol></section><section><h2>Métricas y relaciones</h2><p>${esc(pattern.metricas)}</p><h3>Patrones relacionados</h3><ul>${related}</ul></section><aside class="ad-space ad-horizontal"><small>PUBLICIDAD</small><span>Unidad adaptable al cierre</span></aside><div class="search-actions"><a class="primary" href="/#catalogo">Abrir catálogo interactivo</a><a class="secondary" href="/recursos">Consultar recursos</a></div></article></main><footer><b>COBRIA</b><span>Arquitectura NoSQL reconstruible</span><nav><a href="/recursos">Recursos</a><a href="/privacidad">Privacidad</a></nav></footer><script src="../../page.js" defer></script><button class="back-top" id="back-top" type="button"><span>↑</span><b>Volver arriba</b></button></body></html>`;
  fs.writeFileSync(path.join(target, 'index.html'), html);
}

const staticRoutes = ['','fundamentos','capas','patrones-diseno','datos','api-ux','seguridad','calidad','operaciones','ia','construir','herramientas','engineering','evidencia','explorar','mapa','laboratorio','recursos','core','core-1-1','core-1-2','caso','rutas','errores','decidir','historia','privacidad'];
const urls = [...staticRoutes.map(route => `${origin}/${route}`), ...patterns.map(pattern => `${origin}/patrones/${pattern.slug}`)];
const today = new Date().toISOString().slice(0,10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log(`Generadas ${patterns.length} páginas de patrones, rutas limpias y sitemap.`);
