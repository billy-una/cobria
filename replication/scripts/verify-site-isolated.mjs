import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

// Diagnóstico local, no publicación ni declaración de doble construcción RC2.
const root = fileURLToPath(new URL('../../', import.meta.url));
const destination = await fs.mkdtemp(path.join(os.tmpdir(), 'cobria-site-check-'));
const excluded = new Set(['node_modules', 'dist', '.git', '.next', '.vinext', '.wrangler', '.DS_Store', '.dev.vars', '.npmrc', '.netrc']);
const reportDirectory = path.join(root, "output/review/site-check", path.basename(destination));
await fs.mkdir(reportDirectory, { recursive: true });
console.log(`Informe de diagnóstico: ${reportDirectory}`);

async function copy(relative) {
  const source = path.join(root, relative);
  const target = path.join(destination, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.cp(source, target, {
    recursive: true,
    errorOnExist: true,
    force: false,
    filter: async entry => {
      const name = path.basename(entry);
      if (excluded.has(name) || name.startsWith('.env') || name.endsWith('.optimizado.pdf') || /\.(pem|key|p12|pfx)$/.test(name)) return false;
      const info = await fs.lstat(entry);
      if (info.isSymbolicLink()) throw new Error(`No se copia enlace simbólico: ${entry}`);
      return true;
    },
  });
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', env: process.env });
    child.once('error', reject);
    child.once('exit', (code, signal) => code === 0 ? resolve() : reject(new Error(`${command}: código ${code}, señal ${signal}`)));
  });
}

const report = {
  kind: 'diagnostico-local-no-release',
  destination,
  cleanGitClone: false,
  published: false,
  status: 'pendiente',
  lockSha256: createHash('sha256').update(await fs.readFile(path.join(root, 'sitio/package-lock.json'))).digest('hex'),
  limitations: ['No es clon Git limpio ni réplica externa.', 'La auditoría completa sigue siendo una puerta independiente.'],
};
try {
  for (const relative of ['sitio', 'editorial', 'replication/scripts/set_pdf_metadata.py', 'replication/scripts/optimize-structured-pdf.py', 'replication/scripts/optimize-web-pdf.py', 'replication/examples/ecosistema-app/test', 'replication/examples/ecosistema-app/data', 'replication/examples/ecosistema-app/taller-inicial']) await copy(relative);
  // EP9 verifica procedencia local al reconstruir las lecturas. Copiar las
  // fuentes declaradas evita depender del checkout original o de Pandoc.
  await copy('libro-cobria');
  const scientific = JSON.parse(await fs.readFile(path.join(root, 'editorial/ep9/generated/scientific-manifest.json'), 'utf8'));
  for (const relative of new Set(scientific.documents.flatMap(item => Object.keys(item.sourceSha256)))) {
    if (!relative.startsWith('editorial/')) await copy(relative);
  }
  for (const name of [
    'COBRIA-ecosistema-manual-completo.pdf', 'COBRIA-cuaderno-de-trabajo.pdf',
    'COBRIA-anexo-tecnico.pdf', 'COBRIA-articulo-cientifico-actualizado.pdf',
    'COBRIA-documento-maestro-ecosistema.pdf', 'COBRIA-especificacion-ecosistema-1.0.pdf',
  ]) await copy(`output/pdf/${name}`);
  const site = path.join(destination, 'sitio');
  await run('npm', ['ci', '--no-audit', '--no-fund'], site);
  await run('npm', ['run', 'lint'], site);
  await run('npm', ['test'], site);
  report.status = 'aprobado';
} catch (error) {
  report.status = 'fallido';
  report.error = String(error);
  process.exitCode = 1;
} finally {
  // Conservar evidencia fuera del temporal antes de retirar las copias regenerables.
  await fs.writeFile(path.join(reportDirectory, 'VERIFICATION.json'), `${JSON.stringify(report, null, 2)}\n`);
  if (process.env.COBRIA_KEEP_TEMP !== '1') {
    await fs.rm(destination, { recursive: true, force: true });
  }
  console.log(JSON.stringify(report, null, 2));
}
