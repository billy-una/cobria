import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {loadBrowserRuntime} from './browser-runtime.mjs';

const root=path.resolve(import.meta.dirname,'../..');
const site=path.resolve(process.argv[2]??'');
if(JSON.parse(await fs.readFile(path.join(site,'package.json'))).name!=='site-creator-vinext-starter')throw Error('Seleccione la copia construida del sitio COBRIA');
await fs.access(path.join(site,'dist/server/index.js'));
const policy=JSON.parse(await fs.readFile(path.join(root,'editorial/ecosistema-15-16/qa-policy.json')));
const qa=path.join(root,'replication/qa'),require=createRequire(path.join(qa,'package.json'));
const loaded=require('@axe-core/playwright'),AxeBuilder=loaded.default??loaded;
const output=path.join(root,'output/review/ecosistema-15-16',`qa-${Date.now()}`);
await fs.mkdir(output,{recursive:true});
const report={kind:'QA-web-local-no-publicacion',policy,site,checks:[],axe:[],errors:[],published:false,remote:false,status:'ejecutando'};
report.sourceInventory=[];
async function inventory(directory){
  for(const entry of await fs.readdir(directory,{withFileTypes:true})){
    const file=path.join(directory,entry.name),relative=path.relative(site,file);
    if(relative.startsWith('public/downloads')||entry.name==='.DS_Store')continue;
    if(entry.isSymbolicLink())throw Error('Enlace en entradas QA');
    if(entry.isDirectory())await inventory(file);
    else if(entry.isFile())report.sourceInventory.push({path:relative,sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex')});
  }
}
await inventory(path.join(site,'app'));await inventory(path.join(site,'public'));
const reservation=http.createServer();await new Promise(r=>reservation.listen(0,'127.0.0.1',r));
const port=reservation.address().port;await new Promise(r=>reservation.close(r));
const base=`http://127.0.0.1:${port}`;
let child,browser;const logs=[];
const check=(name,ok,detail)=>{report.checks.push({name,ok,detail});if(!ok)report.errors.push(name);};
try{
  child=spawn(process.execPath,['node_modules/vinext/dist/cli.js','start','--hostname','127.0.0.1','--port',String(port)],{cwd:site,stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',x=>logs.push(x.toString()));child.stderr.on('data',x=>logs.push(x.toString()));
  let ready=false;
  for(let i=0;i<100;i++){try{if((await fetch(base,{signal:AbortSignal.timeout(1000)})).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
  if(!ready)throw Error('El servidor local no inició');
  browser=await loadBrowserRuntime().chromium.launch({headless:true});
  const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage(),links=new Set();
  for(const width of policy.widths){
    await page.setViewportSize({width,height:900});
    for(const route of policy.routes){
      const response=await page.goto(base+route,{waitUntil:'networkidle'});
      check(`HTTP ${width} ${route}`,response?.status()===200);
      await page.evaluate(()=>document.fonts.ready);
      const overflow=await page.evaluate(()=>({ok:document.documentElement.scrollWidth<=innerWidth+1,details:[...document.querySelectorAll('body *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,12).map(el=>({tag:el.tagName,class:el.className,right:el.getBoundingClientRect().right}))}));
      check(`Sin desborde ${width} ${route}`,overflow.ok,overflow.details);
      const result=await new AxeBuilder({page}).withTags(policy.axeTags).analyze();
      report.axe.push({width,route,violations:result.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(x=>({id:x.id,nodes:x.nodes.length}))});
      check(`Axe ${width} ${route}`,result.violations.length<=policy.maximumAxeViolations);
      for(const href of await page.locator('a[href]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href'))))if(href.startsWith('/')&&!href.startsWith('//')&&!href.startsWith('/downloads/'))links.add(href.split('#')[0]||'/');
      await page.screenshot({path:path.join(output,`${width}-${route.replaceAll('/','')||'inicio'}.png`)});
      if(route==='/')await page.locator('.entry-points').screenshot({path:path.join(output,`${width}-entradas.png`)});
    }
  }
  for(const route of [...links,'/robots.txt','/sitemap.xml','/llms.txt','/downloads/manifest.json']){
    const response=await context.request.get(base+route);
    check(`Enlace ${route}`,response.ok(),response.status());
  }
  await page.goto(base+'/explorar',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'datos',exact:true}).click();
  check('Búsqueda sugerida con resultados',(await page.locator('.search-card').count())>0);
  await page.getByRole('button',{name:'Limpiar búsqueda'}).click();
  check('Limpiar conserva foco',await page.getByLabel('Buscar',{exact:true}).evaluate(el=>el===document.activeElement));
  await page.goto(base+'/laboratorio',{waitUntil:'networkidle'});
  const first=page.getByRole('checkbox').first();const before=await first.isChecked();
  await first.setChecked(!before);await page.reload({waitUntil:'networkidle'});
  check('Progreso local persiste',await page.getByRole('checkbox').first().isChecked()===!before);
  const code=await page.locator('.manual-code pre').first().innerText();
  await page.getByRole('button',{name:'Copiar ejemplo de código'}).first().click();
  await page.waitForFunction(()=>document.querySelector('.copy-toast[data-visible="true"]')?.textContent.includes('copiado'));
  check('Copiar contenido exacto y mostrar aviso',await page.evaluate(()=>navigator.clipboard.readText())===code);
  const downloads=JSON.parse(await fs.readFile(path.join(site,'public/downloads/manifest.json')));
  for(const item of downloads.items){const r=await context.request.get(base+item.href);const bytes=await r.body();check(`Descarga ${item.id}`,r.ok()&&bytes.length===item.bytes&&createHash('sha256').update(bytes).digest('hex')===item.sha256);await r.dispose();}
  await browser.close();browser=null;
  const lighthouse=path.join(qa,'node_modules/lighthouse/cli/index.js');
  await promisify(execFile)(process.execPath,[lighthouse,base+policy.lighthouse.route,'--chrome-flags=--headless=new --no-sandbox --disable-gpu','--output=json','--output-path='+path.join(output,'lighthouse.json'),'--only-categories=accessibility,seo,best-practices,performance','--quiet'],{env:{...process.env,CHROME_PATH:loadBrowserRuntime().chromium.executablePath()},timeout:180000,maxBuffer:8*1024**2});
  const lh=JSON.parse(await fs.readFile(path.join(output,'lighthouse.json')));
  report.lighthouse=Object.fromEntries(Object.entries(lh.categories).map(([key,value])=>[key,value.score]));
  for(const [category,minimum] of Object.entries(policy.lighthouse.minimum))check(`Lighthouse ${category}`,report.lighthouse[category]>=minimum,{score:report.lighthouse[category],minimum});
  report.status=report.errors.length?'fallido':'aprobado-local';
}catch(error){report.status='fallido';report.errors.push(error.message);}
finally{
  await browser?.close();
  if(child&&child.exitCode===null){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}
  await fs.writeFile(path.join(output,'servidor.log'),logs.join(''));
  await fs.writeFile(path.join(output,'resultado.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:report.status,errors:report.errors,lighthouse:report.lighthouse,output},null,2));
  if(report.status!=='aprobado-local')process.exitCode=1;
}
