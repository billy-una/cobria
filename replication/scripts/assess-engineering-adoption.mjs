#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const args = process.argv.slice(2);
const value = flag => args[args.indexOf(flag) + 1];
const project = path.resolve(value('--project') ?? '');
const output = path.resolve(value('--output') ?? 'engineering-adoption.json');
if (!fs.existsSync(path.join(project, '.git'))) throw new Error('El proyecto debe ser un checkout Git local.');

const rules = [
  {id:'ENG-001', name:'Estado operativo explícito', evidence:['AGENTS.md','test/ux-operational-contract.test.mjs'], tokens:['PageStateService','AsyncActionController']},
  {id:'ENG-002', name:'Autoridad transaccional', evidence:['functions/handlers/commit-sale.js','functions/test/commit-sale-modular-contract.test.js'], tokens:['requestId','scope']},
  {id:'ENG-003', name:'Cola fuera de línea gobernada', evidence:['src/public/dataLayer/offline/OfflinePolicy.js','test/offline-resilience.test.mjs'], tokens:['online-only','dead']},
  {id:'ENG-004', name:'Promoción ligada al artefacto', evidence:['documentacion/OPERATIONS/RELEASE_PROMOTION_RUNBOOK.md','tools/evaluate-go-no-go.mjs'], tokens:['SHA','rollback']},
  {id:'ENG-005', name:'Telemetría privada y no bloqueante', evidence:['AGENTS.md','test/telemetry-policy.test.mjs'], tokens:['sanitiz','cola']},
  {id:'ENG-006', name:'Optimización con presupuesto', evidence:['documentacion/DEVELOPMENT/CONTINUOUS_OPTIMIZATION_LINE.md','tools/check-performance-budget.mjs'], tokens:['medir','budget']},
  {id:'ENG-007', name:'Estrangulamiento verificable de legado', evidence:['AGENTS.md','functions/test/functions-legacy-isolation-contract.test.js'], tokens:['no-growth','legacy']},
  {id:'ENG-008', name:'Incidente como conocimiento', evidence:['AGENTS.md','documentacion/DEVELOPMENT/INCIDENTES_SOLUCIONES_2026-09-20.md'], tokens:['causa raíz','riesgo residual']},
];

const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const checks = rules.map(rule => {
  const files = rule.evidence.map(relative => {
    const absolute = path.join(project, relative);
    const exists = fs.existsSync(absolute);
    return {path:relative, exists, sha256:exists ? sha256(absolute) : null};
  });
  const joined = files.filter(item => item.exists).map(item => fs.readFileSync(path.join(project,item.path),'utf8')).join('\n').toLowerCase();
  const tokens = rule.tokens.map(token => ({token, found:joined.includes(token.toLowerCase())}));
  const structural = files.every(item => item.exists) && tokens.every(item => item.found);
  return {...rule, files, tokens, structuralStatus:structural?'implemented-local':'gap', operationalStatus:'not-assessed'};
});

const commit = execFileSync('git',['rev-parse','HEAD'],{cwd:project,encoding:'utf8'}).trim();
const branch = execFileSync('git',['branch','--show-current'],{cwd:project,encoding:'utf8'}).trim();
const dirty = execFileSync('git',['status','--porcelain'],{cwd:project,encoding:'utf8'}).trim().length > 0;
const report = {
  schemaVersion:'1.0.0', method:'cobria-engineering-structural-pilot-v1',
  generatedAt:new Date().toISOString(), project:{remote:execFileSync('git',['remote','get-url','origin'],{cwd:project,encoding:'utf8'}).trim(),branch,commit,dirty},
  scope:'evidencia estructural local; no evalúa producción, seguridad integral ni resultados de negocio',
  summary:{contracts:checks.length, implementedLocal:checks.filter(item=>item.structuralStatus==='implemented-local').length, operationallyValidated:0},
  checks,
  limits:['reglas específicas para el piloto POS Guápiles','búsqueda de evidencia y tokens, no análisis semántico completo','sin despliegue, credenciales, datos reales ni participantes','not-assessed no significa incumplimiento']
};
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,`${JSON.stringify(report,null,2)}\n`);
console.log(`Piloto Engineering: ${report.summary.implementedLocal}/${report.summary.contracts} contratos con evidencia estructural; 0 validados operacionalmente.`);
