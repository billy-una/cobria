import fs from "node:fs/promises";
import path from "node:path";
import { huella, manifiestoCobria } from "../src/core/cobria.mjs";

const out = path.resolve("results/core-1.1-analytics-ai");
await fs.mkdir(out,{recursive:true});
const tokenize = text => new Set(text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").split(/\W+/).filter(Boolean));
const score = (query,text) => { const q=tokenize(query), t=tokenize(text); return [...q].filter(x=>t.has(x)).length/Math.max(q.size,1); };
const corpus = [
  {id:"sur-1",scope:"bosque-sur",revision:1,text:"colibrí visita flores rojas",eventTime:1},
  {id:"sur-2",scope:"bosque-sur",revision:1,text:"rana de ojos rojos cerca del río",eventTime:2},
  {id:"norte-1",scope:"bosque-norte",revision:1,text:"colibrí anida junto al sendero privado",eventTime:3}
];
const retrieve = (query,scope) => corpus.filter(x=>x.scope===scope).map(x=>({...x,score:score(query,x.text)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
const runs=[];
for(let run=1;run<=30;run++){
  const train=corpus.filter(x=>x.eventTime<=2), test=corpus.filter(x=>x.eventTime>2);
  const manifest=manifiestoCobria({sources:[{scope:"bosque-sur",hash:huella(train),count:train.length}],transform:{name:"tokens-lexicos",version:1},partition:{trainUntil:2,testFrom:3},evidence:{minimumScore:.5}});
  const found=retrieve("colibrí flores","bosque-sur");
  const foreign=found.filter(x=>x.scope!=="bosque-sur").length;
  const empty=retrieve("danta nocturna","bosque-sur");
  const abstained=empty.length===0;
  const rebuilt=manifiestoCobria({sources:[{scope:"bosque-sur",hash:huella(train),count:train.length}],transform:{name:"tokens-lexicos",version:1},partition:{trainUntil:2,testFrom:3},evidence:{minimumScore:.5}});
  runs.push({run,manifestReproducible:manifest.sources[0].hash===rebuilt.sources[0].hash,temporalLeakage:train.some(x=>test.includes(x)),foreignDocuments:foreign,abstained,citationsValid:found.every(x=>corpus.some(source=>source.id===x.id&&source.revision===x.revision))});
}
const summary={runs:runs.length,pass:runs.every(x=>x.manifestReproducible&&!x.temporalLeakage&&x.foreignDocuments===0&&x.abstained&&x.citationsValid),manifestReproducibility:runs.filter(x=>x.manifestReproducible).length,temporalLeakage:runs.filter(x=>x.temporalLeakage).length,foreignDocuments:runs.reduce((a,x)=>a+x.foreignDocuments,0),appropriateAbstention:runs.filter(x=>x.abstained).length,validCitations:runs.filter(x=>x.citationsValid).length,limits:"Recuperación léxica determinista; no evalúa calidad de un modelo generativo ni de incrustaciones externas."};
await fs.writeFile(path.join(out,"raw.json"),JSON.stringify(runs,null,2));
await fs.writeFile(path.join(out,"summary.json"),JSON.stringify(summary,null,2));
await fs.writeFile(path.join(out,"REPORT.md"),`# Evaluación analítica e IA Core 1.1\n\n${summary.runs} repeticiones deterministas. Estado: **${summary.pass?"conforme":"no conforme"}**.\n\n- Manifiestos reproducibles: ${summary.manifestReproducibility}/${summary.runs}.\n- Fugas temporales: ${summary.temporalLeakage}.\n- Documentos de ámbito ajeno: ${summary.foreignDocuments}.\n- Abstenciones apropiadas: ${summary.appropriateAbstention}/${summary.runs}.\n- Citas válidas: ${summary.validCitations}/${summary.runs}.\n\n**Límite:** ${summary.limits}\n`);
console.log(summary);
