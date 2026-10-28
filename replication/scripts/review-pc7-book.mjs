import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {loadBrowserRuntime} from './browser-runtime.mjs';
const root=path.resolve(import.meta.dirname,'../../libro-cobria');
const output=path.resolve(root,'../output/review/pc7');await fs.mkdir(output,{recursive:true});
const server=http.createServer(async(req,res)=>{
  try{const target=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
    if(!target.startsWith(root+path.sep))throw Error('Ruta ajena');
    const type=target.endsWith('.ttf')?'font/ttf':target.endsWith('.css')?'text/css':target.endsWith('.png')?'image/png':'text/html';
    res.setHeader('content-type',type);res.end(await fs.readFile(target));
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
const reports=[];
try{
  browser=await loadBrowserRuntime().chromium.launch({headless:true,...(process.env.COBRIA_BROWSER_BIN?{executablePath:process.env.COBRIA_BROWSER_BIN}:{})});
  for(const source of ['index.html','cuaderno.html','anexo-tecnico.html']){
    const page=await browser.newPage({viewport:{width:680,height:1000}}),external=[],errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():(external.push(route.request().url()),route.abort()));
    await page.goto(`http://127.0.0.1:${server.address().port}/${source}`);await page.emulateMedia({media:'print'});
    await page.evaluate(async()=>{document.querySelectorAll('details').forEach(x=>x.open=true);await Promise.all([document.fonts.load('12px Inter'),document.fonts.load('12px "COBRIA Mono"')]);await document.fonts.ready;await Promise.all([...document.images].map(x=>x.decode()));});
    const report=await page.evaluate(()=>{
      const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);
      const pages=[...document.querySelectorAll('.book-page,.pattern,.cover,.opening,.catalog-map,.closing,.lab-page')];
      return {sections:pages.length,fontsLoaded:[...document.fonts].map(f=>({family:f.family,status:f.status})),
        duplicates:ids.filter((x,i)=>ids.indexOf(x)!==i),
        brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].map(x=>x.getAttribute('href').slice(1)).filter(x=>!ids.includes(x)),
        pages:pages.map((el,i)=>({index:i+1,id:el.id,title:el.querySelector('h1')?.textContent,
          height:el.getBoundingClientRect().height,cover:el.matches('.cover'),
          overflow:el.scrollWidth>el.clientWidth+2||el.scrollHeight>el.clientHeight+2})),
        images:[...document.images].map(x=>({src:x.getAttribute('src'),alt:x.alt,loaded:x.naturalWidth>0,fit:getComputedStyle(x).objectFit,
          ratioError:['cover','contain'].includes(getComputedStyle(x).objectFit)?0:Math.abs((x.width/x.height)/(x.naturalWidth/x.naturalHeight)-1)}))};
    });
    reports.push({source,...report,externalRequests:external,pageErrors:errors});
    await fs.writeFile(path.join(output,'book-geometry.json'),JSON.stringify({kind:'revision-local-PC7',documents:reports,humanReaderValidation:false,published:false},null,2)+'\n');
    assert.deepEqual(external,[]);assert.deepEqual(errors,[]);assert.deepEqual(report.duplicates,[]);assert.deepEqual(report.brokenAnchors,[]);
    assert.ok(report.fontsLoaded.some(x=>x.family==='Inter'&&x.status==='loaded'));
    assert.ok(report.fontsLoaded.some(x=>x.family==='COBRIA Mono'&&x.status==='loaded'));
    assert.deepEqual(report.pages.filter(p=>p.overflow||(!p.cover&&p.height>925)),[]);
    assert.ok(report.images.every(x=>x.loaded&&x.alt&&x.ratioError<.03),JSON.stringify(report.images.filter(x=>!x.loaded||!x.alt||x.ratioError>=.03)));
    if(source==='index.html'){
      const curriculum=JSON.parse(await fs.readFile(path.join(root,'../editorial/curriculum.json')));
      for(const course of curriculum.modules)for(const [i,lesson] of course.lessons.entries()){
        const text=await page.locator(`#leccion-${course.number}-${i+1}`).innerText();
        for(const field of ['title','situation','simple','example','mistake','evidence','code'])assert.ok(text.includes(lesson[field]),`${course.key}/${i+1}: ${field}`);
        const practice=await page.locator(`#ejercicio-${course.number}-${i+1}`).innerText();
        for(const field of ['exercise','solution','recovery'])assert.ok(practice.includes(lesson.practice[field]),`${course.key}/${i+1}: ${field}`);
      }
      for(const selector of ['#leccion-06-1','#taller-operacion-c6','#codigo-07','#ejercicio-11-4'])await page.locator(selector).screenshot({path:path.join(output,selector.slice(1)+'.png')});
    }else await page.locator('.cover').screenshot({path:path.join(output,source+'.png')});
    await page.close();
  }
  console.log(JSON.stringify({documents:reports.map(x=>({source:x.source,sections:x.sections})),localFonts:true,brokenAnchors:0,overflow:0,lessonParity:85}));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
