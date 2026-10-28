import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const root=path.resolve(import.meta.dirname,'../..');
const require=createRequire(path.join(root,'libro-cobria/package.json'));
const {chromium}=require('playwright');
const out=path.join(root,'output/review/ep9/browser');await fs.mkdir(out,{recursive:true});
const base=path.join(root,'sitio/public');
const server=http.createServer(async(req,res)=>{
  try{const target=path.resolve(base,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!target.startsWith(base+path.sep))throw Error('Ruta ajena');
    const type=target.endsWith('.css')?'text/css':target.endsWith('.svg')?'image/svg+xml':target.endsWith('.png')?'image/png':target.endsWith('.ttf')?'font/ttf':target.endsWith('.json')?'application/json':'text/html; charset=utf-8';res.setHeader('content-type',type);res.end(await fs.readFile(target));
  }catch{res.writeHead(404);res.end('No encontrado');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
const results=[];const failures=[];
try{
  browser=await chromium.launch({headless:true,...(process.env.COBRIA_BROWSER_BIN?{executablePath:process.env.COBRIA_BROWSER_BIN}:{})});
  for(const name of ['libro','cuaderno','anexo','articulo','maestro','especificacion']){
    const page=await browser.newPage();const external=[],errors=[];
    page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():(external.push(r.request().url()),r.abort()));
    await page.goto(`http://127.0.0.1:${server.address().port}/lecturas/${name}.html`);await page.evaluate(()=>document.fonts.ready);
    const structural=await page.evaluate(()=>{
      const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);
      const headings=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(x=>Number(x.tagName[1]));
      return {h1:document.querySelectorAll('h1').length,main:document.querySelectorAll('main').length,duplicates:ids.filter((x,i)=>ids.indexOf(x)!==i),brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].map(x=>x.getAttribute('href').slice(1)).filter(id=>!ids.includes(id)),imagesWithoutAlt:[...document.images].filter(x=>!x.hasAttribute('alt')).length,headingsSkipped:headings.filter((x,i)=>i>0&&x>headings[i-1]+1).length,math:document.querySelectorAll('math').length,headersWithoutScope:document.querySelectorAll('th:not([scope])').length};
    });
    for(const width of [320,390,1440]){
      await page.setViewportSize({width,height:900});
      const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+2,missingImages:[...document.images].filter(x=>!x.complete||!x.naturalWidth).map(x=>x.src),badBounds:[...document.querySelectorAll('p,pre,math,table')].filter(x=>{const r=x.getBoundingClientRect();return r.right>innerWidth+2&&!x.closest('.table-scroll')&&getComputedStyle(x).overflowX!=='auto';}).slice(0,8).map(x=>({tag:x.tagName,text:x.textContent.slice(0,80)}))}));
      if(layout.overflow||layout.missingImages.length||layout.badBounds.length)failures.push({name,width,...layout});
      if(width===390)await page.screenshot({path:path.join(out,name+'-390.png')});
    }
    await page.setViewportSize({width:640,height:900});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    const zoomOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
    await page.evaluate(()=>document.documentElement.style.fontSize='');
    await page.goto(`http://127.0.0.1:${server.address().port}/lecturas/${name}.html`);await page.keyboard.press('Tab');
    const skip=await page.locator(':focus').innerText();await page.keyboard.press('Enter');
    const focusedMain=await page.evaluate(()=>document.activeElement?.tagName==='MAIN');
    await page.locator('.reader-navigation summary').focus();await page.keyboard.press('Enter');const indexOpen=await page.locator('.reader-navigation').getAttribute('open')!==null;
    results.push({name,structural,zoomOverflow,keyboard:{skip,focusedMain,indexOpen},externalRequests:external,pageErrors:errors});
    if(structural.h1!==1||structural.main!==1||structural.duplicates.length||structural.brokenAnchors.length||structural.imagesWithoutAlt||structural.headingsSkipped||structural.headersWithoutScope||zoomOverflow||!focusedMain||!indexOpen||external.length||errors.length)failures.push({name,structural,zoomOverflow,focusedMain,indexOpen,external,errors});
    await page.close();
  }
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
await fs.writeFile(path.join(out,'RESULTADO.json'),JSON.stringify({kind:'revision-local-html-ep9',date:'2026-10-25',screenReaderTested:false,pdfUaCertified:false,published:false,documents:results,failures},null,2)+'\n');
assert.equal(failures.length,0,JSON.stringify(failures,null,2));console.log('EP9: seis lecturas, tres anchos, zoom de texto, estructura y teclado aprobados; sin prueba de lector de pantalla.');
