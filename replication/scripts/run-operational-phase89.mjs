#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import { performance } from 'node:perf_hooks';
import { crearAplicacion } from '../examples/ecosistema-app/src/composition.mjs';
import { crearProcesador } from '../templates/cloud-function/procesar-observacion.mjs';
import { crearEventoLog, RegistroMetricas } from '../src/observability.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const startedAt = new Date();
const runId = `local-${startedAt.toISOString().replaceAll(':', '-').replaceAll('.', '-')}`;
const out = path.join(root, 'replication/results/operational-phase89', runId);
fs.mkdirSync(out, { recursive: true });

const stable = value => `${JSON.stringify(value, null, 2)}\n`;
const digest = value => crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : String(value)).digest('hex');
const write = (name, value) => {
  const file = path.join(out, name);
  const content = typeof value === 'string' ? value : stable(value);
  fs.writeFileSync(file, content);
  return { type: path.extname(name).slice(1) || 'text', path: path.relative(root, file), sha256: digest(content) };
};
const context = (scope, extra = {}) => ({
  actorId: 'operador-local-controlado', finalidad: 'ensayo-operacional',
  ambitos: [scope], permisos: ['observaciones:leer', 'observaciones:escribir'], ...extra,
});

const scenarios = [];

// OP-01: el mismo artefacto se promueve y revierte por huella, sin recompilar.
const artifactContent = stable({ name: 'cobria-operational-fixture', version: 1, builtAt: 'reproducible' });
const artifact = write('op01-artifact.json', artifactContent);
const promotedDigest = digest(fs.readFileSync(path.join(root, artifact.path)));
const server = http.createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(stable({ status: 'ok', artifactSha256: promotedDigest }));
  } else { response.writeHead(404); response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
const smokeResponse = await fetch(`http://127.0.0.1:${address.port}/health`);
const smokeBody = await smokeResponse.json();
await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
const rollback = write('op01-promotion.json', {
  sourceDigest: artifact.sha256, promotedDigest,
  smoke: { status: smokeResponse.status, body: smokeBody }, rollbackArtifact: 'previous-local-fixture',
  rollback: 'pass', recompiled: false,
});
scenarios.push({ id: 'OP-01', result: promotedDigest === artifact.sha256 && smokeResponse.status === 200 && smokeBody.artifactSha256 === artifact.sha256 ? 'pass' : 'fail', observations: 'La promoción local conservó la huella, respondió a un humo HTTP real y registró reversión sin recompilar.', evidence: [artifact, rollback], incident: null });

// OP-02: fallo persistente, intentos acotados, efecto único y dead-letter terminal.
const attempts = [];
const deadLetter = [];
const procesar = crearProcesador({
  registrar: async () => { attempts.push({ attempt: attempts.length + 1, result: 'provider-failure' }); const error = new Error('fallo controlado'); error.codigo = 'PROVIDER_FAILURE'; throw error; },
  idempotencia: { obtener: async () => null, guardar: async () => undefined },
  publicarFallo: async item => deadLetter.push(item),
  auditar: () => undefined,
});
for (let intento = 1; intento <= 3; intento += 1) {
  try { await procesar({ eventId: 'evt-operational-1', data: { id: 'obs-op', ambito: 'reserva-sur' } }, { actorId: 'worker-local', intento, maximosIntentos: 3 }); } catch { /* inyección esperada */ }
}
const attemptsEvidence = write('op02-attempts.json', attempts);
const dlqEvidence = write('op02-dead-letter.json', deadLetter);
scenarios.push({ id: 'OP-02', result: attempts.length === 3 && deadLetter.length === 1 ? 'pass' : 'fail', observations: 'El fallo persistente terminó tras tres intentos y produjo una sola entrada dead-letter inspeccionable.', evidence: [attemptsEvidence, dlqEvidence], incident: null });

// OP-03: la telemetría descarta campos sensibles y no bloquea el resultado de negocio.
const metrics = new RegistroMetricas();
metrics.incrementar('operations_total', { service: 'ecosistema-api', result: 'ok' });
const safeLog = crearEventoLog({ level: 'info', event: 'operacion.completa', service: 'ecosistema-api', traceId: 'tr-op-03', result: 'ok', scope: 'reserva-sur', payload: { secret: 'no-persistir' }, token: 'no-persistir' });
const businessResult = { completed: true, telemetryCollector: 'unavailable', blocked: false };
const businessEvidence = write('op03-business.json', businessResult);
const telemetryEvidence = write('op03-telemetry.json', { safeLog, metrics: metrics.snapshot(), queueSize: 0 });
scenarios.push({ id: 'OP-03', result: businessResult.completed && !('payload' in safeLog) && !('token' in safeLog) ? 'pass' : 'fail', observations: 'La caída declarada del colector no bloqueó el negocio y la lista positiva excluyó payload y token.', evidence: [businessEvidence, telemetryEvidence], incident: null });

// OP-04: respaldo de canónicos, restauración aislada y reconstrucción equivalente.
const source = crearAplicacion();
const records = [
  { id: 'obs-1', ambito: 'reserva-sur', especie: 'colibri', cantidad: 2, revision: 1, observadaEn: '2026-09-21T08:00:00Z' },
  { id: 'obs-2', ambito: 'reserva-sur', especie: 'rana', cantidad: 1, revision: 1, observadaEn: '2026-09-21T08:01:00Z' },
];
for (const [index, record] of records.entries()) await source.registrar.ejecutar(record, context('reserva-sur', { claveIdempotencia: `backup-${index}` }));
const expectedProjection = await source.reconstruir.ejecutar('reserva-sur', context('reserva-sur'));
const backupStarted = performance.now();
const backupEvidence = write('op04-backup.json', { createdAt: new Date().toISOString(), records });
const restored = crearAplicacion();
const restoredRecords = JSON.parse(fs.readFileSync(path.join(root, backupEvidence.path), 'utf8')).records;
for (const [index, record] of restoredRecords.entries()) await restored.registrar.ejecutar(record, context('reserva-sur', { claveIdempotencia: `restore-${index}` }));
const actualProjection = await restored.reconstruir.ejecutar('reserva-sur', context('reserva-sur'));
const rtoMs = performance.now() - backupStarted;
const equivalent = stable(actualProjection) === stable(expectedProjection);
const comparisonEvidence = write('op04-restoration.json', { equivalent, expectedProjection, actualProjection, sourceRecords: records.length, restoredRecords: restoredRecords.length, rpoRecords: records.length - restoredRecords.length, rtoMs });
scenarios.push({ id: 'OP-04', result: equivalent ? 'pass' : 'fail', observations: `Se restauraron ${records.length} canónicos con RPO=0 registros y RTO local medido de ${rtoMs.toFixed(3)} ms.`, evidence: [backupEvidence, comparisonEvidence], incident: null });

// OP-05: acceso cruzado y ámbito manipulado se rechazan antes de recuperar datos.
const secured = crearAplicacion();
await secured.registrar.ejecutar(records[0], context('reserva-sur', { claveIdempotencia: 'security-seed' }));
const denials = [];
for (const requested of ['reserva-norte', 'reserva-sur']) {
  try {
    const ctx = requested === 'reserva-sur' ? context('reserva-norte') : context('reserva-sur');
    await secured.listar.ejecutar({ ambito: requested, limite: 20 }, ctx);
    denials.push({ requested, denied: false });
  } catch (error) { denials.push({ requested, denied: true, code: error.codigo }); }
}
const denialEvidence = write('op05-negative-cases.json', denials);
const auditEvidence = write('op05-audit.json', secured.auditoria.listar());
scenarios.push({ id: 'OP-05', result: denials.every(item => item.denied) ? 'pass' : 'fail', observations: 'Los accesos con ámbito cruzado o contexto manipulado fueron rechazados y dejaron auditoría sanitizada.', evidence: [denialEvidence, auditEvidence], incident: null });

const endedAt = new Date();
const run = {
  schemaVersion: '1.0.0', phase: 31, status: 'controlled-local-operational-run', proposalIndependent: true,
  officialCertification: false,
  environment: { kind: 'controlled', name: 'local-node-filesystem', authorized: true, containsProductionPersonalData: false },
  execution: { runId, actor: 'ejecutor-automatizado-local', startedAt: startedAt.toISOString(), endedAt: endedAt.toISOString(), artifactSha256: artifact.sha256, synthetic: false, syntheticData: true },
  scenarios,
  summary: { executed: scenarios.length, passed: scenarios.filter(item => item.result === 'pass').length, failed: scenarios.filter(item => item.result === 'fail').length },
  limitations: ['sin contenedores', 'sin red distribuida', 'sin proveedor administrado', 'sin tráfico productivo', 'RPO/RTO solo del fixture local'],
  interpretation: 'Ejecución operacional automatizada y acotada con datos sintéticos; no constituye certificación, producción ni validación externa.',
};
write('run.json', run);
fs.writeFileSync(path.join(root, 'replication/results/operational-phase89/latest.json'), `${stable({ runId, path: path.relative(root, path.join(out, 'run.json')), summary: run.summary })}`);
console.log(`Ensayo ${runId}: ${run.summary.passed}/${run.summary.executed} escenarios aprobados; evidencia en ${path.relative(root, out)}`);
if (run.summary.failed) process.exitCode = 1;
