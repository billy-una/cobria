import fs from "node:fs";
import path from "node:path";
import { PouchDbAdapter } from "../src/adapters/pouchdb-adapter.mjs";
import { LokiJsAdapter } from "../src/adapters/lokijs-adapter.mjs";
import { runConformance } from "../src/conformance.mjs";

const out = path.resolve("results/nosql-core-1.0");
fs.mkdirSync(out,{recursive:true});
const rows=[];
for (const [engine,Factory] of [["PouchDB",PouchDbAdapter],["LokiJS",LokiJsAdapter]]) {
  for (const size of [100,1000,5000]) {
    for (let run=1; run<=30; run++) {
      const adapter = new Factory(`cobria-${engine.toLowerCase()}-${size}-${run}`);
      try { rows.push({...await runConformance(adapter,{engine,size}),run}); }
      finally { await adapter.close(); }
    }
  }
}
fs.writeFileSync(path.join(out,"raw.jsonl"),rows.map(x=>JSON.stringify(x)).join("\n")+"\n");
const summary=[];
for (const engine of ["PouchDB","LokiJS"]) for (const size of [100,1000,5000]) {
  const group=rows.filter(x=>x.engine===engine&&x.size===size);
  const median=values=>{const a=[...values].sort((a,b)=>a-b);return a[Math.floor(a.length/2)]};
  summary.push({engine,size,runs:group.length,allPass:group.every(x=>[x.P1,x.P2,x.R1,x.S1,x.A1].every(y=>y.pass)),p1CanonicalMedianMs:median(group.map(x=>x.P1.canonicalMs)),p1ProjectionMedianMs:median(group.map(x=>x.P1.projectionMs)),r1MedianMs:median(group.map(x=>x.R1.rebuildMs)),writeAmplification:median(group.map(x=>x.P2.writeAmplification)),foreignDocuments:Math.max(...group.map(x=>x.S1.foreignDocuments))});
}
fs.writeFileSync(path.join(out,"summary.json"),JSON.stringify({specification:"COBRIA Core 1.0",generatedAt:new Date().toISOString(),runs:rows.length,summary},null,2));
const cols=Object.keys(summary[0]);
fs.writeFileSync(path.join(out,"summary.csv"),[cols.join(","),...summary.map(r=>cols.map(c=>r[c]).join(","))].join("\n")+"\n");
console.log(JSON.stringify({runs:rows.length,groups:summary.length,allPass:summary.every(x=>x.allPass),out},null,2));
