import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { auditProject, analyzeFileImpact } from '../src/auditor.mjs';
const fixtures=path.resolve(import.meta.dirname,'../fixtures/audit-phase14');

test('fixture válido no produce hallazgos',async()=>assert.equal((await auditProject(path.join(fixtures,'valid'))).findings.length,0));
test('fixture inválido demuestra las siete reglas',async()=>{const report=await auditProject(path.join(fixtures,'invalid'));assert.equal(report.passed,false);const rules=new Set(report.findings.map(x=>x.rule));for(let i=1;i<=7;i++)assert.ok(rules.has(`AUD-${String(i).padStart(3,'0')}`));for(const item of report.findings){assert.ok(item.file);assert.ok(item.line>0);assert.ok(item.remediation);}});
test('impacto encuentra importadores directos',async()=>{const report=await analyzeFileImpact(path.join(fixtures,'valid'),'src/domain/entity.mjs');assert.deepEqual(report.affected.map(x=>x.file),['src/application/use.mjs']);});
