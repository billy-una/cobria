#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const canonical = JSON.parse(await fs.readFile(path.join(root, 'editorial/canonical.json'), 'utf8'));
const alternatives = JSON.parse(await fs.readFile(path.join(root, 'replication/results/core-1.3-alternatives/summary.json'), 'utf8'));
const r7 = JSON.parse(await fs.readFile(path.join(root, 'replication/results/core-r7-statistics/summary.json'), 'utf8'));
const protocolR7 = JSON.parse(await fs.readFile(path.join(root, 'replication/protocol/r7-confirmatory.json'), 'utf8'));
const environmentEntries = await Promise.all(['mongodb', 'couchdb', 'opensearch'].map(async (engine) => {
  const environment = JSON.parse(await fs.readFile(path.join(root, `replication/results/core-r7-confirmatory/${engine}/environment.json`), 'utf8'));
  return [engine, environment];
}));
const claim = canonical.claims.find((item) => item.id === 'CLAIM-ALT-630');
if (claim.value !== alternatives.rawCount) throw new Error(`CLAIM-ALT-630 declara ${claim.value}, pero la evidencia contiene ${alternatives.rawCount}.`);
if (canonical.ecosystem.moduleCount !== canonical.ecosystem.modules.length) throw new Error('moduleCount no coincide con modules.');
if (r7.status !== 'confirmatorio-completo-interno' || r7.missingCells.length) throw new Error('R7 no está completo o tiene celdas ausentes.');
const observationsR7 = r7.correctness.reduce((total, row) => total + row.observaciones, 0);
const r7Claim = canonical.claims.find((item) => item.id === 'CLAIM-R7-270');
if (r7Claim.value !== observationsR7) throw new Error(`CLAIM-R7-270 declara ${r7Claim.value}, pero R7 contiene ${observationsR7}.`);
if (!r7.correctness.every((row) => row.todas_conformes)) throw new Error('R7 contiene observaciones no conformes.');

const environments = Object.fromEntries(environmentEntries.map(([engine, environment]) => [engine, {
  version: environment.engineInfo.version,
  architecture: environment.container.architecture,
  image: environment.container.image,
  imageId: environment.container.imageId,
  capturedAt: environment.capturedAt,
}]));
const evidence = {
  schemaVersion: '1.0.0',
  generatedFrom: 'replication/results/core-r7-statistics/summary.json',
  status: r7.status,
  scope: r7.scope,
  protocol: {
    id: r7.protocol,
    sizes: protocolR7.sizes,
    runsPerSize: protocolR7.runsPerSize,
    warmups: protocolR7.warmups,
    order: protocolR7.order,
  },
  observations: observationsR7,
  engines: r7.correctness.map((row) => ({
    id: row.motor,
    version: environments[row.motor].version,
    architecture: environments[row.motor].architecture,
    observations: row.observaciones,
    allContractsPass: row.todas_conformes,
    rawSha256: r7.rawSha256[row.motor],
  })),
  method: r7.method,
  comparisons: r7.comparisons,
  negativeResults: r7.negativeResults,
  alternatives: r7.alternatives,
  humanPending: r7.humanPending,
};

const fmt = (value, digits = 3) => Number(value).toLocaleString('es-CR', { minimumFractionDigits: digits, maximumFractionDigits: digits }).replaceAll('\u00a0', '\\,');
const names = { mongodb: 'MongoDB', couchdb: 'CouchDB', opensearch: 'OpenSearch' };
const tableRows = r7.comparisons.map((row) => `${names[row.motor]} & ${String(row.n).replace(/(?<=\\d)(?=(\\d{3})+$)/g, '\\\\,')} & ${fmt(row['razón_pareada_mediana'])} & ${fmt(row['diferencia_pareada_media_ms'])} & ${fmt(row['tamaño_efecto_dz'])} & ${fmt(row.p_holm, 4)} \\\\`).join('\n');
const evidenceTex = `% Generado por sync-editorial.mjs desde R7; no editar.\n\\newcommand{\\COBRIARSevenObservations}{${observationsR7}}\n\\newcommand{\\COBRIARSevenEngines}{${r7.correctness.length}}\n\\newcommand{\\COBRIARSevenRunsPerCell}{${protocolR7.runsPerSize}}\n\\newcommand{\\COBRIARSevenAlternatives}{${r7.alternatives.observations}}\n\\newcommand{\\COBRIARSevenNonconclusive}{${r7.negativeResults.length}}\n\\newcommand{\\COBRIARSevenMongoVersion}{${environments.mongodb.version}}\n\\newcommand{\\COBRIARSevenCouchVersion}{${environments.couchdb.version}}\n\\newcommand{\\COBRIARSevenOpenSearchVersion}{${environments.opensearch.version}}\n\\newcommand{\\COBRIARSevenTableRows}{%\n${tableRows}\n}\n`;

const identity = canonical.identity;
const outputs = new Map([
  ['editorial/generated/identity.tex', `% Generado por sync-editorial.mjs; no editar.\n\\newcommand{\\COBRIAAutor}{${identity.author}}\n\\newcommand{\\COBRIALugar}{${identity.place}}\n\\newcommand{\\COBRIAAnio}{${identity.year}}\n\\newcommand{\\COBRIAVersionEcosistema}{${identity.ecosystemVersion}}\n\\newcommand{\\COBRIAVersionCore}{${identity.coreVersion}}\n`],
  ['editorial/generated/claims.json', `${JSON.stringify({ schemaVersion: canonical.schemaVersion, claims: canonical.claims }, null, 2)}\n`],
  ['editorial/generated/evidence-r7.json', `${JSON.stringify(evidence, null, 2)}\n`],
  ['editorial/generated/evidence-r7.tex', evidenceTex],
  ['libro-cobria/generated/cobria-canonical.json', `${JSON.stringify(canonical, null, 2)}\n`],
  ['libro-cobria/generated/evidence-r7.json', `${JSON.stringify(evidence, null, 2)}\n`],
  ['sitio/public/cobria-canonical.json', `${JSON.stringify(canonical, null, 2)}\n`],
  ['sitio/public/evidence-r7.json', `${JSON.stringify(evidence, null, 2)}\n`],
  ['sitio/app/cobria-canonical.ts', `// Generado por sync-editorial.mjs; no editar.\nexport const cobria = ${JSON.stringify(canonical, null, 2)} as const;\n`],
  ['sitio/app/evidence-r7.ts', `// Generado por sync-editorial.mjs; no editar.\nexport const evidenceR7 = ${JSON.stringify(evidence, null, 2)} as const;\n`],
]);

const check = process.argv.includes('--check');
const differences = [];
for (const [relative, content] of outputs) {
  const target = path.join(root, relative);
  if (check) {
    const current = await fs.readFile(target, 'utf8').catch(() => null);
    if (current !== content) differences.push(relative);
  } else {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content);
  }
}
if (differences.length) {
  console.error(`Derivados editoriales desactualizados: ${differences.join(', ')}`);
  process.exitCode = 1;
} else console.log(check ? 'Derivados editoriales sincronizados.' : `Generados ${outputs.size} derivados editoriales.`);
