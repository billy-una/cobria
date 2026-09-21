import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const expectedIds = new Set(Array.from({length:8},(_,index)=>`ENG-${String(index+1).padStart(3,'0')}`));
const safePath = value => typeof value === 'string' && value.length > 0 && !value.startsWith('/') && !value.split('/').includes('..') && !value.includes('\\');

export function validateAdoptionManifest(manifest) {
  const errors=[];
  if (manifest?.schemaVersion !== '1.0.0') errors.push('schemaVersion debe ser 1.0.0');
  if (!manifest?.project?.repository || !manifest?.project?.ref) errors.push('project requiere repository y ref');
  const contracts=manifest?.contracts ?? [];
  const ids=contracts.map(item=>item.id);
  if (new Set(ids).size !== ids.length) errors.push('IDs de contrato duplicados');
  if (ids.length !== 8 || ids.some(id=>!expectedIds.has(id))) errors.push('se requieren ENG-001..ENG-008');
  for (const contract of contracts) {
    if (!contract.name || !contract.owner || !Array.isArray(contract.evidence) || contract.evidence.length===0) errors.push(`${contract.id}: nombre, responsable y evidencia son obligatorios`);
    for (const evidence of contract.evidence ?? []) {
      if (!safePath(evidence.path)) errors.push(`${contract.id}: ruta insegura`);
      if (!Array.isArray(evidence.containsAll) || evidence.containsAll.length===0 || evidence.containsAll.some(token=>typeof token!=='string'||!token.trim())) errors.push(`${contract.id}: containsAll debe contener términos`);
    }
  }
  return errors;
}

const git = (repository,args,options={}) => execFileSync('git',['-C',repository,...args],{encoding:options.encoding ?? 'utf8',maxBuffer:10*1024*1024});

export function assessAdoption({repository,manifest}) {
  const errors=validateAdoptionManifest(manifest);
  if (errors.length) throw Object.assign(new Error(errors.join('; ')),{code:'MANIFEST_INVALID',errors});
  const commit=git(repository,['rev-parse',`${manifest.project.ref}^{commit}`]).trim();
  const remote=git(repository,['remote','get-url','origin']).trim();
  if (manifest.project.expectedRemote && remote!==manifest.project.expectedRemote) throw Object.assign(new Error('Remoto distinto del manifiesto'),{code:'REMOTE_MISMATCH'});
  if (manifest.project.expectedCommit && commit!==manifest.project.expectedCommit) throw Object.assign(new Error('Commit distinto del manifiesto'),{code:'COMMIT_MISMATCH'});
  const checks=manifest.contracts.map(contract=>{
    const evidence=contract.evidence.map(source=>{
      let content;
      try { content=git(repository,['show',`${commit}:${source.path}`],{encoding:'buffer'}); }
      catch { return {path:source.path,exists:false,sha256:null,tokens:source.containsAll.map(token=>({token,found:false}))}; }
      const text=content.toString('utf8').toLowerCase();
      return {path:source.path,exists:true,sha256:crypto.createHash('sha256').update(content).digest('hex'),tokens:source.containsAll.map(token=>({token,found:text.includes(token.toLowerCase())}))};
    });
    const passed=evidence.every(source=>source.exists&&source.tokens.every(token=>token.found));
    return {id:contract.id,name:contract.name,owner:contract.owner,structuralStatus:passed?'implemented-local':'gap',operationalStatus:'not-assessed',evidence};
  });
  return {schemaVersion:'1.0.0',method:'cobria-engineering-manifest-v1',project:{remote,ref:manifest.project.ref,commit,sourceMode:'git-ref'},scope:manifest.scope,summary:{contracts:checks.length,implementedLocal:checks.filter(item=>item.structuralStatus==='implemented-local').length,operationallyValidated:0},checks,limits:manifest.limits};
}
