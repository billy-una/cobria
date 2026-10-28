import { readFile, mkdtemp, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crearAsistente } from './taller.mjs';

export async function evaluar(){
  const protocolBytes=await readFile(new URL('./protocolo.json',import.meta.url));
  const fixtureBytes=await readFile(new URL('./fixtures.json',import.meta.url));
  const protocolo=JSON.parse(protocolBytes),fixtures=JSON.parse(fixtureBytes);
  const contexto={actorId:'evaluador-demo',finalidad:'aprendizaje-c7',permisos:['observaciones:leer'],ambitos:['reserva-sur']};
  const responder=crearAsistente({repositorio:{listar:async ambito=>structuredClone(fixtures.retrievalDocuments.filter(d=>d.ambito===ambito))},umbral:protocolo.threshold});
  const casos=[];let tp=0,fp=0,fn=0,abstencionesCorrectas=0,respuestas=0;
  for(const caso of fixtures.queries){
    const resultado=await responder({consulta:caso.query,ambito:'reserva-sur'},contexto);
    const predicho=resultado.citas.map(c=>c.id).sort();const esperado=[...caso.expected].sort();
    const esperadoSet=new Set(esperado),predichoSet=new Set(predicho);
    tp+=predicho.filter(id=>esperadoSet.has(id)).length;fp+=predicho.filter(id=>!esperadoSet.has(id)).length;
    fn+=esperado.filter(id=>!predichoSet.has(id)).length;
    if(predicho.length)respuestas++;else if(!esperado.length)abstencionesCorrectas++;
    casos.push({id:caso.id,consulta:caso.query,esperado,predicho,estado:resultado.estado,coincide:JSON.stringify(predicho)===JSON.stringify(esperado)});
  }
  const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
  const implementationHashes={};
  for(const source of ['./taller.mjs','./evaluar.mjs','../ecosistema-app/src/application/ai/recuperar-evidencia.mjs','../ecosistema-app/src/application/security/autorizar-capacidad.mjs','../ecosistema-app/src/infrastructure/crypto/huella-sha256.mjs']) implementationHashes[source]=digest(await readFile(new URL(source,import.meta.url)));
  const negativos=fixtures.queries.filter(c=>!c.expected.length).length;
  return {kind:protocolo.kind,protocolo,environment:{node:process.version,unicode:process.versions.unicode,icu:process.versions.icu},protocolSha256:digest(protocolBytes),fixtureSha256:digest(fixtureBytes),implementationHashes,metricas:{consultas:casos.length,aciertosExactos:casos.filter(c=>c.coincide).length,tp,fp,fn,precisionCitas:tp+fp?tp/(tp+fp):null,recallCitas:tp+fn?tp/(tp+fn):null,cobertura:respuestas/casos.length,abstencionesCorrectas,totalSinEvidencia:negativos,tasaAbstencionCorrecta:negativos?abstencionesCorrectas/negativos:null},casos,limits:protocolo.limits,published:false};
}
if(process.argv[1] && fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
  const r=await evaluar();const directory=await mkdtemp(path.join(tmpdir(),'cobria-c7-evaluacion-'));const report=path.join(directory,'evaluacion.json');
  await writeFile(report,JSON.stringify(r,null,2),{flag:'wx'});console.log(JSON.stringify({report,metricas:r.metricas,limits:r.limits},null,2));
}
