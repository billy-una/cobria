import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const review = JSON.parse(fs.readFileSync(path.join(root, 'editorial/c0/review.json'), 'utf8'));
const target = path.join(root, 'editorial/c0/probes.json');
if (fs.existsSync(target)) throw new Error('Las sondas C0 ya están registradas; no se sobrescribe la línea base');
const hash = value => createHash('sha256').update(value).digest('hex');
const sources = ['replication/src/cli.mjs', 'replication/src/generator.mjs',
  'replication/examples/ecosistema-app/src/domain/observacion.mjs'];
const sourceHashes = sources.map(filename => {
  const frozen = execFileSync('git', ['show', `${review.baselineCommit}:${filename}`], {cwd: root});
  const current = fs.readFileSync(path.join(root, filename));
  if (hash(frozen) !== hash(current)) throw new Error(`La sonda no corresponde a la línea base: ${filename}`);
  return {path: filename, sha256: hash(current)};
});
const probes = [];
function run(id, binary, args) {
  const value = spawnSync(binary, args, {cwd: root, encoding: 'utf8', timeout: 30000});
  if (value.error) throw value.error;
  const record = {id, command: [binary === process.execPath ? 'node' : binary, ...args].join(' '),
    exitCode: value.status, stdout: value.stdout.trim(), stderr: value.stderr.trim()};
  probes.push(record);
  return value;
}
run('opcion-cambio', process.execPath, ['replication/src/cli.mjs', 'impacto', '--cambio', 'cambio.json', '--json']);
run('opcion-comprobar', process.execPath, ['replication/src/cli.mjs', 'generar', '--comprobar', '--json']);
run('meta-patrones', 'make', ['-n', 'verificar-ejemplos-patrones']);
run('meta-paquete', 'make', ['-n', 'paquete-candidato']);
const { Observacion } = await import(pathToFileURL(path.join(root, sources[2])).href);
let zeroQuantityCode;
try { new Observacion({id:'obs-c0', ambito:'reserva-sur', especie:'colibri', cantidad:0, observadaEn:'2026-10-17T12:00:00Z'}); }
catch (error) { zeroQuantityCode = error.codigo; }
probes.push({id:'contrato-entidad', crearMethod:typeof Observacion.crear, zeroQuantityCode});
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'cobria-c0-probe-'));
const generated = run('simular-genera', process.execPath, ['replication/src/cli.mjs', 'generar', '--simular', '--tipo', 'entidad', '--nombre', 'Sonda Cero', '--directorio', temporary, '--json']);
const result = JSON.parse(generated.stdout);
const last = probes.at(-1);
last.command = last.command.replaceAll(temporary, '<directorio-temporal-sintetico>');
last.stdout = last.stdout.replaceAll(temporary, '<directorio-temporal-sintetico>');
last.createdFiles = result.created;
last.createdCount = result.created.length;
last.actualFilesPresent = result.created.every(filename => fs.statSync(path.join(temporary, filename)).isFile());
const record = {schemaVersion:'1.0.0', phase:'C0', date:review.date, baselineCommit:review.baselineCommit,
  kind:'automatic-local-probes-not-scientific-experiment', environment:{node:process.version, platform:process.platform, arch:process.arch},
  scope:{projectSourceMutated:false, scientificResultsMutated:false, temporaryFixtureCreated:true, published:false},
  sourceHashes, probes};
fs.writeFileSync(target, `${JSON.stringify(record, null, 2)}\n`, {flag:'wx'});
console.log(`Sondas registradas: ${probes.length}; simulación creó ${last.createdCount} archivos únicamente en ${temporary}`);
