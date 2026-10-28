import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {loadBrowserRuntime} from './browser-runtime.mjs';
const root=path.resolve(import.meta.dirname,'../../libro-cobria');
const output=path.resolve(root,'../output/review/pc6');await fs.mkdir(output,{recursive:true});
const server=http.createServer(async(req,res)=>{
  try{
    const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
    if(!file.startsWith(root+path.sep))throw Error('Ruta ajena');
    res.setHeader('content-type',file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html');res.end(await fs.readFile(file));
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
try{
  browser=await loadBrowserRuntime().chromium.launch({headless:true});const page=await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.emulateMedia({media:'print'});
  await page.evaluate(()=>document.fonts.ready);
  const geometry=await page.locator('.lesson-practice-page').evaluateAll(elements=>elements.map(el=>({id:el.id,height:el.getBoundingClientRect().height,overflow:el.scrollWidth>el.clientWidth+2||el.scrollHeight>el.clientHeight+2,
    fontPt:parseFloat(getComputedStyle(el).fontSize)*72/96})));
  const report={kind:'geometria-ejercicios-PC6',pages:geometry,readerStudy:false,published:false};
  await fs.writeFile(path.join(output,'geometry.json'),JSON.stringify(report,null,2)+'\n');
  // CSS convierte pt a px con redondeo: 10 pt puede devolver 9.999975 pt.
  assert.equal(geometry.length,85);assert.ok(geometry.every(x=>x.height<=925&&!x.overflow&&x.fontPt>=9.99),JSON.stringify(geometry.filter(x=>x.height>925||x.overflow||x.fontPt<9.99)));
  for(const id of ['ejercicio-05-1','ejercicio-11-4','ejercicio-17-5'])await page.locator(`#${id}`).screenshot({path:path.join(output,`${id}.png`)});
  console.log(JSON.stringify({exercises:85,overflow:0,maxHeight:Math.max(...geometry.map(x=>x.height)),readerStudy:false}));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
