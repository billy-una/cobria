#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(import.meta.dirname, '../..');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const sha = relative => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');
const conformance = read('replication/results/nosql-core-1.0/summary.json');
const alternatives = read('replication/results/core-1.3-alternatives/summary.json');
const analytics = read('replication/results/core-1.1-analytics-ai/summary.json');
const statistics = read('replication/results/core-1.3-statistics/summary.json');
const operationalPointer = read('replication/results/operational-phase89/latest.json');
const operational = read(operationalPointer.path);
const external = read('specification/phase-32/status.json');
const transfer = read('specification/phase-18/status.json');
const traceability = read('replication/traceability/traceability.json');

const inventory = {
  schemaVersion: '1.0.0', proposalIndependent: true, officialCertification: false,
  generatedAt: new Date().toISOString(),
  internalEvidence: [
    { id:'E-CONFORMANCE', status:'executed-local', observations:conformance.runs, source:'replication/results/nosql-core-1.0/summary.json', sha256:sha('replication/results/nosql-core-1.0/summary.json'), limit:'PouchDB y LokiJS locales; no producción.' },
    { id:'E-ALTERNATIVES', status:'executed-local', observations:alternatives.rawCount, source:'replication/results/core-1.3-alternatives/summary.json', sha256:sha('replication/results/core-1.3-alternatives/summary.json'), limit:alternatives.method },
    { id:'E-ANALYTICS-AI', status:'executed-local', observations:analytics.runs, source:'replication/results/core-1.1-analytics-ai/summary.json', sha256:sha('replication/results/core-1.1-analytics-ai/summary.json'), limit:analytics.limits },
    { id:'E-OPERATIONAL', status:'executed-controlled-local', observations:operational.summary.executed, source:operationalPointer.path, sha256:sha(operationalPointer.path), limit:operational.limitations.join('; ') },
    { id:'E-STATISTICS-CONFIRMATORY', status:statistics.estado, observations:null, source:'replication/results/core-1.3-statistics/summary.json', sha256:sha('replication/results/core-1.3-statistics/summary.json'), missing:statistics.celdasAusentes },
  ],
  traceability: { rows: traceability.length, source:'replication/traceability/traceability.json', sha256:sha('replication/traceability/traceability.json') },
  externalEvidence: {
    replication: { status:external.state, runs:external.externalRunsReceived },
    independentHumanReview: transfer.milestones.find(item => item.id === 'P18-REVIEW')?.status,
    doubleScreening: transfer.milestones.find(item => item.id === 'P18-SCREENING')?.status,
    transferStudy: transfer.milestones.find(item => item.id === 'P18-TRANSFER')?.status,
  },
  publishableClaim: 'COBRIA propone contratos verificables localmente y un programa refutable para evaluar autoridad, ámbito, derivación y reconstrucción.',
  prohibitedClaims: ['validación universal', 'certificación oficial', 'superioridad en producción', 'transferencia humana demostrada'],
};
const output = path.join(root, 'replication/results/scientific-inventory');
fs.mkdirSync(output, { recursive:true });
fs.writeFileSync(path.join(output, 'current.json'), `${JSON.stringify(inventory, null, 2)}\n`);
const rows = inventory.internalEvidence.map(item => `| ${item.id} | ${item.status} | ${item.observations ?? 'incompleto'} | ${item.limit} |`).join('\n');
fs.writeFileSync(path.join(output, 'REPORT.md'), `# Inventario científico COBRIA\n\n| Evidencia | Estado | Observaciones | Límite |\n|---|---|---:|---|\n${rows}\n\n## Evidencia externa\n\n- Réplica: ${inventory.externalEvidence.replication.status} (${inventory.externalEvidence.replication.runs}).\n- Revisión independiente: ${inventory.externalEvidence.independentHumanReview}.\n- Doble cribado: ${inventory.externalEvidence.doubleScreening}.\n- Transferencia: ${inventory.externalEvidence.transferStudy}.\n\n**Afirmación permitida:** ${inventory.publishableClaim}\n`);
console.log(`Inventario científico: ${inventory.internalEvidence.length} bloques internos, ${inventory.traceability.rows} filas trazables, ${inventory.externalEvidence.replication.runs} réplicas externas.`);
