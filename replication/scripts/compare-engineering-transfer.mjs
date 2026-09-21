#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args=process.argv.slice(2);
const value=flag=>args[args.indexOf(flag)+1];
const inputs=(value('--reports')??'').split(',').filter(Boolean).map(item=>path.resolve(item));
const output=path.resolve(value('--output')??'engineering-transfer-comparison.json');
if (inputs.length<2) throw new Error('Se requieren al menos dos informes separados por coma.');
const reports=inputs.map(file=>JSON.parse(fs.readFileSync(file,'utf8')));
const projects=reports.map(report=>({
  repository:report.project.remote,
  commit:report.project.commit,
  contracts:report.summary.contracts,
  implementedLocal:report.summary.implementedLocal,
  structuralCoverage:Number((report.summary.implementedLocal/report.summary.contracts).toFixed(3)),
  operationallyValidated:report.summary.operationallyValidated
}));
const ids=reports[0].checks.map(check=>check.id);
const contracts=ids.map(id=>({
  id,
  projectsWithStructuralEvidence:reports.filter(report=>report.checks.find(check=>check.id===id)?.structuralStatus==='implemented-local').length,
  projectsAssessed:reports.length
}));
const result={
  schemaVersion:'1.0.0',
  method:'cobria-engineering-transfer-comparison-v1',
  interpretation:'Compara cobertura de evidencia estructural declarada; no ordena calidad, madurez ni rendimiento de los proyectos.',
  projects,
  contracts,
  summary:{projects:projects.length,contracts:ids.length,operationallyValidated:projects.reduce((sum,item)=>sum+item.operationallyValidated,0)},
  limits:['los manifiestos fueron preparados por el autor de COBRIA','la búsqueda textual puede producir falsos positivos o negativos','no se ejecutó producción ni una revisión humana independiente','una brecha significa ausencia de la evidencia declarada, no incumplimiento del proyecto']
};
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,`${JSON.stringify(result,null,2)}\n`);
console.log(`Comparación generada: ${projects.length} proyectos, ${ids.length} contratos, ${result.summary.operationallyValidated} validaciones operacionales.`);
