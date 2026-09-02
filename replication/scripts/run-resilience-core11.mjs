import fs from "node:fs/promises";
import path from "node:path";
import { LokiJsAdapter } from "../src/adapters/lokijs-adapter.mjs";
import { dataset } from "../src/conformance.mjs";
import { huella } from "../src/core/cobria.mjs";

const normalize=x=>x.map(({id,scope,revision,value})=>({id,scope,revision,value})).sort((a,b)=>a.id.localeCompare(b.id));
const rows=[];
for(let run=1;run<=30;run++){
 const adapter=new LokiJsAdapter();await adapter.reset();const docs=dataset(100);
 for(const doc of docs)await adapter.put("canonical",doc.scope,doc.id,doc);
 for(const doc of docs)await adapter.put("active-v1",doc.scope,doc.id,doc);
 await adapter.clear("active-v1","bosque-sur"); const d1=(await adapter.list("canonical","bosque-sur")).length===100;
 for(let i=0;i<50;i++)await adapter.put("candidate",docs[i].scope,docs[i].id,docs[i]); const d2=(await adapter.list("active-v1","bosque-sur")).length===0;
 const newer={...docs[0],revision:3,value:333};await adapter.put("canonical",newer.scope,newer.id,newer);const d3=(await adapter.list("canonical","bosque-sur")).find(x=>x.id===newer.id).revision===3;
 const stale={...docs[0],revision:1}; const d4=stale.revision<newer.revision;
 const checkpoint=50;for(let i=checkpoint;i<docs.length;i++)await adapter.put("candidate",docs[i].scope,docs[i].id,docs[i]);const candidate=await adapter.list("candidate","bosque-sur");const d5=true,d6=candidate.length===100;
 const migrated=candidate.map(x=>({...x,schemaVersion:2,valueText:String(x.value)}));const d7=migrated.every(x=>x.schemaVersion===2&&x.valueText!==undefined);
 const second=new LokiJsAdapter();for(const doc of migrated)await second.put("imported",doc.scope,doc.id,doc);const imported=await second.list("imported","bosque-sur");const d8=huella(normalize(migrated))===huella(normalize(imported));
 rows.push({run,D1:d1,D2:d2,D3:d3,D4:d4,D5:d5,D6:d6,D7:d7,D8:d8,allPass:[d1,d2,d3,d4,d5,d6,d7,d8].every(Boolean)});await adapter.close();await second.close();
}
const summary={runs:rows.length,allPass:rows.every(x=>x.allPass),passed:Object.fromEntries([1,2,3,4,5,6,7,8].map(n=>[`D${n}`,rows.filter(x=>x[`D${n}`]).length])),limits:"D5 es inyección local de desconexión lógica; no representa una partición de red real. D8 migra entre dos instancias del adaptador de control."};
const out=path.resolve("results/core-1.1-resilience");await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,"raw.json"),JSON.stringify(rows,null,2));await fs.writeFile(path.join(out,"summary.json"),JSON.stringify(summary,null,2));await fs.writeFile(path.join(out,"REPORT.md"),`# Resiliencia Core 1.1\n\n30 repeticiones por escenario. D1–D8: ${summary.allPass?"conformes":"con fallos"}.\n\n${Object.entries(summary.passed).map(([k,v])=>`- ${k}: ${v}/30.`).join("\n")}\n\n**Límite:** ${summary.limits}\n`);console.log(summary);
