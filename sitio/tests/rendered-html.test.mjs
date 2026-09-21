import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("la publicación contiene navegación y recursos COBRIA", async () => {
  const [home,resources,catalog] = await Promise.all([read("../public/index.html"),read("../public/recursos.html"),read("../public/catalogo.json")]);
  assert.match(home,/COBRIA · Patrones de arquitectura NoSQL reconstruible/);
  assert.match(home,/Consulta rápida/);
  assert.match(resources,/Recursos abiertos/);
  assert.match(resources,/COBRIA Core 1\.0/);
  const parsed=JSON.parse(catalog);
  assert.equal(parsed.schemaVersion,"1.0.0");
  assert.equal(parsed.items.length,30);
});

test("las fichas indexables y todas las rutas públicas aparecen en el mapa", async () => {
  const [sitemap,pattern,robots]=await Promise.all([read("../public/sitemap.xml"),read("../public/patrones/objeto-canonico/index.html"),read("../public/robots.txt")]);
  assert.equal((sitemap.match(/<url>/g)||[]).length,57);
  assert.match(sitemap,/\/api-ux/);
  assert.match(sitemap,/\/seguridad/);
  assert.match(sitemap,/\/herramientas/);
  assert.match(pattern,/application\/ld\+json/);
  assert.match(pattern,/<h1>Objeto canónico<\/h1>/);
  assert.match(robots,/OAI-SearchBot/);
});

test("la publicación no contiene marcadores de anuncios y ofrece solo PDF canónicos", async () => {
  const [home, resources] = await Promise.all([read("../public/index.html"), read("../public/recursos.html")]);
  assert.doesNotMatch(home, /ad-space|PUBLICIDAD|Google AdSense/);
  assert.doesNotMatch(resources, /ad-space|PUBLICIDAD/);
  for (const name of ["COBRIA-libro-web.pdf", "COBRIA-cuaderno.pdf", "COBRIA-anexo-tecnico.pdf", "COBRIA-articulo.pdf", "COBRIA-documento-maestro.pdf", "COBRIA-especificacion.pdf"]) {
    const data = await readFile(new URL(`../public/downloads/${name}`, import.meta.url));
    assert.ok(data.length > 1000, `${name} debe existir`);
  }
});

test("la aplicación renderizada conserva la identidad COBRIA", async () => {
  const workerUrl=new URL("../dist/server/index.js",import.meta.url); workerUrl.searchParams.set("test",`${process.pid}-${Date.now()}`);
  const {default:worker}=await import(workerUrl.href);
  const response=await worker.fetch(new Request("http://localhost/",{headers:{accept:"text/html"}}),{ASSETS:{fetch:async()=>new Response("Not found",{status:404})}},{waitUntil(){},passThroughOnException(){}});
  const html=await response.text();
  assert.equal(response.status,200); assert.match(html,/COBRIA/); assert.match(html,/Ecosistema COBRIA/); assert.match(html,/COBRIA Build/); assert.doesNotMatch(html,/Your site is taking shape/);
  assert.match(html,/<html lang="es"/); assert.match(html,/Saltar al contenido principal/); assert.match(html,/<main id="contenido"/); assert.match(html,/aria-label="Navegación principal"/);
});

test("los estilos conservan foco, movimiento reducido y navegación móvil", async () => {
  const css=await read("../app/globals.css");
  assert.match(css,/:focus-visible/); assert.match(css,/prefers-reduced-motion/); assert.match(css,/display:flex!important/); assert.match(css,/min-height:44px/);
});
