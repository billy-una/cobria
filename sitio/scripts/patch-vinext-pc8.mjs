import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const originalHash='fe8c1e29328f72315f5c5193e411f4c800860d46c6b14d48e5a048447cca8e2a';
const hash=s=>createHash('sha256').update(s).digest('hex');
const header='async function sendWebResponse(webResponse, req, res, compress) {';
const guard='\n\tif (res.destroyed || res.writableEnded) {\n\t\tif (webResponse.body) await webResponse.body.cancel("client disconnected");\n\t\treturn;\n\t}';
const before='\t\tpipeline(nodeStream, compressor, res, () => {});\n\t} else pipeline(nodeStream, res, () => {});';
const after='\t\tawait cobriaPc8Pipe([nodeStream, compressor, res], res);\n\t} else await cobriaPc8Pipe([nodeStream, res], res);';
const cacheBefore='\t\t"Cache-Control": cacheControl,';
const cacheAfter='\t\t"cache-control": cacheControl,';
const helperV1=`// COBRIA PC8: parche local versionado para vinext 1.0.0-beta.10.
function cobriaPc8Pipe(stages, res) {
  return new Promise((resolve, reject) => {
    const done = (error) => {
      const disconnected = res.destroyed && !res.writableFinished &&
        ["ERR_STREAM_PREMATURE_CLOSE", "ERR_STREAM_UNABLE_TO_PIPE", "ECONNRESET", "ABORT_ERR"].includes(error?.code);
      if (!error || disconnected) resolve(); else reject(error);
    };
    try { pipeline(...stages, done); } catch (error) { done(error); }
  });
}
`;
const staticHeader='async function tryServeStatic(req, res, clientDir, pathname, compress, cache, extraHeaders, statusCode) {';
const staticGuard='\n\textraHeaders = cobriaPc8StaticHeaders(extraHeaders);';
const helper=helperV1+`function cobriaPc8StaticHeaders(headers) {
  if (!headers) return headers;
  const result = { ...headers };
  let cacheControl;
  for (const key of Object.keys(result)) {
    if (key.toLowerCase() === "cache-control") {
      cacheControl = result[key];
      delete result[key];
    }
  }
  if (cacheControl !== undefined) result["Cache-Control"] = cacheControl;
  return result;
}
`;
export function patchedSource(source){
  if(source.includes(helperV1)){
    const restored=source.replace(helper,'').replace(helperV1,'').replace(header+guard,header).replace(after,before).replaceAll(cacheAfter,cacheBefore).replace(staticHeader+staticGuard,staticHeader);
    if(hash(restored)!==originalHash)throw Error('VINEXT_PATCHED_SOURCE_DIVERGED');
    source=restored;
  }
  if(hash(source)!==originalHash)throw Error('VINEXT_UPSTREAM_SOURCE_DIVERGED');
  if(!source.includes(before)||!source.includes(header))throw Error('VINEXT_PATCH_CONTEXT_MISSING');
  if(source.split(cacheBefore).length!==3)throw Error('VINEXT_STATIC_CACHE_CONTEXT_MISSING');
  if(!source.includes(staticHeader))throw Error('VINEXT_STATIC_CACHE_CONTEXT_MISSING');
  return source.replace(header,helper+header+guard).replace(before,after).replace(staticHeader,staticHeader+staticGuard);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=path.resolve(import.meta.dirname,'..'),packagePath=path.join(root,'node_modules/vinext');
  const pkg=JSON.parse(await fs.readFile(path.join(packagePath,'package.json')));
  if(pkg.version!=='1.0.0-beta.10')throw Error('VINEXT_VERSION_NOT_REVIEWED');
  const file=path.join(packagePath,'dist/server/prod-server.js'),source=await fs.readFile(file,'utf8'),patched=patchedSource(source);
  if(process.argv.includes('--check')&&source!==patched)throw Error('VINEXT_PATCH_NOT_INSTALLED');
  if(source!==patched)await fs.writeFile(file,patched);
  console.log(JSON.stringify({patch:'COBRIA-PC8-stream-v3',version:pkg.version,sha256:hash(patched),checked:true}));
}
