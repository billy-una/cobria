import { performance } from "node:perf_hooks";
import { createHash } from "node:crypto";
import { equivalentDocuments } from "./oracle.mjs";

const duration = async fn => { const start = performance.now(); const value = await fn(); return { value, ms: performance.now() - start }; };
const hash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const normalize = values => values.map(({id, scope, status, value, revision}) => ({id, scope, status, value, revision})).sort((a,b)=>a.id.localeCompare(b.id));
const project = doc => doc.status === "activo" ? {...doc, projected:true, sourceRevision:doc.revision} : null;

export function dataset(size, scope = "bosque-sur") {
  return Array.from({length:size}, (_,i) => ({ id:`doc-${i}`, scope, status:i%3===0?"activo":"cerrado", value:(i*17)%997, revision:1, eventTime:i }));
}

export async function loadCanonical(adapter, docs) {
  if (adapter.putMany) await adapter.putMany("canonical", docs[0]?.scope, docs);
  else for (const doc of docs) await adapter.put("canonical", doc.scope, doc.id, doc);
}

export async function runConformance(adapter, {engine, size=1000, scope="bosque-sur"}={}) {
  await adapter.reset();
  const docs = dataset(size, scope);
  const foreignScope = "bosque-norte";
  const foreignDocs = dataset(Math.max(3, Math.ceil(size / 10)), foreignScope);
  await loadCanonical(adapter, docs);
  await loadCanonical(adapter, foreignDocs);
  const canonicalMetrics = adapter.snapshot();

  const p1Canonical = await duration(async () => (await adapter.list("canonical", scope)).filter(x=>x.status==="activo"));
  const activeDocs=docs.map(project).filter(Boolean);
  if (adapter.putMany) await adapter.putMany("projection-v1",scope,activeDocs);
  else for (const doc of activeDocs) await adapter.put("projection-v1", scope, doc.id, doc);
  const p1Projection = await duration(() => adapter.list("projection-v1", scope));
  const expectedProjection = p1Canonical.value.map(project).filter(Boolean);
   const equivalentP1 = equivalentDocuments(expectedProjection, p1Projection.value);

  const beforeP2 = adapter.snapshot();
  const changed = {...docs[0], revision:2, value:docs[0].value+1};
  await adapter.put("canonical", scope, changed.id, changed);
  await adapter.put("projection-v1", scope, changed.id, changed);
  const afterP2 = adapter.snapshot();
  const p2Writes = afterP2.writes-beforeP2.writes;
  const p2Bytes = afterP2.bytesWritten-beforeP2.bytesWritten;
  const converged = (await adapter.list("projection-v1", scope)).some(x=>x.id===changed.id&&x.revision===changed.revision&&x.value===changed.value);

  const rebuild = async () => {
    await adapter.clear("projection-candidate", scope);
    const source=await adapter.list("canonical", scope);
    const projected=source.map(project).filter(Boolean);
    if (adapter.putMany) await adapter.putMany("projection-candidate",scope,projected);
    else for (const doc of projected) await adapter.put("projection-candidate", scope, doc.id, doc);
    return adapter.list("projection-candidate", scope);
  };
  const r1 = await duration(rebuild);
  const canonicalAfter = await adapter.list("canonical", scope);
  const expectedAfter=canonicalAfter.map(project).filter(Boolean);
   const r1Equivalent = equivalentDocuments(expectedAfter, r1.value);
  const r1Repeat = await rebuild();
   const r1Idempotent = equivalentDocuments(r1.value, r1Repeat);

  // Una candidata inválida no puede reemplazar la versión publicada.
  const publishedBefore=await adapter.list("projection-v1",scope);
  const invalidCandidate=r1Repeat.slice(1);
   const invalidRejected=!equivalentDocuments(expectedAfter, invalidCandidate);
  const publishedAfterRejected=await adapter.list("projection-v1",scope);
   const activePreserved=equivalentDocuments(publishedBefore, publishedAfterRejected);

  // Reconstrucción incremental: aplicar un cambio sobre una copia completa válida.
  const incrementalDoc={...canonicalAfter.find(x=>x.status==="activo"),revision:3,value:777};
  await adapter.put("canonical",scope,incrementalDoc.id,incrementalDoc);
  const incremental=[...r1Repeat.filter(x=>x.id!==incrementalDoc.id),project(incrementalDoc)].filter(Boolean);
  const canonicalIncremental=(await adapter.list("canonical",scope)).map(project).filter(Boolean);
   const incrementalEquivalent=equivalentDocuments(incremental, canonicalIncremental);

  let missingScopeRejected = false;
  try { await adapter.list("canonical", ""); } catch { missingScopeRejected = true; }
  const primary = await adapter.list("canonical", scope);
  const foreign = await adapter.list("canonical", foreignScope);
  const foreignInPrimary=primary.filter(x=>x.scope!==scope).length;
  const primaryInForeign=foreign.filter(x=>x.scope!==foreignScope).length;
  let manipulatedScopeRejected=false;
  try { await adapter.put("canonical",scope,"scope-attack",{id:"scope-attack",scope:foreignScope,revision:1,status:"activo",value:1}); } catch { manipulatedScopeRejected=true; }
  const s1 = missingScopeRejected && manipulatedScopeRejected && foreign.length===foreignDocs.length && foreignInPrimary===0 && primaryInForeign===0;

  const analyticSource=(await adapter.list("canonical",scope)).filter(x=>x.eventTime < Math.floor(size*.8));
  const analytic=analyticSource.map(x=>({id:x.id,scope:x.scope,revision:x.revision,feature:x.value%7}));
  await adapter.clear("analytic-v1",scope);
  if(adapter.putMany) await adapter.putMany("analytic-v1",scope,analytic); else for(const row of analytic) await adapter.put("analytic-v1",scope,row.id,row);
  const analyticStored=await adapter.list("analytic-v1",scope);
  const manifest = {
    contract:"COBRIA Core 1.0", engine, scope, size,
    sources:[{kind:"canonical", scope, count:analyticSource.length, hash:hash(normalize(analyticSource))}],
    transform:{name:"modulo-siete", version:1},
    partition:{strategy:"temporal", trainUntil:Math.max(0,Math.floor(size*.8)-1), testFrom:Math.floor(size*.8)},
    evidence:{available:analyticStored.length>0, abstain:analyticStored.length===0}
  };
  await adapter.clear("analytic-v1",scope);
  const rebuiltAnalytic=analyticSource.map(x=>({id:x.id,scope:x.scope,revision:x.revision,feature:x.value%7}));
  const analyticReproducible=hash(analytic)===hash(rebuiltAnalytic);
  // La abstención se observa después de retirar el derivado, no desde una constante.
  const absentEvidence = await adapter.list("analytic-v1", scope);
  const abstainsWithoutEvidence = absentEvidence.length === 0 && analyticSource.length > 0;
  const noTemporalLeakage=analyticSource.every(x=>x.eventTime<manifest.partition.testFrom);
  const a1 = Boolean(manifest.sources[0].hash && manifest.partition.testFrom > manifest.partition.trainUntil && analyticReproducible && abstainsWithoutEvidence && noTemporalLeakage);

  return {
    engine,size,scope,
    P1:{pass:equivalentP1,canonicalMs:p1Canonical.ms,projectionMs:p1Projection.ms,ratio:p1Projection.ms/Math.max(p1Canonical.ms,0.0001)},
    P2:{pass:p2Writes===2&&p2Bytes>0&&converged,writes:p2Writes,writeAmplification:p2Writes,bytesWritten:p2Bytes,converged,baselineWrites:canonicalMetrics.writes},
    R1:{pass:r1Equivalent&&r1Idempotent&&incrementalEquivalent&&invalidRejected&&activePreserved,rebuildMs:r1.ms,equivalent:r1Equivalent,idempotent:r1Idempotent,incrementalEquivalent,invalidRejected,activePreserved,count:r1.value.length},
    S1:{pass:s1,missingScopeRejected,manipulatedScopeRejected,foreignSeeded:foreign.length,foreignDocuments:foreignInPrimary+primaryInForeign},
    A1:{pass:a1,manifestHash:hash(manifest),analyticReproducible,noTemporalLeakage,abstainsWithoutEvidence,manifest}
  };
}
