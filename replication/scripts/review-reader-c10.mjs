import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import { loadBrowserRuntime } from './browser-runtime.mjs';
const { chromium } = loadBrowserRuntime();
const root=fileURLToPath(new URL('../../libro-cobria/',import.meta.url));
const server=http.createServer(async(req,res)=>{
  try{const target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!target.startsWith(root)||target===root)throw Error('Ruta no permitida');const data=await fs.readFile(target);res.setHeader('content-type',target.endsWith('.png')?'image/png':target.endsWith('.css')?'text/css':'text/html; charset=utf-8');res.end(data);}catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:680,height:1000}});
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
  await page.emulateMedia({media:'print'});
  await page.evaluate(async()=>{document.querySelectorAll('details').forEach(el=>{el.open=true;});await Promise.all([...document.images].map(img=>img.decode()));await document.fonts.ready;});
  const report=await page.evaluate(()=>{
    const allIds=[...document.querySelectorAll('[id]')].map(el=>el.id);
    const anchors=[...document.querySelectorAll('a[href^="#"]')].map(el=>el.getAttribute('href').slice(1));
    const pages=[...document.querySelectorAll('.book-page,.pattern,.cover,.opening,.catalog-map,.closing')];
    const images=[...document.images].map(el=>({source:el.getAttribute('src'),alt:el.alt,loaded:el.complete&&el.naturalWidth>0,fit:getComputedStyle(el).objectFit}));
    const fonts=[...document.querySelectorAll('.code-grid pre')].map(el=>parseFloat(getComputedStyle(el).fontSize)*72/96);
    return {kind:'revision-geometrica-local-no-certificacion',sections:pages.length,duplicateIds:allIds.filter((id,index)=>allIds.indexOf(id)!==index),missingAnchors:anchors.filter(id=>!allIds.includes(id)),images,minimumPatternCodePt:Math.min(...fonts),patternCodeBlocks:fonts.length,
      horizontalOverflow:pages.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({id:el.id,title:el.querySelector('h1')?.textContent,width:el.clientWidth,scroll:el.scrollWidth})),
      oversized:pages.map((el,index)=>({index:index+1,id:el.id,title:el.querySelector('h1')?.textContent,heightPx:el.getBoundingClientRect().height,cover:el.matches('.cover')})).filter(row=>!row.cover&&row.heightPx>925),manualAccessibilityReview:false,published:false};
  });
  const output=new URL('../../output/review/c10/',import.meta.url);await fs.mkdir(output,{recursive:true});
  await fs.writeFile(new URL('book-geometry.json',output),JSON.stringify(report,null,2));
  assert.deepEqual(report.duplicateIds,[]);assert.deepEqual(report.missingAnchors,[]);
  assert.ok(report.images.every(img=>img.loaded&&img.alt&&['contain','cover'].includes(img.fit)));
  assert.ok(report.minimumPatternCodePt>=9);assert.equal(report.patternCodeBlocks,33);
  assert.ok(report.sections>=280,'La revisión debe abarcar el libro, no solo la portada.');
  assert.deepEqual(report.oversized,[],'Una sección excede la página de lectura; revise la distribución.');
  assert.deepEqual(report.horizontalOverflow,[],'Una sección excede el ancho de lectura.');
  console.log(JSON.stringify({...report,images:report.images.length},null,2));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
