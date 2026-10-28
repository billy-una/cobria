import assert from 'node:assert/strict';
import { abrirTaller } from './server.mjs';
import {loadBrowserRuntime} from '../../scripts/browser-runtime.mjs';
const {chromium}=loadBrowserRuntime();
const token = 'sesion_demo_navegador_c5_12345';
const taller = await abrirTaller({sesiones:new Map([[token,{actorId:'demo-browser',permisos:['observaciones:leer','observaciones:escribir'],ambitos:['reserva-sur'],expiraEn:Date.now()+60000}]])});
const browser = await chromium.launch({headless:true});
let checks = 0;
try {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const errores = []; page.on('pageerror', e => errores.push(e.message));
  await page.goto(taller.url);
  await page.getByLabel('Sesión DEMO temporal de la terminal').fill(token);
  await page.getByRole('button',{name:'Consultar observaciones'}).click();
  await page.getByRole('status').filter({hasText:'No hay observaciones'}).waitFor(); checks++;
  await page.getByLabel('Cantidad observada').fill('0');
  await page.getByRole('button',{name:'Guardar observación'}).click();
  assert.equal(await page.locator('#cantidad').evaluate(el => el.validity.rangeUnderflow),true); checks++;
  await page.getByLabel('Cantidad observada').fill('3');
  // Comprueba el estado pendiente y que no se envía otro clic mientras espera.
  await page.route('**/api/observaciones', async route => { await new Promise(resolve => setTimeout(resolve,100)); await route.continue(); });
  await page.getByRole('button',{name:'Guardar observación'}).click();
  assert.equal(await page.locator('#guardar').isDisabled(),true); checks++;
  await page.getByRole('status').filter({hasText:'Observación guardada.'}).waitFor(); checks++;
  await page.getByLabel('Ámbito autorizado').fill('reserva-norte');
  await page.getByRole('button',{name:'Consultar observaciones'}).click();
  await page.getByRole('status').filter({hasText:'No tiene permiso'}).waitFor();
  assert.equal(await page.locator('#estado').evaluate(el=>el===document.activeElement),true); checks++;
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true); checks++;
  await page.getByLabel('Sesión DEMO temporal de la terminal').focus();
  await page.keyboard.press('Tab'); assert.equal(await page.locator('#id').evaluate(el=>el===document.activeElement),true); checks++;
  assert.deepEqual(await page.evaluate(()=>({cookies:document.cookie,local:localStorage.length,session:sessionStorage.length})),{cookies:'',local:0,session:0}); checks++;
  await page.getByLabel('Sesión DEMO temporal de la terminal').fill('');
  await page.getByLabel('Ámbito autorizado').fill('reserva-sur');
  // La captura nunca conserva el token.
  if (process.env.COBRIA_C5_SCREENSHOT) await page.screenshot({path:process.env.COBRIA_C5_SCREENSHOT,fullPage:true});
  assert.deepEqual(errores,[]); checks++;
  console.log(JSON.stringify({kind:'revision-automatizada-local-no-certificacion',checksPassed:checks,viewport:{width:390,height:844},manualAssistiveTechnologyReview:false,published:false},null,2));
} finally {await browser.close();await taller.cerrar();}
