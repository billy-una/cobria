import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Vite RSC deriva este identificador de la ruta absoluta del checkout. Solo es
// un nombre de depuración: el código y las coordenadas del mapa no cambian.
export function normalizeMap(map) {
  if (map.version !== 3 || !Array.isArray(map.names)) {
    throw new Error('Mapa de código no compatible');
  }
  return { ...map, names: map.names.map(name => typeof name === 'string'
    ? name.replace(/^__vite_rsc_importer_resources_[a-f0-9]{12}\.Resources$/, '__vite_rsc_importer_resources.Resources')
    : name) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = fileURLToPath(new URL('../dist/server/index.js.map', import.meta.url));
  const original = fs.readFileSync(target, 'utf8');
  const map = JSON.parse(original);
  const normalized = normalizeMap(map);
  if (JSON.stringify(map.names) !== JSON.stringify(normalized.names)) {
    fs.writeFileSync(target, JSON.stringify(normalized));
  }
  console.log('Mapa de depuración normalizado sin modificar código ni coordenadas.');
}
