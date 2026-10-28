import fs from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import budgets from '../../editorial/ep5/budgets.json' with {type:'json'};
import {storageKey} from '../../editorial/ep5/progress.mjs';
import parity from '../../editorial/ep5/parity.json' with {type:'json'};

export async function auditEp5Browser(page,base,check,output){
  for(const module of parity.modules){
    const response=await fetch(base+module.route),html=await response.text();
    check(`EP5 caso enlazado ${module.key}`,response.status===200&&html.includes('id="caso-desarrollado"'));
    for(const lesson of module.lessons){
      const result=await fetch(base+lesson.route),text=await result.text();
      check(`EP5 lección enlazada ${lesson.route}`,result.status===200&&text.includes('Conectar con el libro y el proyecto'));
    }
  }
  await page.goto(base+'/aprender/inicio/1',{waitUntil:'networkidle'});
  check('EP5 leer no marca automáticamente',await page.evaluate(key=>localStorage.getItem(key),storageKey)===null);
  const button=()=>page.getByRole('button',{name:'Marcar como leída'});
  await button().focus();await page.keyboard.press('Space');
  await page.getByRole('button',{name:'Quitar marca de leída'}).waitFor();
  await page.reload({waitUntil:'networkidle'});
  check('EP5 marca persistente tras recargar',await page.getByRole('button',{name:'Quitar marca de leída'}).getAttribute('aria-pressed')==='true');
  await page.goto(base+'/comenzar',{waitUntil:'networkidle'});
  check('EP5 avance refleja una lección',await page.locator('.learning-progress').innerText().then(t=>t.includes('1 de 85')));
  check('EP5 continuar no repite leída',await page.locator('.learning-progress a').getAttribute('href')==='/aprender/inicio/2');
  await page.evaluate(()=>localStorage.setItem('ep5-prueba-ajena','conservar'));
  await page.locator('.learning-progress summary').click();
  await page.getByRole('button',{name:'Borrar mis marcas',exact:true}).click();
  check('EP5 borrado restringido a su clave',await page.evaluate(key=>localStorage.getItem(key)===null&&localStorage.getItem('ep5-prueba-ajena')==='conservar',storageKey));
  await page.evaluate(()=>localStorage.removeItem('ep5-prueba-ajena'));
  await page.getByRole('link',{name:'Continuar:',exact:false}).focus();await page.keyboard.press('Enter');
  await page.waitForURL('**/aprender/inicio/1');
  check('EP5 continuar por teclado',await page.locator('h1').count()===1);

  await page.goto(base+'/explorar',{waitUntil:'networkidle'});
  await page.getByRole('textbox',{name:'Buscar',exact:true}).fill('pouchdb reconstruccion');
  await page.getByRole('combobox',{name:'Tipo'}).selectOption('Proyecto');
  check('EP5 búsqueda encuentra proyecto integrado',await page.locator('.search-card').count()===1);
  await page.locator('.search-card a').click();await page.waitForURL('**/comenzar/proyecto-integral');
  check('EP5 resultado navega al capítulo',await page.locator('h1').innerText().then(t=>t.includes('aplicación recuperable')));
  await page.goto(base+'/explorar',{waitUntil:'networkidle'});
  await page.getByRole('textbox',{name:'Buscar',exact:true}).fill('qzxz-no-existe');
  check('EP5 búsqueda vacía explica recuperación',await page.getByRole('heading',{name:'No encontramos coincidencias'}).count()===1);
  await page.getByRole('button',{name:'Limpiar búsqueda'}).click();
  check('EP5 limpiar devuelve foco',await page.getByRole('textbox',{name:'Buscar',exact:true}).evaluate(el=>el===document.activeElement));

  const browser=page.context().browser();
  const adversarial=await browser.newContext();
  const adverseErrors=[];
  try{
    await adversarial.addInitScript(key=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('Cuota de prueba','QuotaExceededError');return original.call(this,k,v);};},storageKey);
    const other=await adversarial.newPage();other.on('pageerror',e=>adverseErrors.push(e.message));
    await other.goto(base+'/aprender/inicio/1',{waitUntil:'networkidle'});
    await other.getByRole('button',{name:'Marcar como leída'}).click();
    check('EP5 cuota bloqueada mantiene marca en memoria',await other.getByRole('button',{name:'Quitar marca de leída'}).getAttribute('aria-pressed')==='true');
    check('EP5 almacenamiento bloqueado se explica',await other.locator('.learning-progress [role=status]').innerText().then(t=>t.includes('bloqueó')));
    await other.evaluate(()=>localStorage.setItem('cobria-laboratorios-1.0','{"noEsUnaLista":true}'));
    await other.goto(base+'/laboratorio',{waitUntil:'networkidle'});
    check('EP5 laboratorio tolera estructura local inválida',await other.locator('.search-count').innerText().then(t=>t.includes('0 de 30')));
    check('EP5 fallos de almacenamiento sin error cliente',adverseErrors.length===0,adverseErrors);
  }finally{await adversarial.close();}

  const measurements=[];
  for(const route of budgets.routes){
    const measurementContext=await browser.newContext();
    const measurementPage=await measurementContext.newPage();
    const scripts=new Map(),scriptUrls=new Set(),scriptReadErrors=[];let external=0;
    const onResponse=response=>{
      if(new URL(response.url()).origin!==base){external++;return;}
      if(response.request().resourceType()!=='script')return;
      if(response.status()>=300&&response.status()<400)return;
      scriptUrls.add(response.url());
    };
    measurementPage.on('response',onResponse);
    const response=await measurementPage.goto(base+route,{waitUntil:'networkidle'});
    for(const src of await measurementPage.locator('script[src]').evaluateAll(elements=>elements.map(el=>el.src)))if(new URL(src).origin===base)scriptUrls.add(src);
    measurementPage.off('response',onResponse);
    for(const url of scriptUrls){try{const result=await fetch(url);if(!result.ok)throw Error(`HTTP ${result.status}`);scripts.set(url,Buffer.from(await result.arrayBuffer()));}catch(error){scriptReadErrors.push({url,error:error.message});}}
    const html=await response.body();
    const measurement={route,status:response.status(),htmlBytes:html.length,htmlGzipBytes:gzipSync(html).length,
      scriptBytes:[...scripts.values()].reduce((sum,b)=>sum+b.length,0),scriptGzipBytes:[...scripts.values()].reduce((sum,b)=>sum+gzipSync(b).length,0),external,scriptReadErrors};
    measurements.push(measurement);
    check(`EP5 presupuesto ${route}`,measurement.status===200&&measurement.htmlBytes<=budgets.htmlDecodedBytes&&measurement.htmlGzipBytes<=budgets.htmlGzipBytes&&measurement.scriptBytes>0&&measurement.scriptBytes<=budgets.loadedScriptDecodedBytes&&measurement.scriptGzipBytes<=budgets.loadedScriptGzipBytes&&external===0&&scriptReadErrors.length===0,measurement);
    for(const width of [390,320]){await measurementPage.setViewportSize({width,height:900});check(`EP5 sin desbordamiento ${route} ${width}`,await measurementPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
    await measurementContext.close();
  }
  await page.setViewportSize({width:390,height:900});
  await page.goto(base+'/comenzar',{waitUntil:'networkidle'});await page.locator('.learning-progress').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(output,'avance-movil.png')});
  await page.setViewportSize({width:1280,height:900});await page.screenshot({path:path.join(output,'avance-escritorio.png')});
  await fs.writeFile(path.join(output,'PRESUPUESTOS.json'),JSON.stringify({budgets,measurements},null,2)+'\n');
}
