#!/usr/bin/env node
/** Captura versiones reales del motor y del contenedor sin alterar resultados. */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { MongoClient } from "mongodb";

const engine=process.env.COBRIA_ENGINE;
const containerName=process.env.COBRIA_CONTAINER;
if(!["mongodb","couchdb","opensearch"].includes(engine)||!containerName) throw new Error("Use COBRIA_ENGINE y COBRIA_CONTAINER");
const root=path.resolve(import.meta.dirname,"..");
const output=path.join(root,"results/core-r7-confirmatory",engine,"environment.json");
const docker=(...args)=>execFileSync("docker",args,{encoding:"utf8"}).trim();
const inspected=JSON.parse(docker("inspect",containerName))[0];
const image=JSON.parse(docker("image","inspect",inspected.Image))[0];
let engineInfo;
if(engine==="mongodb"){
  const client=new MongoClient(process.env.MONGODB_URL||"mongodb://127.0.0.1:27017/?directConnection=true");
  await client.connect();
  try{const info=await client.db("admin").command({buildInfo:1});engineInfo={version:info.version,gitVersion:info.gitVersion,allocator:info.allocator};}
  finally{await client.close()}
}else{
  const base=engine==="couchdb"?(process.env.COUCHDB_URL||"http://127.0.0.1:5984"):(process.env.OPENSEARCH_URL||"http://127.0.0.1:9200");
  const headers=engine==="couchdb"?{authorization:`Basic ${Buffer.from(`${process.env.COUCHDB_USER||"cobria"}:${process.env.COUCHDB_PASSWORD||"cobria_local_only"}`).toString("base64")}`}:{ };
  const response=await fetch(base,{headers});if(!response.ok)throw new Error(`${engine} no saludable: ${response.status}`);const info=await response.json();
  engineInfo=engine==="couchdb"?{version:info.version,vendor:info.vendor?.name??null}:{version:info.version?.number,distribution:info.version?.distribution,buildHash:info.version?.build_hash};
}
const context=docker("context","show");
const dockerInfo=JSON.parse(docker("info","--format","{{json .}}"));
const payload={schemaVersion:"1.0.0",engine,capturedAt:new Date().toISOString(),engineInfo,container:{name:containerName,image:inspected.Config.Image,imageId:inspected.Image,architecture:image.Architecture,os:image.Os,repoDigests:image.RepoDigests??[]},runtime:{dockerContext:context,serverVersion:dockerInfo.ServerVersion,architecture:dockerInfo.Architecture,operatingSystem:dockerInfo.OperatingSystem,cpus:dockerInfo.NCPU,totalMemoryBytes:dockerInfo.MemTotal},client:{node:process.version,platform:process.platform,architecture:process.arch}};
fs.writeFileSync(output,JSON.stringify(payload,null,2)+"\n");
console.log(JSON.stringify({engine,version:engineInfo.version,containerArchitecture:image.Architecture,dockerContext:context}));
