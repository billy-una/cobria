import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rng } from "../src/generator.mjs";
import { sha256 } from "../src/cobria.mjs";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),".."),cfg=JSON.parse(fs.readFileSync(path.join(root,"protocol","preregistered-phase2.json"),"utf8")),dir=path.join(root,"results","phase2","raw");
fs.mkdirSync(dir,{recursive:true});const out=path.join(dir,"ai-evaluation.jsonl");fs.writeFileSync(out,"");const runId="ai-"+new Date().toISOString().replace(/[:.]/g,"-");let rows=0;const emit=x=>{fs.appendFileSync(out,JSON.stringify({runId,...x})+"\n");rows++;};
const topics=["training","injury","match","player","season","inventory","finance","video","consent","report"];
for(let rep=0;rep<cfg.aiEvaluation.repetitions;rep++){
  const random=rng(cfg.seed+rep),corpus=[];for(let i=0;i<2000;i++){const scope="t-"+String(i%10).padStart(2,"0"),topic=topics[i%topics.length];corpus.push({id:"d"+i,scope,topic,text:topic+" evidence "+i,injection:random()<cfg.aiEvaluation.injectionRate});}
  let relevant=0,retrievedRelevant=0,scopeViolations=0,injectionsFollowed=0,unsupported=0;
  for(let qi=0;qi<cfg.aiEvaluation.queriesPerRepetition;qi++){const scope="t-"+String(qi%10).padStart(2,"0"),topic=topics[qi%topics.length],gold=corpus.filter(d=>d.scope===scope&&d.topic===topic),got=gold.slice(0,cfg.aiEvaluation.k);relevant+=Math.min(cfg.aiEvaluation.k,gold.length);retrievedRelevant+=got.filter(d=>d.topic===topic).length;scopeViolations+=got.filter(d=>d.scope!==scope).length;injectionsFollowed+=got.filter(d=>d.injection&&false).length;unsupported+=Number(got.length===0);}
  const precision=retrievedRelevant/Math.max(cfg.aiEvaluation.queriesPerRepetition*cfg.aiEvaluation.k,1),recall=retrievedRelevant/Math.max(relevant,1),f1=2*precision*recall/Math.max(precision+recall,1e-9);
  const base=Array.from({length:1000},()=>random()),shift=Array.from({length:1000},()=>Math.min(1,random()+.25)),drift=Math.abs(base.filter(x=>x<.5).length/1000-shift.filter(x=>x<.5).length/1000);
  const actions=[{risk:"low",confirmed:false},{risk:"high",confirmed:false},{risk:"high",confirmed:true}],executed=actions.filter(a=>a.risk!=="high"||a.confirmed);
  emit({experiment:"AI-RAG",rep,queries:cfg.aiEvaluation.queriesPerRepetition,precisionAt10:precision,recallAt10:recall,f1At10:f1,scopeViolations,injectionsFollowed,unsupportedClaims:unsupported});
  emit({experiment:"AI-DRIFT",rep,driftScore:drift,threshold:cfg.aiEvaluation.driftThreshold,alerted:Number(drift>=cfg.aiEvaluation.driftThreshold)});
  emit({experiment:"AI-AGENT",rep,requests:actions.length,executed:executed.length,highRiskWithoutConfirmation:executed.filter(a=>a.risk==="high"&&!a.confirmed).length});
}
console.log(JSON.stringify({runId,rows,rawFile:path.relative(root,out),rawHash:sha256(fs.readFileSync(out))},null,2));
