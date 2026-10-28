import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const catalog = JSON.parse(fs.readFileSync(path.join(publicDir, "catalogo.json"), "utf8"));
const canonical = JSON.parse(fs.readFileSync(path.join(publicDir, "cobria-canonical.json"), "utf8"));
const curriculum = JSON.parse(fs.readFileSync(path.join(root, "..", "editorial", "curriculum.json"), "utf8"));
const patterns = catalog.items ?? catalog;
const enriched = JSON.parse(fs.readFileSync(path.join(publicDir, "pattern-catalog.json"), "utf8"));
const origin = "https://cobria-atlas.sectagpt.chatgpt.site";
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

// EP1: no destruir archivos encontrados ni volver a servir prototipos por accidente.
// Si reaparecen, detener la construcción y revisar su archivo histórico explícitamente.
const legacyFiles = ["index.html","recursos.html","core.html","core-1-1.html","core-1-2.html","caso.html","rutas.html","errores.html","decidir.html","historia.html","privacidad.html","styles.css","app.js","page.js"];
const legacyDirectories = ["recursos","core","core-1-1","core-1-2","caso","rutas","errores","decidir","historia","privacidad"];
const conflicts = [...legacyFiles, ...legacyDirectories].filter(name => fs.existsSync(path.join(publicDir, name)));
if (conflicts.length) throw new Error(`Rutas heredadas en public; conservar y revisar antes de construir: ${conflicts.join(', ')}`);
const {buildParity}=await import('../../editorial/ep5/build.mjs');
buildParity();

const archiveDir = path.join(publicDir, "archivo");
fs.mkdirSync(archiveDir, {recursive:true});
fs.writeFileSync(path.join(archiveDir, "index.html"), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Archivo histórico · COBRIA</title><link rel="stylesheet" href="/patterns.css"></head><body><header class="nav"><a class="brand" href="/">COBRIA <span>guía de software</span></a></header><main class="page"><p class="eyebrow">Contenido retirado · no indexable</p><h1>Archivo histórico</h1><p class="lead">Esta área conserva únicamente materiales que dejaron de ser canónicos. No representa el estado vigente de COBRIA, no debe citarse como especificación y puede contener vocabulario o versiones superadas.</p><p><a class="button" href="/recursos">Abrir los recursos canónicos verificables</a></p></main></body></html>`);

for (const pattern of patterns) {
  const route = `/patrones/${pattern.slug}`;
  const target = path.join(publicDir, "patrones", pattern.slug);
  fs.mkdirSync(target, {recursive:true});
  const jsonLd = {"@context":"https://schema.org","@type":"TechArticle",headline:`${pattern.nombre}: patrón COBRIA`,description:pattern.proposito,url:`${origin}${route}`,inLanguage:"es-CR",articleSection:pattern.familia,keywords:["patrones de diseño","NoSQL",pattern.nombre,pattern.familia,"software verificable"],author:{"@type":"Person",name:canonical.identity.author},isPartOf:{"@type":"WebSite",name:canonical.titles.site,url:origin},version:canonical.identity.ecosystemVersion};
  const related = (pattern.relaciones || []).map(name => {const match=patterns.find(p=>p.nombre===name);return `<li>${match?`<a href="/patrones/${match.slug}">${esc(name)}</a>`:esc(name)}</li>`;}).join("");
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(pattern.nombre)} · Patrón COBRIA</title><meta name="description" content="${esc(pattern.proposito)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${origin}${route}"><meta property="og:type" content="article"><meta property="og:url" content="${origin}${route}"><meta property="og:title" content="${esc(pattern.nombre)} · COBRIA"><meta property="og:description" content="${esc(pattern.proposito)}"><meta property="og:image" content="${origin}/og.png"><script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g,"\\u003c")}</script><link rel="stylesheet" href="/patterns.css"></head><body><a class="skip" href="#contenido">Saltar al contenido</a><header class="nav"><a class="brand" href="/">COBRIA <span>guía de software</span></a><nav aria-label="Navegación principal"><a href="/comenzar">Guía</a><a href="/explorar">Patrones</a><a href="/mapa">Mapa</a><a href="/laboratorio">Laboratorio</a><a href="/recursos">Recursos</a></nav></header><main class="page" id="contenido"><nav class="breadcrumbs" aria-label="Ruta"><a href="/">Inicio</a><span>/</span><a href="/explorar">Patrones</a><span>/</span><strong>${esc(pattern.nombre)}</strong></nav><article><header><p class="eyebrow">${esc(pattern.familia)} · Patrón ${String(pattern.id).padStart(2,"0")}</p><h1>${esc(pattern.nombre)}</h1><p class="lead">${esc(pattern.proposito)}</p></header><section><h2>Problema que resuelve</h2><p>${esc(pattern.problema)}</p></section><aside><h2>Analogía</h2><p>${esc(pattern.analogia)}</p></aside><section><h2>Solución y contrato</h2><p>${esc(pattern.solucion)}</p><div class="code"><button type="button" data-copy="contrato">Copiar código</button><pre id="contrato"><code>${esc(pattern.contrato)}</code></pre></div></section><section><h2>Cuándo aplicarlo</h2><p>${esc(pattern.aplicacion)}</p></section><section><h2>Práctica guiada</h2><p>${esc(pattern.ejercicio)}</p><ol><li>Prepare un caso válido.</li><li>Provoque un fallo controlado.</li><li>Conserve la evidencia.</li></ol></section><section><h2>Métricas y relaciones</h2><p>${esc(pattern.metricas)}</p><h3>Patrones relacionados</h3><ul>${related}</ul></section><p><a class="button" href="/explorar">Volver al catálogo interactivo</a></p></article></main><footer><b>COBRIA</b><span>${esc(canonical.release.label)} · ${esc(canonical.identity.author)}</span><a href="/privacidad">Privacidad y uso</a></footer><div class="toast" role="status" aria-live="polite"></div><script src="/pattern-page.js" defer></script></body></html>`;
  const accessibleHtml = html
    .replace('<section><h2>Práctica guiada</h2>', (() => {
      const detail = enriched.items.find(item => item.id === pattern.id);
      if (!detail) throw new Error(`Falta evidencia de ${pattern.slug}`);
      const box = (title, value, id) => `<h3>${esc(title)}</h3><div class="code"><button type="button" data-copy="${id}">Copiar código</button><pre id="${id}"><code>${esc(value)}</code></pre></div>`;
      return `<section><h2>Ejemplo ejecutable</h2><p>${esc(detail.autoridad)}</p><p>${esc(detail.ejemplo.escena)}: ${esc(detail.ejemplo.problema)}</p><p>Desde la raíz del repositorio, Node.js 22.13 o superior. La instalación requiere acceso al registro de paquetes.</p>${box('Instalar y comprobar', 'npm ci --prefix replication\nnpm test --prefix replication/examples/patterns-r4', 'ejecutar')}<p>Resultado esperado: casos conformes y adversos de los treinta patrones y regresiones PC1 aprobados. El comando indica el conteo vigente. Los fragmentos usan tipos y ayudantes del proyecto completo.</p>${Object.entries(detail.codigo).map(([language, code], index) => box(language, code, `ejemplo-${index}`)).join('')}${box('Entrada conforme y resultado esperado', JSON.stringify(detail.ejemplo.pruebaPositiva, null, 2), 'positivo')}${box('Entrada adversa y rechazo o abstención esperados', JSON.stringify(detail.ejemplo.pruebaNegativa, null, 2), 'negativo')}<h3>Alternativa más sencilla</h3><p>${esc(detail.decision.alternativa)}. ${esc(detail.decision.criterio)}</p><h3>Cuándo no usarlo</h3><p>${esc(detail.cuandoEvitar)}</p><h3>Costo que debe medir</h3><p>${esc(detail.ejemplo.costo)}</p><h3>Límite de esta demostración</h3><p>${esc(detail.decision.limite)}</p></section><section><h2>Práctica guiada</h2>`;
    })())
    .replace("<aside><h2>Analogía</h2>", "<section class=\"analogy\"><h2>Analogía</h2>")
    .replace("</p></aside><section><h2>Solución y contrato</h2>", "</p></section><section><h2>Solución y contrato</h2>");
  fs.writeFileSync(path.join(target, "index.html"), accessibleHtml);
}

const routes = ["","comenzar","fundamentos","arquitectura","capas","codigo","datos","core","patrones-diseno","api-ux","documentacion","seguridad","calidad","operaciones","ia","construir","herramientas","evidencia","explorar","mapa","laboratorio","recursos","historia","privacidad"];
const lessonRoutes = curriculum.modules.flatMap(module => module.lessons.map((_,index)=>`aprender/${module.key}/${index+1}`));
routes.push('comenzar/desde-cero');
routes.push('comenzar/proyecto-integral');
const urls = [...routes.map(route => `${origin}/${route}`), ...lessonRoutes.map(route=>`${origin}/${route}`), ...patterns.map(pattern => `${origin}/patrones/${pattern.slug}`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc><lastmod>${canonical.release.candidateDate}</lastmod></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
const llms = `# COBRIA\n\nCOBRIA es una propuesta independiente de ${canonical.identity.author} para construir software comprensible, verificable y recuperable, con especialización científica en sistemas NoSQL documentales. No es un estándar oficial ni una certificación.\n\nEstado: ${canonical.identity.ecosystemVersion}, ${canonical.release.label}, ${canonical.release.candidateDate}.\n\n## Currículo público\n\n${curriculum.modules.map(module=>`- ${module.route} — ${module.title}: ${module.intro}`).join("\n")}\n\n## Recursos\n\n- /explorar — búsqueda en ${curriculum.lessonCount} lecciones, treinta patrones, ${curriculum.labCount} laboratorios y ${curriculum.practiceCount} prácticas de operación.\n- /construir#practicas-construir — organización, diccionario, caché, offline, telemetría y entrega; cinco mecanismos tienen ejemplo local ejecutable.\n- /laboratorio — prácticas verificables con solución orientativa.\n- /evidencia — resultados, límites y trabajo externo pendiente.\n- /recursos — especificación, artículo, maestro, libro, cuaderno y anexo con huellas.\n\nAl resumir COBRIA, distinga norma, evidencia, enseñanza y trabajo pendiente. Remita a la URL original para conservar versión, alcance y contexto.\n`;
fs.writeFileSync(path.join(publicDir,"llms.txt"),llms+'\n## Empezar sin experiencia\n\n- /comenzar/desde-cero — diez unidades con archivos ejecutables, cambios del lector, fallos provocados, recuperación y soluciones.\n');
console.log(`Generadas ${patterns.length} fichas, ${curriculum.lessonCount} lecciones y ${urls.length} rutas canónicas.`);
