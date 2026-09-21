#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const canonical = JSON.parse(await fs.readFile(path.join(root, 'editorial/canonical.json'), 'utf8'));
const alternatives = JSON.parse(await fs.readFile(path.join(root, 'replication/results/core-1.3-alternatives/summary.json'), 'utf8'));
const claim = canonical.claims.find((item) => item.id === 'CLAIM-ALT-630');
if (claim.value !== alternatives.rawCount) throw new Error(`CLAIM-ALT-630 declara ${claim.value}, pero la evidencia contiene ${alternatives.rawCount}.`);
if (canonical.ecosystem.moduleCount !== canonical.ecosystem.modules.length) throw new Error('moduleCount no coincide con modules.');

const identity = canonical.identity;
const outputs = new Map([
  ['editorial/generated/identity.tex', `% Generado por sync-editorial.mjs; no editar.\n\\newcommand{\\COBRIAAutor}{${identity.author}}\n\\newcommand{\\COBRIALugar}{${identity.place}}\n\\newcommand{\\COBRIAAnio}{${identity.year}}\n\\newcommand{\\COBRIAVersionEcosistema}{${identity.ecosystemVersion}}\n\\newcommand{\\COBRIAVersionCore}{${identity.coreVersion}}\n`],
  ['editorial/generated/claims.json', `${JSON.stringify({ schemaVersion: canonical.schemaVersion, claims: canonical.claims }, null, 2)}\n`],
  ['libro-cobria/generated/cobria-canonical.json', `${JSON.stringify(canonical, null, 2)}\n`],
  ['sitio/public/cobria-canonical.json', `${JSON.stringify(canonical, null, 2)}\n`],
  ['sitio/app/cobria-canonical.ts', `// Generado por sync-editorial.mjs; no editar.\nexport const cobria = ${JSON.stringify(canonical, null, 2)} as const;\n`],
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
