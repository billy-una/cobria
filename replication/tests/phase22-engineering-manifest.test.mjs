import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {assessAdoption,validateAdoptionManifest} from '../src/engineering-adoption.mjs';

const contracts=Array.from({length:8},(_,index)=>({id:`ENG-${String(index+1).padStart(3,'0')}`,name:`Contrato ${index+1}`,owner:'equipo',evidence:[{path:'evidence.txt',containsAll:[`token-${index+1}`]}]}));
const base={schemaVersion:'1.0.0',project:{repository:'https://example.invalid/project.git',ref:'HEAD'},scope:'fixture',contracts,limits:['solo prueba']};

test('rechaza rutas que escapan del repositorio y contratos incompletos',()=>{
  const invalid=structuredClone(base); invalid.contracts[0].evidence[0].path='../secret'; invalid.contracts.pop();
  const errors=validateAdoptionManifest(invalid);
  assert.ok(errors.some(error=>error.includes('ruta insegura')));
  assert.ok(errors.some(error=>error.includes('ENG-001..ENG-008')));
});

test('evalúa contenido desde un commit aunque el árbol cambie después',()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cobria-phase22-'));
  execFileSync('git',['init','-q'],{cwd:directory});
  fs.writeFileSync(path.join(directory,'evidence.txt'),contracts.map((_,i)=>`token-${i+1}`).join('\n'));
  execFileSync('git',['add','evidence.txt'],{cwd:directory});
  execFileSync('git',['-c','user.name=COBRIA','-c','user.email=cobria@example.invalid','commit','-qm','fixture'],{cwd:directory});
  execFileSync('git',['remote','add','origin',base.project.repository],{cwd:directory});
  const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:directory,encoding:'utf8'}).trim();
  fs.writeFileSync(path.join(directory,'evidence.txt'),'árbol modificado sin confirmar');
  const report=assessAdoption({repository:directory,manifest:{...base,project:{...base.project,expectedCommit:commit,expectedRemote:base.project.repository}}});
  assert.equal(report.summary.implementedLocal,8);
  assert.equal(report.summary.operationallyValidated,0);
  assert.equal(report.project.sourceMode,'git-ref');
  fs.rmSync(directory,{recursive:true,force:true});
});
