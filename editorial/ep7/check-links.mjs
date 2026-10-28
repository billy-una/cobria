// Consulta pública explícita; la verificación ordinaria usa la captura conservada.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {readBib,root} from './bib.mjs';
if(!process.argv.includes('--refresh'))throw Error('Use --refresh para una consulta de red nueva; el gate ordinario es sin red.');
const selection=JSON.parse(fs.readFileSync(path.join(root,'editorial/ep7/selection.json')));
const checkedAt=new Date().toISOString();
const only=process.argv.find(x=>x.startsWith('--only='))?.slice(7).split(',');
const previous=only?JSON.parse(fs.readFileSync(path.join(root,'editorial/ep7/link-check.json'))):null;
const queue=readBib().filter(x=>!only||only.includes(x.id));const results=[];
async function request(url,metadata=false){
  try{
    const r=await fetch(url,{headers:{'user-agent':'COBRIA-bibliographic-audit/1.0 (public source verification)'},signal:AbortSignal.timeout(18000)});
    const hash=createHash('sha256');let bytes=0;const chunks=[];
    for await(const chunk of r.body){bytes+=chunk.length;if(bytes>6*1024**2){await r.body?.cancel().catch(()=>{});throw Error('respuesta mayor al límite de 6 MiB');}hash.update(chunk);if(metadata)chunks.push(chunk);}
    let record=null;if(metadata&&r.ok){const data=JSON.parse(Buffer.concat(chunks).toString());const m=data.message??data.data?.attributes;
      record=data.message?{title:m.title,subtitle:m.subtitle,author:m.author?.map(x=>({family:x.family,given:x.given,name:x.name})),published:m.published,volume:m.volume,issue:m.issue,page:m.page,publisher:m.publisher,container:m['container-title']}:{title:m?.titles,creators:m?.creators,publicationYear:m?.publicationYear,publisher:m?.publisher};}
    return {requestedUrl:url,finalUrl:r.url,status:r.status,ok:r.ok,bytes,sha256:hash.digest('hex'),metadata:record};
  }catch(error){return {requestedUrl:url,ok:false,status:null,error:error.message};}
}
await Promise.all(Array.from({length:3},async()=>{while(queue.length){const row=queue.shift();const url=selection.sourceOverrides[row.id]?.url??row.url??'https://doi.org/'+row.doi;
  const link=await request(url);const doi=row.doi?await request((row.doi.startsWith('10.48550/')?'https://api.datacite.org/dois/':'https://api.crossref.org/works/')+encodeURIComponent(row.doi),true):null;
  const prior=previous?.records.find(x=>x.id===row.id);
  results.push({id:row.id,checkedAt,link,doi,...(prior?{previousAttempts:[...(prior.previousAttempts??[]),{checkedAt:prior.checkedAt??previous.checkedAt,link:prior.link,doi:prior.doi}]}:{})});console.log(`${row.id}: enlace ${link.status??'error'}${doi?`, metadatos ${doi.status??'error'}`:''}`);
}}));
if(previous)for(const r of previous.records)if(!results.some(x=>x.id===r.id))results.push({...r,checkedAt:r.checkedAt??previous.checkedAt});
results.sort((a,b)=>a.id.localeCompare(b.id));
const report={schemaVersion:'1.0.0',checkedAt,method:'GET público con límite; SHA de respuesta observada. HTTP no prueba exactitud ni lectura íntegra. Sin credenciales ni texto de terceros redistribuido.',records:results};
fs.writeFileSync(path.join(root,'editorial/ep7/link-check.json'),JSON.stringify(report,null,2)+'\n');
console.log(`${results.length} entradas consultadas; los errores se conservan, no se etiquetan como enlaces verificados.`);
