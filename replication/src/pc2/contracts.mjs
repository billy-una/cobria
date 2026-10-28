import PouchDB from 'pouchdb';
import {createHash} from 'node:crypto';

export const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const requireCondition=(ok,code)=>{if(!ok)throw new Error(code);};
const scopeValid=scope=>requireCondition(typeof scope==='string'&&/^[a-z][a-z0-9-]{1,31}$/.test(scope),'SCOPE_INVALID');
const versionValid=version=>requireCondition(typeof version==='string'&&/^[a-z][a-z0-9-]{0,31}$/.test(version),'VERSION_INVALID');
export const project=({id,scope,status,value,revision})=>({id,scope,status,value,revision});
const reference=docs=>docs.filter(d=>d.status==='activo').map(d=>({id:d.id,scope:d.scope,status:d.status,value:d.value,revision:d.revision})).sort((a,b)=>a.id.localeCompare(b.id));
const equal=(a,b)=>digest(a)===digest(b);
export function authorize(ctx,scope,capability){
  scopeValid(scope);
  requireCondition(ctx&&typeof ctx.actor==='string'&&ctx.actor.length>0&&ctx.purpose==='investigacion'&&
    Array.isArray(ctx.scopes)&&ctx.scopes.includes(scope)&&Array.isArray(ctx.capabilities)&&ctx.capabilities.includes(capability),'ACCESS_DENIED');
}

/** Motor documental real local. No reset/destroy ni conexiones remotas implícitas. */
export class Store {
  constructor(directory){
    this.db=new PouchDB(directory,{adapter:'leveldb'});this.closed=false;this.queries=[];
    this.metrics={logicalWrites:0,logicalDeletes:0,readCalls:0,writeCalls:0,serializedPayloadBytes:0,wireBytes:null,physicalBytes:null,indexWrites:null};
  }
  async read(id){
    this.metrics.readCalls++;
    try{const doc=await this.db.get(id);return {rev:doc._rev,value:structuredClone(doc.value)};}
    catch(error){if(error.status===404)return null;throw error;}
  }
  async create(id,value){return this.cas(id,null,value);}
  async remove(id,rev){await this.db.remove(id,rev);this.metrics.logicalDeletes++;}
  async cas(id,rev,value){
    this.metrics.writeCalls++;
    try{
      const result=await this.db.put({_id:id,...(rev?{_rev:rev}:{}),value:structuredClone(value)});
      this.metrics.logicalWrites++;this.metrics.serializedPayloadBytes+=Buffer.byteLength(JSON.stringify(value));return result.rev;
    }catch(error){if(error.status===409)throw new Error('CONFLICT');throw error;}
  }
  async range(prefix){
    const args={include_docs:true,startkey:prefix,endkey:`${prefix}\ufff0`};
    this.queries.push({method:'allDocs',startkey:args.startkey,endkey:args.endkey});this.metrics.readCalls++;
    return (await this.db.allDocs(args)).rows.map(row=>structuredClone(row.doc.value));
  }
  async close(){if(!this.closed){this.closed=true;await this.db.close();}}
}

export async function canonicalQuery(store,scope){
  scopeValid(scope);
  return (await store.range(`canonical:${scope}:activo:`)).map(project).sort((a,b)=>a.id.localeCompare(b.id));
}
export async function projectionQuery(store,scope,version){
  scopeValid(scope);versionValid(version);
  return (await store.range(`projection:${scope}:${version}:`)).map(project).sort((a,b)=>a.id.localeCompare(b.id));
}
export function pairedSchedule(count,seed){
  requireCondition(Number.isSafeInteger(count)&&count>0&&count%2===0,'PAIRS_INVALID');
  const result=Array.from({length:count},(_,i)=>i%2?['projection','canonical']:['canonical','projection']);
  let state=seed>>>0;
  for(let i=result.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=Math.floor(state/2**32*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}

/** Publicación y fuente comparten un agregado; _rev hace indivisible el cambio local. */
export class Publisher {
  constructor(store){this.store=store;}
  async build(ctx,scope,version,{interrupt=false}={}){
    authorize(ctx,scope,'publish');versionValid(version);
    const saved=await this.store.read(`state:${scope}`);requireCondition(saved,'SOURCE_REQUIRED');
    requireCondition(!Object.hasOwn(saved.value.versions,version),'VERSION_EXISTS');
    const candidate={state:interrupt?'building':'ready',sourceHash:digest(saved.value.canonical),rows:interrupt?[]:reference(saved.value.canonical)};
    Object.defineProperty(saved.value.versions,version,{value:candidate,enumerable:true,writable:true,configurable:true});
    await this.store.cas(`state:${scope}`,saved.rev,saved.value);
    if(interrupt)throw new Error('INTERRUPTED');return {version,state:'ready'};
  }
  async publish(ctx,scope,version,expectedActive){
    authorize(ctx,scope,'publish');versionValid(version);
    const saved=await this.store.read(`state:${scope}`);requireCondition(saved,'SOURCE_REQUIRED');
    const state=saved.value,candidate=Object.hasOwn(state.versions,version)?state.versions[version]:null;
    requireCondition(state.active===expectedActive,'ACTIVE_CONFLICT');
    requireCondition(candidate?.state==='ready','CANDIDATE_NOT_READY');
    requireCondition(candidate.sourceHash===digest(state.canonical),'SOURCE_CHANGED');
    requireCondition(equal(candidate.rows,reference(state.canonical)),'EQUIVALENCE_FAILED');
    state.active=version;await this.store.cas(`state:${scope}`,saved.rev,state);
    return {version,persisted:true};
  }
  async read(ctx,scope){
    authorize(ctx,scope,'read');const saved=await this.store.read(`state:${scope}`);
    requireCondition(saved?.value.active,'NO_ACTIVE_VERSION');const version=saved.value.active;
    return {version,rows:structuredClone(saved.value.versions[version].rows)};
  }
}

/** Dos escrituras persistentes con registro pendiente; no transacción entre ellas. */
export class Processor {
  constructor(store){this.store=store;}
  async apply(ctx,scope,operation,{interrupt=null}={}){
    authorize(ctx,scope,'write');
    const doc=operation.document;
    requireCondition(typeof operation.id==='string'&&operation.id.length>0&&doc?.scope===scope,'OPERATION_INVALID');
    requireCondition(typeof doc.id==='string'&&Number.isSafeInteger(doc.revision)&&doc.revision>0&&Number.isFinite(doc.value),'OPERATION_INVALID');
    let saved=await this.store.read(`state:${scope}`);requireCondition(saved,'SOURCE_REQUIRED');
    let prior=saved.value.operations.find(op=>op.id===operation.id);
    const fingerprint=digest(operation);
    requireCondition(!prior||prior.hash===fingerprint,'IDEMPOTENCY_CONFLICT');
    if(prior?.phase==='done')return {repeated:true};
    if(!prior){
      const existing=saved.value.canonical.find(item=>item.id===doc.id);
      requireCondition(!existing||doc.revision>existing.revision,'STALE_REVISION');
      saved.value.canonical=saved.value.canonical.filter(item=>item.id!==doc.id).concat(structuredClone(doc));
      saved.value.operations.push({id:operation.id,hash:fingerprint,phase:'pending'});
      await this.store.cas(`state:${scope}`,saved.rev,saved.value);
    }
    if(interrupt==='after-canonical')throw new Error('INTERRUPTED');
    saved=await this.store.read(`state:${scope}`);prior=saved.value.operations.find(op=>op.id===operation.id);
    if(prior.phase==='done')return {repeated:true};
    saved.value.readModel=reference(saved.value.canonical);prior.phase='done';
    await this.store.cas(`state:${scope}`,saved.rev,saved.value);
    if(interrupt==='after-effect')throw new Error('INTERRUPTED');return {repeated:false};
  }
}

export class Gateway {
  constructor(store,sessions){this.store=store;this.cache=new Map();this.sessions=new Map([...sessions].map(([key,value])=>[key,structuredClone(value)]));}
  async read(token,route,scope){
    authorize(this.sessions.get(token),scope,'read');
    requireCondition(['source','cache','export','search','training'].includes(route),'ROUTE_DENIED');
    if(route==='training')return (await this.store.read(`training:${scope}`))?.value??null;
    if(route==='cache'&&this.cache.has(scope))return structuredClone(this.cache.get(scope));
    const saved=await this.store.read(`state:${scope}`);requireCondition(saved,'SOURCE_REQUIRED');
    requireCondition(saved.value.scope===scope&&saved.value.canonical.every(d=>d.scope===scope),'SCOPE_MISMATCH');
    if(route==='cache')this.cache.set(scope,structuredClone(saved.value.canonical));
    // Exportación y búsqueda entregan fuentes del taller, no proveedores externos.
    return structuredClone(saved.value.canonical);
  }
}

export function training(source,{scope,cut,evaluationEntities}){
  scopeValid(scope);requireCondition(Number.isFinite(cut),'CUT_INVALID');
  const allowed=source.filter(d=>d.scope===scope);
  requireCondition(allowed.every(d=>Number.isFinite(d.eventTime)&&Number.isFinite(d.knownTime)&&d.eventTime<cut&&d.knownTime<=cut),'TEMPORAL_LEAKAGE');
  requireCondition(allowed.every(d=>!evaluationEntities.includes(d.entity)),'ENTITY_LEAKAGE');
  const rows=allowed.map(d=>({id:d.id,scope:d.scope,revision:d.revision,text:d.text}));
  return {scope,cut,evaluationEntities:[...evaluationEntities],sourceHash:digest(allowed),rowsHash:digest(rows),rows,transform:'texto-v1'};
}

/** Recuperador determinista, no modelo generativo ni estimación de calidad de IA. */
export class Consumer {
  constructor(gateway){this.gateway=gateway;}
  async answer(token,scope,query){
    requireCondition(typeof query==='string'&&query.trim().length>0&&query.length<=200,'QUERY_INVALID');
    const data=await this.gateway.read(token,'training',scope);
    if(!data)return {state:'abstain',citations:[],executedActions:0};
    const source=await this.gateway.read(token,'source',scope);
    requireCondition(data.scope===scope&&data.transform==='texto-v1'&&data.sourceHash===digest(source)&&data.rowsHash===digest(data.rows),'PROVENANCE_INVALID');
    requireCondition(data.rows.every(row=>row.scope===scope&&source.some(d=>d.id===row.id&&d.revision===row.revision&&d.text===row.text)),'PROVENANCE_INVALID');
    let expected;
    try{expected=training(source,{scope,cut:data.cut,evaluationEntities:data.evaluationEntities});}
    catch{throw new Error('PROVENANCE_INVALID');}
    requireCondition(equal(expected.rows,data.rows),'PROVENANCE_INVALID');
    const matches=data.rows.filter(row=>row.text.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es')));
    return {state:matches.length?'answer':'abstain',citations:matches.map(({id,revision})=>({id,revision})),quotes:matches.map(row=>row.text),executedActions:0};
  }
  async tool(token,scope,action){
    requireCondition(action==='read','TOOL_FORBIDDEN');return this.gateway.read(token,'source',scope);
  }
}
