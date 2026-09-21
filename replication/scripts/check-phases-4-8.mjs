import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const configPath = path.join(root, 'protocol', 'phases-4-8.json');
const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const exists = rel => fs.existsSync(path.resolve(root, '..', rel));
const read = rel => fs.readFileSync(path.resolve(root, '..', rel), 'utf8');
const json = rel => JSON.parse(read(rel));

const checks = [];
for (const [number, phase] of Object.entries(cfg.phases)) {
  const internal = phase.internalRequirements.map(file => ({ file, ok: exists(file) }));
  const external = phase.externalEvidence.map(file => ({ file, ok: exists(file) }));
  const errors = [];

  if (number === '4' && external.every(x => x.ok)) {
    const reviews = json('evidence/phase4/review-results.json');
    const replication = json('evidence/phase4/external-replication.json');
    if (!Array.isArray(reviews.reviews) || reviews.reviews.length < 1) errors.push('Se requiere al menos un dictamen independiente.');
    if (reviews.openMajorFindings > 0) errors.push('Hay hallazgos mayores abiertos.');
    if (replication.executed !== true) errors.push('La replica externa no consta como ejecutada.');
  }

  if (number === '5' && external.every(x => x.ok)) {
    const participants = json('evidence/phase5/participant-summary.json');
    const ai = json('evidence/phase5/ai-human-evaluation.json');
    if ((participants.count || 0) < 4) errors.push('El piloto humano requiere al menos 4 participantes reales.');
    if (participants.synthetic === true) errors.push('Los datos sinteticos no pueden cerrar la fase humana.');
    if ((ai.raters || 0) < 1) errors.push('Falta evaluacion humana de IA.');
  }

  if (number === '6' && external.every(x => x.ok)) {
    const env = json('evidence/phase6/environment-manifest.json');
    const mongo = json('evidence/phase6/mongodb-summary.json');
    const couch = json('evidence/phase6/couchdb-summary.json');
    const fail = json('evidence/phase6/failure-and-rollback.json');
    if (env.environmentType !== 'real-nodes') errors.push('La fase 6 exige nodos reales, no emulacion/local smoke.');
    if (!mongo.allPass || !couch.allPass) errors.push('MongoDB y CouchDB deben pasar la matriz congelada.');
    if (!fail.rollbackPass || (fail.scopeViolations || 0) !== 0) errors.push('Fallo/rollback o aislamiento no conformes.');
  }

  if (number === '7' && external.every(x => x.ok)) {
    const comparison = json('evidence/phase7/industrial-comparison.json');
    const teams = json('evidence/phase7/transfer-teams.json');
    if (!Array.isArray(comparison.baselines) || !['CQRS','Event Sourcing','native indexes'].every(x => comparison.baselines.includes(x))) errors.push('Falta una baseline industrial requerida.');
    if ((teams.teams || 0) < 3 || (teams.developers || 0) < 6) errors.push('Transferencia requiere >=3 equipos y >=6 desarrolladores.');
    if (teams.authorAssistance === true) errors.push('La transferencia debe ejecutarse sin asistencia del autor.');
  }

  if (number === '8' && external.every(x => x.ok)) {
    const release = json('evidence/phase8/release.json');
    const doi = json('evidence/phase8/doi.json');
    const sig = json('evidence/phase8/signatures.json');
    const digests = json('evidence/phase8/container-digests.json');
    const citation = read('replication/CITATION.cff');
    if (!release.public || !release.tag) errors.push('Falta release publico etiquetado.');
    if (!doi.doi || /PENDING/i.test(doi.doi)) errors.push('Falta DOI real.');
    if (!Array.isArray(sig.artifacts) || sig.artifacts.length < 1 || !sig.verified) errors.push('Faltan firmas verificadas.');
    if (!Array.isArray(digests.images) || digests.images.some(x => !/^sha256:[a-f0-9]{64}$/i.test(x.digest || ''))) errors.push('Digests de contenedor invalidos o ausentes.');
    if (/DOI_PENDING|DOI_OR_REPOSITORY_URL_PENDING/.test(citation)) errors.push('CITATION.cff conserva placeholders externos.');
  }

  const internalReady = internal.every(x => x.ok);
  const externalReady = external.every(x => x.ok);
  const complete = internalReady && externalReady && errors.length === 0;
  checks.push({ phase: Number(number), name: phase.name, internalReady, externalReady, complete, internal, external, errors, completionRule: phase.completionRule });
}

const report = {
  protocol: cfg.protocol,
  checkedAt: new Date().toISOString(),
  allComplete: checks.every(x => x.complete),
  phases: checks
};

console.log(JSON.stringify(report, null, 2));
if (!report.allComplete) process.exitCode = 2;
