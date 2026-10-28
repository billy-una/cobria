import { readFileSync } from 'node:fs';
const texto = readFileSync(new URL('./observacion.json', import.meta.url), 'utf8');
const observacion = JSON.parse(texto);
console.log(`Archivo leído: ${observacion.cantidad} colibríes`);
