import { exigirAmbito, exigirCoincidenciaAmbito } from "../core/cobria.mjs";

// Adaptador para proyecciones de búsqueda. Requiere un índice desechable dedicado.
export class OpenSearchAdapter {
  constructor({url,index="cobria-projection",fetchImpl=fetch}){this.base=url.replace(/\/$/,"");this.index=index;this.fetch=fetchImpl;this.metrics={reads:0,writes:0,bytesRead:0,bytesWritten:0};}
  key(kind,scope,id){return `${kind}:${encodeURIComponent(exigirAmbito(scope))}:${id}`;}
  async request(path,options={}){const r=await this.fetch(`${this.base}${path}`,{...options,headers:{"content-type":"application/json",...options.headers}});if(!r.ok&&r.status!==404)throw new Error(`OpenSearch ${r.status}: ${await r.text()}`);return r;}
  async reset(){await this.request(`/${this.index}`,{method:"DELETE"});await this.request(`/${this.index}`,{method:"PUT",body:JSON.stringify({mappings:{properties:{kind:{type:"keyword"},scope:{type:"keyword"},payload:{type:"object",enabled:true}}}})});this.metrics={reads:0,writes:0,bytesRead:0,bytesWritten:0};}
  async put(kind,scope,id,value){const safe=exigirCoincidenciaAmbito(scope,value),body=JSON.stringify({kind,scope:safe,payload:value});await this.request(`/${this.index}/_doc/${encodeURIComponent(this.key(kind,safe,id))}`,{method:"PUT",body});this.metrics.writes++;this.metrics.bytesWritten+=Buffer.byteLength(JSON.stringify(value));}
  async compareAndSwap(kind, scope, id, expectedRevision, value) {
    const safe = exigirCoincidenciaAmbito(scope, value);
    const key = encodeURIComponent(this.key(kind, safe, id));
    const currentResponse = await this.fetch(`${this.base}/${this.index}/_doc/${key}?seq_no_primary_term=true`, {headers:{"content-type":"application/json"}});
    let current = null;
    if (currentResponse.ok) current = await currentResponse.json();
    else if (currentResponse.status !== 404) throw new Error(`OpenSearch ${currentResponse.status}: ${await currentResponse.text()}`);
    const actualRevision = current?._source?.payload?.revision ?? null;
    if (actualRevision !== expectedRevision) return false;
    const body = JSON.stringify({kind,scope:safe,payload:value});
    let url = `${this.base}/${this.index}/_doc/${key}`;
    if (current) url += `?if_seq_no=${current._seq_no}&if_primary_term=${current._primary_term}`;
    else url += "?op_type=create";
    const response = await this.fetch(url, {method:"PUT",headers:{"content-type":"application/json"},body});
    if (response.status === 409) return false;
    if (!response.ok) throw new Error(`OpenSearch ${response.status}: ${await response.text()}`);
    this.metrics.writes++;
    this.metrics.bytesWritten += Buffer.byteLength(JSON.stringify(value));
    return true;
  }
  async putMany(kind,scope,values){const safe=exigirAmbito(scope);values.forEach(value=>exigirCoincidenciaAmbito(safe,value));if(!values.length)return;const body=values.flatMap(value=>[JSON.stringify({index:{_index:this.index,_id:this.key(kind,safe,value.id)}}),JSON.stringify({kind,scope:safe,payload:value})]).join("\n")+"\n";const r=await this.request("/_bulk",{method:"POST",headers:{"content-type":"application/x-ndjson"},body});const data=await r.json();if(data.errors)throw new Error("OpenSearch bulk contiene errores");this.metrics.writes+=values.length;this.metrics.bytesWritten+=Buffer.byteLength(JSON.stringify(values));}
  async list(kind,scope){const safe=exigirAmbito(scope);await this.request(`/${this.index}/_refresh`,{method:"POST"});const values=[];let searchAfter;while(true){const body={size:10000,query:{bool:{filter:[{term:{kind}},{term:{scope:safe}}]}},sort:[{"_id":"asc"}],...(searchAfter?{search_after:searchAfter}:{})};const response=await this.request(`/${this.index}/_search`,{method:"POST",body:JSON.stringify(body)});const hits=(await response.json()).hits.hits;values.push(...hits.map(x=>x._source.payload));if(hits.length<10000||!hits.at(-1)?.sort)break;searchAfter=hits.at(-1).sort;}this.metrics.reads+=values.length;this.metrics.bytesRead+=Buffer.byteLength(JSON.stringify(values));return values;}
  async clear(kind,scope){await this.request(`/${this.index}/_delete_by_query?refresh=true`,{method:"POST",body:JSON.stringify({query:{bool:{filter:[{term:{kind}},{term:{scope:exigirAmbito(scope)}}]}}})});}
  snapshot(){return {...this.metrics};}async close(){}
}
