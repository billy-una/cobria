import fs from "node:fs";
import path from "node:path";
import { MongoClient } from "mongodb";
import { MongoDbAdapter } from "../src/adapters/mongodb-adapter.mjs";
import { CouchDbAdapter } from "../src/adapters/couchdb-adapter.mjs";
import { OpenSearchAdapter } from "../src/adapters/opensearch-adapter.mjs";
import { runConformance } from "../src/conformance.mjs";

const engine = process.env.COBRIA_ENGINE;
const runs = Number(process.env.COBRIA_RUNS || 30);
const sizes = (process.env.COBRIA_SIZES || "100,1000,5000").split(",").map(Number);
if (!['mongodb','couchdb','opensearch'].includes(engine)) throw new Error('COBRIA_ENGINE debe ser mongodb, couchdb u opensearch');
if (!Number.isInteger(runs) || runs < 1 || sizes.some(x => !Number.isInteger(x) || x < 1)) throw new Error('Configuración de corridas inválida');

let mongoClient;
async function adapterFor(run, size) {
  if (engine === 'mongodb') {
    mongoClient ??= new MongoClient(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/?directConnection=true');
    await mongoClient.connect();
    return new MongoDbAdapter(mongoClient.db(process.env.MONGODB_DB || 'cobria_core12_batch').collection(`run_${size}_${run}`));
  }
  if (engine === 'couchdb') return new CouchDbAdapter({url:process.env.COUCHDB_URL || 'http://127.0.0.1:5984',database:`cobria_${size}_${run}`,username:process.env.COUCHDB_USER || 'cobria',password:process.env.COUCHDB_PASSWORD || 'cobria_local_only'});
  return new OpenSearchAdapter({url:process.env.OPENSEARCH_URL || 'http://127.0.0.1:9200',index:`cobria-${size}-${run}`});
}

const out = path.resolve(process.env.COBRIA_OUTPUT_DIR || `results/core-1.2-distributed/${engine}`);
fs.mkdirSync(out,{recursive:true});
const rows=[];
try {
  for (const size of sizes) for (let run=1; run<=runs; run++) {
    const adapter=await adapterFor(run,size);
    try { rows.push({...await runConformance(adapter,{engine,size}),run,executedAt:new Date().toISOString()}); }
    finally { await adapter.close(); }
    process.stdout.write(`${engine} n=${size} corrida ${run}/${runs}\n`);
  }
} finally { await mongoClient?.close(); }

const median=values=>{const a=[...values].sort((a,b)=>a-b);const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;};
const summary=sizes.map(size=>{const group=rows.filter(x=>x.size===size);return {engine,size,runs:group.length,allPass:group.every(x=>[x.P1,x.P2,x.R1,x.S1,x.A1].every(y=>y.pass)),canonicalMedianMs:median(group.map(x=>x.P1.canonicalMs)),projectionMedianMs:median(group.map(x=>x.P1.projectionMs)),rebuildMedianMs:median(group.map(x=>x.R1.rebuildMs)),writeAmplification:median(group.map(x=>x.P2.writeAmplification)),foreignDocuments:Math.max(...group.map(x=>x.S1.foreignDocuments))};});
fs.writeFileSync(path.join(out,'raw.jsonl'),rows.map(x=>JSON.stringify(x)).join('\n')+'\n');
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({specification:'COBRIA Core 1.2',engine,runs:rows.length,configuration:{runs,sizes},generatedAt:new Date().toISOString(),summary},null,2));
const report=['# Réplica distribuida COBRIA Core 1.2','',`Motor: ${engine}. Corridas: ${rows.length}.`,`Configuración: ${runs} repeticiones por escala; tamaños ${sizes.join(', ')}.`,'', '| n | corridas | P1–A1 | canónica mediana ms | proyección mediana ms | R1 mediana ms | cruces |','|---:|---:|:---:|---:|---:|---:|---:|',...summary.map(x=>`| ${x.size} | ${x.runs} | ${x.allPass?'sí':'no'} | ${x.canonicalMedianMs.toFixed(3)} | ${x.projectionMedianMs.toFixed(3)} | ${x.rebuildMedianMs.toFixed(3)} | ${x.foreignDocuments} |`),'','Los tiempos pertenecen a esta máquina y configuración local; no son parámetros universales.'].join('\n');
fs.writeFileSync(path.join(out,'REPORT.md'),report+'\n');
console.log(JSON.stringify({engine,rows:rows.length,allPass:summary.every(x=>x.allPass),out},null,2));
