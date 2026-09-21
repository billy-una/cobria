import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const safe=value=>typeof value==='string'&&value.length>0&&!value.startsWith('/')&&!value.split('/').includes('..')&&!value.includes('\\');
const git=(repo,args,encoding='utf8')=>execFileSync('git',['-C',repo,...args],{encoding,maxBuffer:10*1024*1024});
export function assessDimensions({repository,profile}) {
  if (profile?.schemaVersion!=='1.0.0'||!profile?.project?.ref||!Array.isArray(profile?.dimensions)||profile.dimensions.length<1) throw new Error('Perfil dimensional inválido');
  const commit=git(repository,['rev-parse',`${profile.project.ref}^{commit}`]).trim();
  if (profile.project.expectedCommit&&commit!==profile.project.expectedCommit) throw new Error('Commit distinto del perfil');
  const dimensions=profile.dimensions.map(dimension=>{
    if (!dimension.id||!dimension.description||!Array.isArray(dimension.evidence)||!dimension.evidence.length) throw new Error('Dimensión incompleta');
    const evidence=dimension.evidence.map(source=>{
      if (!safe(source.path)||!Array.isArray(source.containsAll)||!source.containsAll.length) throw new Error('Evidencia dimensional insegura');
      let bytes; try { bytes=git(repository,['show',`${commit}:${source.path}`],'buffer'); } catch { return {path:source.path,exists:false,sha256:null,tokens:source.containsAll.map(token=>({token,found:false}))}; }
      const text=bytes.toString('utf8').toLowerCase();
      return {path:source.path,exists:true,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),tokens:source.containsAll.map(token=>({token,found:text.includes(token.toLowerCase())}))};
    });
    return {id:dimension.id,description:dimension.description,satisfied:evidence.every(item=>item.exists&&item.tokens.every(token=>token.found)),evidence};
  });
  return {schemaVersion:'1.0.0',method:'cobria-dimensional-evidence-v1',project:{commit,sourceMode:'git-ref'},contract:profile.contract,dimensions,summary:{required:dimensions.length,satisfied:dimensions.filter(item=>item.satisfied).length,strictStatus:dimensions.every(item=>item.satisfied)?'supported-structural':'insufficient-structural'},interpretation:'Resultado estructural de una propuesta; no certifica operación, calidad ni conformidad oficial.'};
}
