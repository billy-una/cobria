import { performance } from 'node:perf_hooks';
import { createHash } from 'node:crypto';
import { readFile, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir, cpus, platform, arch } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function percentil(values,p) {
  if(!values.length || !values.every(Number.isFinite) || !Number.isFinite(p) || p<0 || p>1) throw new Error('MUESTRA_INVALIDA');
  const ordered=[...values].sort((a,b)=>a-b);
  return ordered[Math.max(0,Math.ceil(p*ordered.length)-1)];
}
export async function medir() {
  const protocolBytes=await readFile(new URL('./protocolo.json',import.meta.url));
  const implementationSha256=createHash('sha256').update(await readFile(new URL('./medir.mjs',import.meta.url))).digest('hex');
  const protocolo=JSON.parse(protocolBytes);
  let seed=protocolo.seed;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
  const datos=Array.from({length:protocolo.documents},(_,i)=>({id:`obs-${i}`,ambito:`reserva-${i%50}`,cantidad:i%7+1}));
  const inicio=performance.now();
  const indice=new Map();
  for(const dato of datos){const key=JSON.stringify([dato.ambito,dato.id]);indice.set(key,dato.cantidad);}
  const indexBuildMs=performance.now()-inicio;
  const bytesCanonicos=Buffer.byteLength(JSON.stringify(datos));
  const bytesIndiceSerializado=Buffer.byteLength(JSON.stringify([...indice]));
  const consultar={barrido:(q)=>datos.find(d=>d.id===q.id && d.ambito===q.ambito)?.cantidad ?? null,
    'indice-memoria':q=>indice.get(JSON.stringify([q.ambito,q.id])) ?? null};
  const corridas=[];
  for(let pair=0;pair<protocolo.warmupPairs+protocolo.measuredPairs;pair++){
    const queries=Array.from({length:protocolo.queriesPerPair},()=>{
      const i=Math.floor(random()*datos.length);const ambito=random()<.15?'reserva-ajena':datos[i].ambito;
      return {id:datos[i].id,ambito,esperado:ambito===datos[i].ambito?datos[i].cantidad:null};
    });
    const order=random()<.5?[...protocolo.variants]:[...protocolo.variants].reverse();
    const expected=queries.map(q=>q.esperado);
    const par={pair:pair-protocolo.warmupPairs,order,times:{}};
    for(const variant of order){
      const start=performance.now();const results=queries.map(consultar[variant]);const elapsed=performance.now()-start;
      if(JSON.stringify(results)!==JSON.stringify(expected)) throw new Error('RESULTADOS_NO_EQUIVALENTES');
      par.times[variant]=elapsed;
    }
    if(pair>=protocolo.warmupPairs)corridas.push(par);
  }
  const resumen=Object.fromEntries(protocolo.variants.map(variant=>{
    const values=corridas.map(row=>row.times[variant]);
    return [variant,{n:values.length,p50:percentil(values,.5),p95:percentil(values,.95),p99:percentil(values,.99),min:Math.min(...values),max:Math.max(...values)}];
  }));
  return {protocolo,implementationSha256,protocolSha256:createHash('sha256').update(protocolBytes).digest('hex'),environment:{node:process.version,platform:platform(),arch:arch(),cpu:cpus()[0]?.model},indexBuildMs,bytesCanonicos,bytesIndiceSerializado,corridas,resumen,limitePercentiles:'Con 30 pares, p99 es el máximo observado, no una estimación fiable de cola.',published:false};
}
if(process.argv[1] && fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
  const resultado=await medir();
  const directory=await mkdtemp(path.join(tmpdir(),'cobria-c6-medicion-'));
  const file=path.join(directory,'medicion.json');
  await writeFile(file,JSON.stringify(resultado,null,2),{flag:'wx'});
  console.log(JSON.stringify({report:file,resumen:resultado.resumen,indexBuildMs:resultado.indexBuildMs,limites:resultado.protocolo.limits},null,2));
}
