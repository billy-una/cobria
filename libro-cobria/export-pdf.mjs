import { chromium } from '/Users/billitas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import path from 'node:path';
import http from 'node:http';
import fs from 'node:fs/promises';

const root = import.meta.dirname;
const assetCache = new Map();
for (const name of await fs.readdir(path.join(root, 'assets'))) {
  if (name.endsWith('.png')) assetCache.set(`assets/${name}`, await fs.readFile(path.join(root, 'assets', name)));
}
const server = http.createServer(async (request, response) => {
  try {
    const relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).replace(/^\/+/, '') || 'index.html';
    const target = path.resolve(root, relative);
    if (!target.startsWith(`${root}${path.sep}`)) throw new Error('ruta inválida');
    const data = assetCache.get(relative) ?? await fs.readFile(target);
    const type = target.endsWith('.png') ? 'image/png' : target.endsWith('.css') ? 'text/css' : 'text/html; charset=utf-8';
    response.writeHead(200, {'content-type': type}); response.end(data);
  } catch { response.writeHead(404); response.end('No encontrado'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, timeout: 30000, args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-first-run', '--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${address.port}/index.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForFunction(() => document.styleSheets.length > 0, null, { timeout: 30000 });
try { await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth), null, { timeout: 30000 }); } catch {}
const pendingImages = await page.evaluate(() => [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.getAttribute('src')));
if (pendingImages.length) console.error(`Ilustraciones no cargadas: ${[...new Set(pendingImages)].join(', ')}`);
await page.emulateMedia({ media: 'print' });
await page.pdf({ path: path.join(import.meta.dirname, 'output', 'COBRIA-prelibro-visual-nosql.pdf'), format: 'Letter', printBackground: true, preferCSSPageSize: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
await browser.close();
await new Promise(resolve => server.close(resolve));
