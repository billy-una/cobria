import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { MongoClient } from "mongodb";
import { MongoDbAdapter } from "../src/adapters/mongodb-adapter.mjs";
import { CouchDbAdapter } from "../src/adapters/couchdb-adapter.mjs";
import { OpenSearchAdapter } from "../src/adapters/opensearch-adapter.mjs";
import { runConformance } from "../src/conformance.mjs";

const root=path.resolve(import.meta.dirname,"..");
const protocol=JSON.parse(fs.readFileSync(path.join(root,"protocol/r7-confirmatory.json"),"utf8"));
const engine=process.env.COBRIA_ENGINE;
if(!protocol.engines.includes(engine)) throw new Error(`COBRIA_ENGINE inválido: ${engine}`);
const output=path.resolve(process.env.COBRIA_OUTPUT_DIR||path.join(root,"results/core-r7-confirmatory",engine));
const rawPath=path.join(output,"raw.jsonl");
const selectedSizes=(process.env.COBRIA_SIZES||protocol.sizes.join(",")).split(",").map(Number);
const runs=Number(process.env.COBRIA_RUNS||protocol.runsPerSize);
const warmups=Number(process.env.COBRIA_WARMUPS||protocol.warmupRunsPerSize);
fs.mkdirSync(output,{recursive:true});

function rng(seed){let state=seed>>>0;return()=>((state=(state*1664525+1013904223)>>>0)/4294967296)}
function shuffle(items,seed){const result=[...items],random=rng(seed);for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
let mongo;
async function adapterFor(label,size){
  if(engine==="mongodb"){mongo??=new MongoClient(process.env.MONGODB_URL||"mongodb://127.0.0.1:27017/?directConnection=true");await mongo.connect();return new MongoDbAdapter(mongo.db(process.env.MONGODB_DB||"cobria_r7").collection(`${label}_${size}`))}
  if(engine==="couchdb")return new CouchDbAdapter({url:process.env.COUCHDB_URL||"http://127.0.0.1:5984",database:`cobria_r7_${label}_${size}`,username:process.env.COUCHDB_USER||"cobria",password:process.env.COUCHDB_PASSWORD||"cobria_local_only"});
  return new OpenSearchAdapter({url:process.env.OPENSEARCH_URL||"http://127.0.0.1:9200",index:`cobria-r7-${label}-${size}`});
}
async function execute(label,size,run,measured){
  const adapter=await adapterFor(label,size);const cpuStart=process.cpuUsage();const started=performance.now();
  try{const result=await runConformance(adapter,{engine,size});const cpu=process.cpuUsage(cpuStart);const storage=await adapter.storage();return {...result,run,orderLabel:label,measured,resources:{wallMs:performance.now()-started,cpuUserMicros:cpu.user,cpuSystemMicros:cpu.system,maxRssBytes:process.resourceUsage().maxRSS*1024,...storage},executedAt:new Date().toISOString()}}
  finally{await adapter.close()}
}
const existing=fs.existsSync(rawPath)?fs.readFileSync(rawPath,"utf8").split("\n").filter(Boolean).map(JSON.parse):[];
try{
  for(const size of selectedSizes)for(let index=1;index<=warmups;index++){const adapter=await adapterFor(`warmup_${index}`,size);try{await runConformance(adapter,{engine,size})}finally{await adapter.destroy();await adapter.close()}process.stdout.write(`${engine} calentamiento n=${size} ${index}/${warmups}\n`)}
  const schedule=shuffle(selectedSizes.flatMap(size=>Array.from({length:runs},(_,index)=>({size,run:index+1}))),protocol.seed+protocol.engines.indexOf(engine));
  for(let order=0;order<schedule.length;order++){const {size,run}=schedule[order];if(existing.some(row=>row.size===size&&row.run===run))continue;try{const row=await execute(`run_${String(run).padStart(2,"0")}`,size,run,true);row.order=order+1;fs.appendFileSync(rawPath,`${JSON.stringify(row)}\n`);existing.push(row);process.stdout.write(`${engine} orden=${order+1}/${schedule.length} n=${size} corrida=${run}\n`)}catch(error){const incident={engine,size,run,order:order+1,classification:"interrupción-externa-o-instrumentación",message:String(error?.message??error),recordedAt:new Date().toISOString()};fs.appendFileSync(path.join(output,"incidents.jsonl"),`${JSON.stringify(incident)}\n`);throw error}}
}finally{await mongo?.close()}
const complete=selectedSizes.every(size=>existing.filter(row=>row.size===size).length===runs);
fs.writeFileSync(path.join(output,"run-manifest.json"),JSON.stringify({protocol:protocol.protocol,protocolFrozenAt:protocol.frozenAt,engine,configuration:{sizes:selectedSizes,runs,warmups,seed:protocol.seed,order:protocol.executionOrder},observations:existing.length,complete,allPass:existing.every(row=>protocol.experiments.every(id=>row[id]?.pass)),generatedAt:new Date().toISOString()},null,2)+"\n");
console.log(JSON.stringify({engine,observations:existing.length,complete},null,2));
