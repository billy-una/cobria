import { generate, rng } from "./generator.mjs";
import { sha256 } from "./cobria.mjs";

export function generateSemirealistic({seed,N,tenants,profile,rates}) {
  const base=generate({seed,N,tenants,profile});
  const random=rng(seed^0x9e3779b9), rows=[], anomalies={missingOptionalField:0,legacySchema:0,lateEvent:0,duplicateLogicalEvent:0,unknownCatalogValue:0};
  for (const entity of base.entities) {
    const row={...entity};
    if(random()<rates.missingOptionalField){row.category=null;anomalies.missingOptionalField++;}
    if(random()<rates.legacySchema){row.schemaVersion=0;anomalies.legacySchema++;}
    if(random()<rates.lateEvent){row.eventTime-=30*24*60*60*1000;anomalies.lateEvent++;}
    if(random()<rates.unknownCatalogValue){row.category="desconocido-"+row.id;anomalies.unknownCatalogValue++;}
    rows.push(row);
    if(random()<rates.duplicateLogicalEvent){rows.push({...row,duplicateOf:row.id});anomalies.duplicateLogicalEvent++;}
  }
  return {rows,anomalies,manifest:{seed,N,tenants,profile,rates,hash:sha256(rows)}};
}
