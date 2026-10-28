import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {loadBrowserRuntime} from './browser-runtime.mjs';

const root=path.resolve(import.meta.dirname,'../..'),site=path.resolve(process.argv[2]??'');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const pkg=JSON.parse(await fs.readFile(path.join(site,'package.json')));
if(pkg.name!=='site-creator-vinext-starter')throw Error('Se requiere una copia local construida de COBRIA');
const configPath=path.join(site,'dist/server/wrangler.json');
const config=JSON.parse(await fs.readFile(configPath));
if(config.main!=='index.js'||config.assets?.directory!=='../client'||config.assets?.run_worker_first!==true||config.assets?.binding!=='ASSETS')throw Error('Configuración construida sin la política EP1');
const ep2=process.argv.includes('--ep2');
const ep3=process.argv.includes('--ep3');
const ep4=process.argv.includes('--ep4');
const ep5=process.argv.includes('--ep5');
const output=path.join(root,`output/review/${ep5?'ep5':ep4?'ep4':ep3?'ep3':ep2?'ep2':'ep1'}`,`local-${Date.now()}`);await fs.mkdir(output,{recursive:true});
const report={kind:'HTTP-local-Worker-ASSETS-no-despliegue',site,checks:[],errors:[],published:false,remoteVerified:false,
  configSha256:hash(await fs.readFile(configPath)),compiledWorkerSha256:hash(await fs.readFile(path.join(site,'dist/server/index.js'))),
  limits:['Miniflare/workerd local; no garantiza idéntica configuración del alojamiento Sites.',
    'Sin publicación ni etiqueta; no certifica accesibilidad ni aprueba edición del contenido.']};
for(const relative of ['worker/index.ts','worker/routing-policy.json','vite.config.ts']){
  if(hash(await fs.readFile(path.join(site,relative)))!==hash(await fs.readFile(path.join(root,'sitio',relative))))throw Error('Entrada de otra versión: '+relative);
}
const reserve=http.createServer();await new Promise(resolve=>reserve.listen(0,'127.0.0.1',resolve));
const port=reserve.address().port;await new Promise(resolve=>reserve.close(resolve));
const base=`http://127.0.0.1:${port}`,logs=[];let child,browser;
const check=(name,ok,detail)=>{report.checks.push({name,ok,detail});if(!ok)report.errors.push(name);};
try{
  const env=Object.fromEntries(['PATH','HOME','TMPDIR','USER','LANG'].filter(key=>process.env[key]).map(key=>[key,process.env[key]]));
  Object.assign(env,{WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_PATH:path.join(output,'wrangler.log'),CI:'true'});
  child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js','dev','--local','--ip','127.0.0.1','--port',String(port),'--config','dist/server/wrangler.json','--persist-to',path.join(output,'estado-local')],{cwd:site,env,stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',data=>logs.push(data.toString()));child.stderr.on('data',data=>logs.push(data.toString()));
  let ready=false;
  for(let i=0;i<240;i++){
    if(child.exitCode!==null)throw Error('El servidor local terminó antes de iniciar');
    try{const response=await fetch(base,{signal:AbortSignal.timeout(1500)});if(response.ok){ready=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(!ready)throw Error('El Worker no respondió dentro del plazo');
  const headers=['content-security-policy','strict-transport-security','x-content-type-options','x-frame-options','referrer-policy','permissions-policy'];
  for(const route of ['/','/comenzar','/explorar','/recursos','/mapa','/laboratorio']){
    const response=await fetch(base+route),html=await response.text();
    check('HTML '+route,response.status===200&&html.includes('COBRIA'),response.status);
    check('Cabeceras '+route,headers.every(header=>response.headers.has(header)));
    check('Revalidación '+route,response.headers.get('cache-control')==='no-cache');
    if(route==='/')check('Portada del ecosistema',html.includes('Diecisiete partes')&&html.includes('De cero a software mantenible'));
    if(route==='/recursos')check('Recursos canónicos',html.includes('/downloads/manifest.json')&&!html.includes('href="downloads/COBRIA-tesis.pdf"'));
  }
  const response=await fetch(base+'/downloads/manifest.json');
  const bytes=Buffer.from(await response.arrayBuffer());
  check('Manifiesto HTTP',response.status===200&&response.headers.get('content-type')?.includes('application/json'));
  check('Manifiesto exacto',hash(bytes)===hash(await fs.readFile(path.join(site,'public/downloads/manifest.json'))));
  const manifest=JSON.parse(bytes);
  check('Seis descargas',manifest.items.length===6);
  for(const doc of manifest.items){
    const result=await fetch(base+doc.href),bytes=Buffer.from(await result.arrayBuffer());
    check('PDF '+doc.id,result.status===200&&result.headers.get('content-type')?.includes('application/pdf')&&bytes.length===doc.bytes&&hash(bytes)===doc.sha256);
    check('Seguridad PDF '+doc.id,headers.every(header=>result.headers.has(header))&&result.headers.get('cache-control')==='public, max-age=0, must-revalidate');
  }
  const legacy=await fetch(base+'/downloads/COBRIA-tesis.pdf',{redirect:'manual'});
  check('Alias tesis',legacy.status===308&&new URL(legacy.headers.get('location')).pathname==='/downloads/COBRIA-documento-maestro.pdf');
  const oldCore=await fetch(base+'/core-1-1',{redirect:'manual'});
  check('Alias Core',oldCore.status===308&&new URL(oldCore.headers.get('location')).pathname==='/core');
  for(const route of ['/downloads/no-existe.pdf','/no-existe','/index.html','/recursos.html']){
    const result=await fetch(base+route);await result.arrayBuffer();check('No fallback obsoleto '+route,result.status===404&&result.headers.has('x-content-type-options'));
  }
  browser=await loadBrowserRuntime().chromium.launch({headless:true,...(process.env.COBRIA_BROWSER_BIN?{executablePath:process.env.COBRIA_BROWSER_BIN}:{})});
  report.browserVersion=browser.version();
  report.browserOverride=Boolean(process.env.COBRIA_BROWSER_BIN);
  const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage(),pageErrors=[],failedRequests=[];
  report.expectedNavigationAborts=[];
  page.on('pageerror',error=>pageErrors.push(error.message));page.on('requestfailed',request=>{
    const detail={url:request.url(),error:request.failure()?.errorText};
    if(ep5&&detail.error==='net::ERR_ABORTED'&&new URL(detail.url).searchParams.has('_rsc'))report.expectedNavigationAborts.push(detail);
    else failedRequests.push(detail);
  });
  await page.goto(base,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  check('Fuentes con política real',await page.evaluate(()=>document.fonts.check('16px Inter')));
  await page.getByRole('link',{name:'Comenzar desde cero',exact:true}).first().click();await page.waitForURL('**/comenzar');
  check('Navegación inicial hidratada',await page.locator('h1').count()>0);
  await page.goto(base+'/explorar',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'datos',exact:true}).click();
  check('Buscador hidratado',await page.locator('.search-card').count()>0);
  await page.goto(base+'/laboratorio',{waitUntil:'networkidle'});
  const code=await page.locator('.manual-code pre').first().innerText();
  await page.getByRole('button',{name:'Copiar ejemplo de código'}).first().click();
  await page.waitForFunction(()=>document.querySelector('.copy-toast[data-visible="true"]')?.textContent.includes('copiado'));
  check('Copiado y aviso',await page.evaluate(()=>navigator.clipboard.readText())===code);
  await page.screenshot({path:path.join(output,'laboratorio.png')});
  if(ep2){
    const {auditEp2Browser}=await import('./audit-ep2-browser.mjs');
    await auditEp2Browser(page,base,check,output);
  }
  if(ep3){
    const {auditEp3Browser}=await import('./audit-ep3-browser.mjs');
    await auditEp3Browser(page,base,check,output);
  }
  if(ep4){
    await page.goto(base+'/comenzar',{waitUntil:'networkidle'});
    await page.getByRole('link',{name:'Abrir el proyecto integral recuperable'}).click();
    await page.waitForURL('**/comenzar/proyecto-integral');
    check('EP4 navegación al proyecto',await page.getByRole('heading',{level:1}).innerText()==='De una observación a una aplicación recuperable');
    check('EP4 cinco pasos',await page.locator('section.manual-lesson[id]').count()===5);
    await page.getByText('Consultar el código real',{exact:true}).click();
    check('EP4 código completo desplegado',await page.locator('details[open] pre').innerText().then(text=>text.includes('export async function ejecutarRecorrido')));
    const fullCode=await page.locator('details pre').innerText();
    await page.locator('details').getByRole('button',{name:'Copiar ejemplo de código'}).click();
    await page.waitForFunction(()=>document.querySelector('details .copy-toast[data-visible="true"]')?.textContent.includes('copiado'));
    check('EP4 copia fiel del programa',await page.evaluate(()=>navigator.clipboard.readText())===fullCode);
    for(const width of [390,320]){
      await page.setViewportSize({width,height:900});
      check(`EP4 sin desbordamiento ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    await page.screenshot({path:path.join(output,'proyecto-movil.png')});
    await page.setViewportSize({width:1280,height:900});
    await page.screenshot({path:path.join(output,'proyecto-escritorio.png')});
  }
  check('Sin errores cliente',pageErrors.length===0,{pageErrors,failedRequests});
  if(ep5){const {auditEp5Browser}=await import('./audit-ep5-browser.mjs');await auditEp5Browser(page,base,check,output);check('EP5 sin errores cliente',pageErrors.length===0,pageErrors);}
  check('Sin solicitudes fallidas',failedRequests.length===0,failedRequests);
  await browser.close();browser=null;
}catch(error){report.errors.push(error.message);}
finally{
  await browser?.close();
  if(child&&child.exitCode===null){child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve));}
  await fs.writeFile(path.join(output,'servidor.log'),logs.join(''));
  report.status=report.errors.length?'fallido':'aprobado-local';
  await fs.writeFile(path.join(output,'RESULTADO.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({output,status:report.status,checks:report.checks.length,errors:report.errors},null,2));
  if(report.errors.length)process.exitCode=1;
}
