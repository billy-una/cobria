import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadBrowserRuntime} from './browser-runtime.mjs';

const root=fileURLToPath(new URL('../../libro-cobria/',import.meta.url));
const output=new URL('../../output/review/pc1/',import.meta.url);
await fs.mkdir(output,{recursive:true});
const server=http.createServer(async(req,res)=>{
  try {
    const target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!target.startsWith(root))throw Error('Ruta no permitida');
    res.setHeader('content-type',target.endsWith('.png')?'image/png':target.endsWith('.css')?'text/css':'text/html; charset=utf-8');
    res.end(await fs.readFile(target));
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
  browser=await loadBrowserRuntime().chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:680,height:1000}});
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
  await page.emulateMedia({media:'print'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
  const geometry=await page.locator('.code-page').evaluateAll(pages=>pages.map(el=>({
    id:el.id,height:el.getBoundingClientRect().height,
    overflow:el.scrollWidth>el.clientWidth+2,
    fontPt:parseFloat(getComputedStyle(el.querySelector('pre')).fontSize)*72/96
  })));
  for(const [id,text] of [['codigo-07','candidata-calculada'],['codigo-09','activaPropuesta'],['codigo-12','planCommit'],['codigo-20','retiro-propuesto']])
    assert.ok((await page.locator(`#${id}`).innerText()).includes(text));
  for(const id of ['codigo-05','codigo-07','codigo-09','codigo-10'])
    await page.locator(`#${id}`).screenshot({path:fileURLToPath(new URL(`${id}.png`,output))});
  const report={kind:'geometria-local-codigo-PC1',pages:geometry,manualAccessibilityReview:false,published:false};
  await fs.writeFile(new URL('book-geometry.json',output),JSON.stringify(report,null,2));
  assert.equal(geometry.length,33);assert.ok(geometry.every(p=>!p.overflow&&p.height<=925&&p.fontPt>=9),JSON.stringify(geometry.filter(p=>p.overflow||p.height>925||p.fontPt<9)));
  console.log(JSON.stringify({codePages:geometry.length,overflow:0,oversized:0,minimumFontPt:Math.min(...geometry.map(p=>p.fontPt)),published:false}));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
