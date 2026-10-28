import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {loadBrowserRuntime} from './browser-runtime.mjs';
const base=new URL(process.argv[2]);
assert.equal(base.hostname,'127.0.0.1');assert.equal(base.protocol,'http:');
const output=new URL('../../output/review/pc7/',import.meta.url);await fs.mkdir(output,{recursive:true});
const browser=await loadBrowserRuntime().chromium.launch({headless:true});
try{
  const page=await browser.newPage(),errors=[],external=[];let checks=0;
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>new URL(route.request().url()).origin===base.origin?route.continue():(external.push(route.request().url()),route.abort()));
  for(const width of [320,390,1440]){
    await page.setViewportSize({width,height:900});
    for(const route of ['/mapa','/aprender/codigo/1','/aprender/seguridad/4','/recursos']){
      const response=await page.goto(new URL(route,base).href,{waitUntil:'networkidle'});assert.equal(response.status(),200);checks++;
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${width}: ${route}`);checks++;
      assert.ok(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='Inter'&&f.status==='loaded')));checks++;
      if(route==='/aprender/seguridad/4'){
        const summary=page.locator('.lesson-practice summary');await summary.focus();await page.keyboard.press('Enter');
        assert.equal(await page.locator('.lesson-practice details').evaluate(el=>el.open),true);checks++;
        await summary.scrollIntoViewIfNeeded();
        await page.screenshot({path:new URL(`practica-${width}.png`,output).pathname});
      }
    }
  }
  await page.goto(new URL('/aprender/codigo/1',base).href,{waitUntil:'networkidle'});
  // Simula la API del navegador, no afirma acceso al portapapeles del sistema.
  await page.evaluate(()=>{window.__pc7Copied='';Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__pc7Copied=value;}}});});
  const button=page.getByRole('button',{name:'Copiar ejemplo de código'}).first();await button.focus();await page.keyboard.press('Enter');
  await page.getByRole('status').filter({hasText:'Código copiado al portapapeles'}).waitFor();checks++;
  assert.equal(await page.evaluate(()=>window.__pc7Copied),await page.locator('.manual-code pre').first().innerText());checks++;
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('DENIED');}}}));
  await button.click();await page.getByRole('status').filter({hasText:'No se pudo copiar.'}).waitFor();checks++;
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  const report={kind:'interaccion-local-PC7',checksPassed:checks,widths:[320,390,1440],pageErrors:errors,externalRequests:external,
    clipboardApiSimulated:true,systemClipboardVerified:false,screenReaderReview:false,published:false};
  await fs.writeFile(new URL('site-interaction.json',output),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{await browser.close();}
