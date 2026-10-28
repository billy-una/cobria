import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http, {ServerResponse} from 'node:http';
import {gunzipSync} from 'node:zlib';
import {sendWebResponse} from '../node_modules/vinext/dist/server/prod-server.js';
import {patchedSource} from '../scripts/patch-vinext-pc8.mjs';

test('PC8 el parche es idempotente y rechaza una fuente desconocida',async()=>{
  const source=await fs.readFile(new URL('../node_modules/vinext/dist/server/prod-server.js',import.meta.url),'utf8');
  assert.equal(patchedSource(source),source);
  assert.equal(source.split('\t\t"Cache-Control": cacheControl,').length,3);
  assert.equal(source.split('extraHeaders = cobriaPc8StaticHeaders(extraHeaders);').length,2);
  assert.throws(()=>patchedSource('// modificado\n'+source),/DIVERGED/);
  assert.throws(()=>patchedSource('otra versión'),/DIVERGED/);
});
test('PC8 destino cerrado antes de enviar cancela la fuente sin excepción',async()=>{
  let cancelled=false;const response=new ServerResponse({method:'GET'});response.destroy();
  const body=new ReadableStream({cancel(){cancelled=true;}});
  await sendWebResponse(new Response(body),{method:'GET',headers:{}},response,false);
  assert.equal(cancelled,true);
});
test('PC8 HTTP conserva errores, compresión y continuidad tras desconexión', {timeout:10000}, async t=>{
  const failures=[];let cancelled=false,sourceFailure=false;
  const server=http.createServer(async(req,res)=>{
    let response;
    if(req.url==='/slow'){
      let timer;const stream=new ReadableStream({start(controller){timer=setInterval(()=>controller.enqueue(new TextEncoder().encode('aves\n'.repeat(1000))),10);},cancel(){clearInterval(timer);cancelled=true;}});
      response=new Response(stream,{headers:{'content-type':'text/plain'}});
    }else if(req.url==='/broken'){
      response=new Response(new ReadableStream({start(controller){controller.error(Object.assign(new Error('SOURCE_FAILED'),{code:'SOURCE_FAILED'}));}}));
    }else response=new Response('colibri '.repeat(1000),{status:req.url==='/error'?503:200,headers:{'content-type':'text/plain'}});
    try{await sendWebResponse(response,req,res,true);}
    catch(error){if(error.code==='SOURCE_FAILED')sourceFailure=true;else failures.push(error.message);if(!res.destroyed)res.destroy();}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
  const port=server.address().port;
  const get=(route,headers={})=>new Promise((resolve,reject)=>{
    const req=http.get({hostname:'127.0.0.1',port,path:route,headers},res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)}));});req.on('error',reject);
  });
  assert.equal((await get('/')).status,200);assert.equal((await get('/error')).status,503);
  const gzip=await get('/',{'accept-encoding':'gzip'});assert.equal(gzip.headers['content-encoding'],'gzip');assert.equal(gunzipSync(gzip.body).toString(),'colibri '.repeat(1000));
  await new Promise((resolve,reject)=>{
    const req=http.get({hostname:'127.0.0.1',port,path:'/slow'},res=>res.once('data',()=>{req.destroy();resolve();}));req.on('error',e=>e.code==='ECONNRESET'?resolve():reject(e));
  });
  for(let i=0;i<50&&!cancelled;i++)await new Promise(r=>setTimeout(r,10));
  assert.equal(cancelled,true);
  await assert.rejects(()=>get('/broken'));
  for(let i=0;i<50&&!sourceFailure;i++)await new Promise(r=>setTimeout(r,10));
  assert.equal(sourceFailure,true,'No ocultar errores reales del productor');
  assert.equal((await get('/')).status,200);assert.deepEqual(failures,[]);
});
