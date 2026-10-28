'use strict';
const { glob, globSync } = require('tinyglobby');
const path = require('node:path');

// Superficie observada de ESLint Next y vite-plugin-dynamic-import; fallo cerrado.
const allowed = new Set(['cwd', 'onlyDirectories', 'onlyFiles', 'ignore', 'dot', 'absolute', 'deep', 'followSymbolicLinks']);
function patterns(value) {
  const list = typeof value === 'string' ? [value] : value;
  if (!Array.isArray(list) || !list.length || list.length > 64) throw new TypeError('GLOB_LIMIT: se requieren de 1 a 64 patrones');
  for (const item of list) {
    if (typeof item !== 'string' || !item.length || item.length > 2048 || item.includes('\0')) throw new TypeError('GLOB_LIMIT: patrón inválido');
    const stack = [];
    let expansionBudget = 1;
    let escaped = false;
    let inClass = false;
    for (const char of item) {
      if (escaped) { escaped = false; continue; }
      if (char === '\\') { escaped = true; continue; }
      if (char === '[') inClass = true;
      if (char === ']') inClass = false;
      if (inClass) continue;
      if (char === '{' || char === '(') {
        stack.push({ char, alternatives: 1 });
        if (stack.length > 16) throw new TypeError('GLOB_LIMIT: anidamiento excesivo');
      }
      if (char === ',' && stack.at(-1)?.char === '{') stack.at(-1).alternatives++;
      if (char === '}' || char === ')') {
        const expected = char === '}' ? '{' : '(';
        const group = stack.pop();
        if (group?.char !== expected) throw new TypeError('GLOB_LIMIT: delimitador sin apertura');
        expansionBudget *= group.alternatives;
        if (expansionBudget > 256) throw new TypeError('GLOB_LIMIT: expansión excesiva');
      }
    }
    if (stack.length) throw new TypeError('GLOB_LIMIT: delimitador sin cierre');
  }
  return list;
}
function input(value, options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('GLOB_OPTIONS: opciones inválidas');
  for (const key of Object.keys(options)) if (!allowed.has(key)) throw new TypeError(`GLOB_OPTIONS: opción no soportada: ${key}`);
  for (const key of ['onlyDirectories', 'onlyFiles', 'dot', 'absolute', 'followSymbolicLinks']) {
    if (options[key] !== undefined && typeof options[key] !== 'boolean') throw new TypeError(`GLOB_OPTIONS: ${key} requiere booleano`);
  }
  if (options.cwd !== undefined && typeof options.cwd !== 'string') throw new TypeError('GLOB_OPTIONS: cwd requiere texto');
  if (options.deep !== undefined && (!Number.isInteger(options.deep) || options.deep < 0)) throw new TypeError('GLOB_OPTIONS: deep requiere entero no negativo');
  const list = patterns(value);
  const forms = list.filter(item => !item.startsWith('!')).map(item => path.isAbsolute(item));
  if (forms.some(Boolean) && !forms.every(Boolean)) throw new TypeError('GLOB_OPTIONS: no mezclar patrones absolutos y relativos');
  const safe = { expandDirectories: false, ...options };
  if (forms.length && forms.every(Boolean)) safe.absolute = true;
  if (options.ignore !== undefined) safe.ignore = patterns(options.ignore);
  return { list, options: safe };
}
async function compatible(value, options) {
  const safe = input(value, options);
  return normalize(await glob(safe.list, safe.options));
}
function normalize(values) { return [...new Set(values.map(value => value.length > 1 ? value.replace(/\/$/, '') : value))].sort(); }
function sync(value, options) {
  const safe = input(value, options);
  return normalize(globSync(safe.list, safe.options));
}
compatible.sync = sync;
compatible.globSync = sync;
compatible.glob = compatible;
compatible.async = compatible;
module.exports = compatible;
