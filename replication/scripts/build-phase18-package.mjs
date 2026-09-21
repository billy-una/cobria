#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const index = args.indexOf('--salida');
const target = path.resolve(root, index >= 0 ? args[index + 1] : 'output/release/phase18-transfer');
if (target === root || target === path.parse(target).root || target === path.dirname(root)) {
  throw new Error(`Destino inseguro para el paquete: ${target}`);
}
await fs.rm(target, { recursive: true, force: true });
await fs.mkdir(target, { recursive: true });
// La fuente transferible debe provenir del commit, no de archivos dataless de iCloud
// ni de un árbol de trabajo que pueda cambiar durante la copia.
const archive = path.join(path.dirname(target), `cobria-source-${process.pid}.tar`);
execFileSync('git', ['archive', '--format=tar', '-o', archive, 'HEAD'], { cwd: root });
execFileSync('tar', ['-xf', archive, '-C', target]);
await fs.rm(archive, { force: true });
const readme = `# Paquete de transferencia COBRIA\n\nEstado: preparado, no validado externamente.\n\n## Reproducción limpia\n\n1. Verifique las huellas de \`MANIFEST-SHA256.json\`.\n2. Ejecute \`npm ci --prefix replication\`.\n3. Ejecute \`npm ci --prefix sitio\`.\n4. Ejecute \`make verificar\`.\n\nLa aplicación neutral no posee dependencias externas. Las licencias y sus exclusiones están declaradas en LICENSES.md. La revisión humana, la réplica externa, la firma y el DOI continúan pendientes.\n`;
await fs.writeFile(path.join(target, 'README-TRANSFERENCIA.md'), readme);

async function files(directory) {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'MANIFEST-SHA256.json') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(absolute)); else result.push(absolute);
  }
  return result;
}
const entries = [];
for (const file of (await files(target)).sort()) {
  const content = await fs.readFile(file);
  entries.push({ path: path.relative(target, file), bytes: content.length, sha256: crypto.createHash('sha256').update(content).digest('hex') });
}
let commit = 'unavailable';
let dirty = 'unknown';
try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(); } catch {}
try { dirty = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim().length > 0; } catch {}
const status = JSON.parse(await fs.readFile(path.join(root, 'specification/phase-18/status.json'), 'utf8'));
const manifest = { schemaVersion: '1.1.0', generatedAt: new Date().toISOString(), commit, dirty, phaseState: status.state, signed: false, doi: null, files: entries };
await fs.writeFile(path.join(target, 'MANIFEST-SHA256.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Paquete preparado con ${entries.length} archivos en ${target}. Sin firma y sin DOI.`);
