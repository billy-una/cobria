import { createRequire } from 'node:module';

// La instalación fijada del libro también sirve a los verificadores editoriales.
// No depende del directorio del usuario ni de herramientas de un asistente.
export function loadBrowserRuntime() {
  const require = createRequire(new URL('../../libro-cobria/package.json', import.meta.url));
  try { return require('playwright'); }
  catch (cause) {
    throw new Error('Instale el navegador: npm ci --prefix libro-cobria; después, desde libro-cobria: npx playwright install chromium', { cause });
  }
}
