import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import {spawn} from 'node:child_process';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const site=path.resolve(process.argv[2]??'');
const pkg=JSON.parse(await fs.readFile(path.join(site,'package.json')));
assert.equal(pkg.name,'site-creator-vinext-starter');
await fs.access(path.join(site,'dist/server/index.js'));
const root=path.resolve(import.meta.dirname,'../..'),out=path.join(root,'output/review/pc8');await fs.mkdir(out,{recursive:true});
const id=Date.now(),logs=[];let checks=0,child;
const report={kind:'servidor-Vinext-integral-local',site,checks:0,earlyDisconnects:0,lateDisconnects:0,remote:false,status:'pendiente'};
const reservation=http.createServer();await new Promise(r=>reservation.listen(0,'127.0.0.1',r));const port=reservation.address().port;await new Promise(r=>reservation.close(r));
try{
  child=spawn(process.execPath,['node_modules/vinext/dist/cli.js','start','--port',String(port),'--hostname','127.0.0.1'],{cwd:site,stdio:['ignore','pipe','pipe']});
  child.stdout.on('data',b=>logs.push(b.toString()));child.stderr.on('data',b=>logs.push(b.toString()));
  const url=`http://127.0.0.1:${port}`;let ready=false;
  for(let i=0;i<100;i++){try{const r=await fetch(url+'/mapa',{signal:AbortSignal.timeout(1000)});if(r.status===200){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}
  assert.equal(ready,true,'El servidor no inició');checks++;
  const raw=(pathname,headers={})=>new Promise((resolve,reject)=>{const req=http.get(url+pathname,{headers},res=>{const data=[];res.on('data',b=>data.push(b));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(data)}));});req.on('error',reject);});
  const gzip=await raw('/mapa',{'accept-encoding':'gzip'});assert.equal(gzip.status,200);assert.equal(gzip.headers['content-encoding'],'gzip');assert.ok(gunzipSync(gzip.body).toString().includes('Glosario del libro'));checks++;
  const asset=await raw('/fonts/Inter-400.ttf');const expected=await fs.readFile(path.join(site,'public/fonts/Inter-400.ttf'));
  assert.equal(asset.status,200);assert.equal(asset.headers['content-type'],'font/ttf');assert.equal(createHash('sha256').update(asset.body).digest('hex'),createHash('sha256').update(expected).digest('hex'));checks++;
  for(const header of ['content-security-policy','x-content-type-options','x-frame-options'])assert.ok(asset.headers[header]);checks++;
  for(const route of ['/lecturas/libro.html','/downloads/manifest.json']){
    const response=await raw(route);assert.equal(response.status,200,route);
    const local=await fs.readFile(path.join(site,'public',route.slice(1)));
    assert.equal(createHash('sha256').update(response.body).digest('hex'),createHash('sha256').update(local).digest('hex'),route);checks++;
    assert.equal(response.headers['cache-control'],route.endsWith('.json')?'public, max-age=0, must-revalidate':'no-cache');checks++;
    const conditional=await raw(route,{'if-none-match':response.headers.etag});
    assert.equal(conditional.status,304);assert.equal(conditional.headers['cache-control'],response.headers['cache-control']);checks++;
  }
  assert.equal((await raw('/ruta-pc8-inexistente')).status,404);checks++;
  for(let i=0;i<20;i++){
    await new Promise((resolve,reject)=>{const socket=net.connect(port,'127.0.0.1',()=>socket.write(`GET /mapa?pc8=early-${i} HTTP/1.1\r\nHost: 127.0.0.1:${port}\r\nConnection: close\r\n\r\n`,()=>{socket.destroy();resolve();}));socket.on('error',reject);});report.earlyDisconnects++;
    await new Promise((resolve,reject)=>{const req=http.get(url+`/mapa?pc8=late-${i}`,{headers:i%2?{'accept-encoding':'gzip'}:{}},res=>res.once('data',()=>{req.destroy();resolve();}));req.on('error',e=>e.code==='ECONNRESET'?resolve():reject(e));});report.lateDisconnects++;
  }
  assert.equal((await raw('/mapa')).status,200);checks++;
  await new Promise(r=>setTimeout(r,200));
  assert.doesNotMatch(logs.join(''),/ERR_STREAM_UNABLE_TO_PIPE|uncaughtException|unhandledRejection|\[vinext\] Server error:/);checks++;
  report.status='aprobado';report.limit='Una instancia local y 40 cancelaciones; no demuestra ausencia de todo fallo de red ni rendimiento distribuido.';
}catch(error){report.status='fallido';report.error=error.message;process.exitCode=1;}
finally{
  if(child&&child.exitCode===null){child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}
  report.checks=checks;await fs.writeFile(path.join(out,`server-${id}.log`),logs.join(''));await fs.writeFile(path.join(out,`server-${id}.json`),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
