import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {createBaselineReader} from './c0-inputs.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');

export function buildAudit(review, read, probes) {
  const observed = new Map();
  const source = filename => {
    if (!observed.has(filename)) observed.set(filename, read(filename));
    return observed.get(filename);
  };
  const curriculum = JSON.parse(source('editorial/curriculum.json'));
  const contentMap = JSON.parse(source('editorial/content-map.json'));
  const book = source('libro-cobria/index.html');
  const sitemap = source('sitio/public/sitemap.xml');
  const template = source('sitio/app/aprender/[modulo]/[leccion]/page.tsx');
  if (probes.baselineCommit !== review.baselineCommit || probes.kind !== 'automatic-local-probes-not-scientific-experiment') {
    throw new Error('Las sondas no corresponden a la línea base C0');
  }
  for (const item of probes.sourceHashes) {
    if (source(item.path) === null || hash(source(item.path)) !== item.sha256) throw new Error(`Sonda con fuente divergente: ${item.path}`);
  }
  if (curriculum.modules.length !== 17 || review.areas.length !== 17 ||
      new Set(review.areas.map(area => area.key)).size !== 17) throw new Error('C0 exige las 17 áreas distintas');
  const areas = curriculum.modules.map(module => {
    const judgement = review.areas.find(item => item.key === module.key);
    if (!judgement || judgement.closure !== 'parcial' || judgement.readerValidation !== 'no_verificada_para_esta_area_en_C0') {
      throw new Error(`No se puede inferir completitud ni revisión humana: ${module.key}`);
    }
    const mapped = contentMap.modules.find(item => item.key === module.key);
    const sources = [...new Set([...module.sources, ...judgement.implementation, ...judgement.tests])];
    const inventory = sources.map(filename => ({path: filename, existsAtBaseline: source(filename) !== null}));
    const lessons = module.lessons.map((lesson, index) => {
      const bookAnchor = `leccion-${module.number}-${index + 1}`;
      const route = `/aprender/${module.key}/${index + 1}`;
      return {number: index + 1, title: lesson.title,
        fieldsPresent: ['title','situation','simple','steps','example','mistake','evidence','code'].every(key => Boolean(lesson[key]?.length)),
        bookAnchor, bookPresent: book.includes(`id="${bookAnchor}"`), route,
        webSourcePresent: Boolean(template?.includes('lesson.code') && sitemap.includes(`${route}</loc>`) && mapped?.lessonRoutes.includes(route)),
        executionContractPerLesson: Boolean(lesson.execution?.cwd && lesson.execution?.command && lesson.execution?.expected),
        testBindingPerLesson: Boolean(lesson.tests?.length)};
    });
    return {...judgement, number: module.number, title: module.title,
      declaredSources: module.sources, sourceInventory: inventory, lessons,
      coverage: {
        explicado: 'presente_revision_muestral', ejemplificado: 'ejemplos_en_lecciones',
        ejecutable: 'parcial_por_modulo_no_por_leccion', probado: 'pruebas_relacionadas_no_cobertura_total',
        libro: lessons.every(x => x.bookPresent) ? 'anclajes_locales_presentes' : 'anclajes_incompletos',
        web: lessons.every(x => x.webSourcePresent) ? 'fuente_y_rutas_locales_presentes' : 'fuente_o_rutas_incompletas',
        lectores: judgement.readerValidation
      }};
  });
  const findings = review.findings.map(finding => ({...finding,
    evidence: finding.evidence.map(item => {
      const text = source(item.path);
      if (text === null || (item.needle && !text.includes(item.needle))) throw new Error(`Evidencia no encontrada: ${finding.id} ${item.path}`);
      const at = item.needle ? text.indexOf(item.needle) : 0;
      return {...item, line: text.slice(0, at).split('\n').length, sha256: hash(text)};
    })}));
  const labs = curriculum.labs.map(lab => ({id: lab.id, module: lab.module, command: lab.command,
    declaresDirectory: Boolean(lab.cwd || /^cd\s/.test(lab.command)),
    bareNpmWithoutDirectory: /^npm\s/.test(lab.command) && !lab.cwd,
    pedagogicalTaskVerifiedByCommand: 'no_verificado_en_C0'}));
  const scienceSources = ['main.tex', 'articulo-cobria.tex', 'editorial/products.json',
    'partes/parte-i-fundamentos.tex', 'partes/parte-ii-diseno-formalizacion.tex',
    'partes/parte-iii-rendimiento-optimizacion.tex', 'partes/parte-iv-analitica-ia.tex',
    'partes/parte-v-implementacion-casos.tex', 'partes/parte-vi-evaluacion-nosql.tex',
    'partes/parte-vii-sintesis-nosql.tex', 'partes/parte-viii-manual-replica-nosql.tex'];
  for (const filename of scienceSources) source(filename);
  const sourceInventory = [...observed].sort(([a],[b]) => a.localeCompare(b, 'en')).map(([filename, text]) => ({
    path: filename, existsAtBaseline: text !== null, sha256: text === null ? null : hash(text)}));
  return {schemaVersion: '1.0.0', phase: 'C0', baselineCommit: review.baselineCommit, date: review.date,
    reviewer: review.reviewer, scope: review.scope, method: review.method,
    decision: 'alcance_congelado_con_brechas_abiertas',
    totals: {areas: areas.length, lessons: areas.reduce((n, area) => n + area.lessons.length, 0),
      labs: labs.length, practices: curriculum.practices.length, findings: findings.length,
      critical: findings.filter(x => x.severity === 'critica').length,
      bareNpmLabCommands: labs.filter(x => x.bareNpmWithoutDirectory).length,
      areasClosed: 0, humanReaderValidationsEstablished: 0},
    areas, labs, findings, sourceInventory, probeEvidence: probes,
    scientificBoundary: 'El maestro y el artículo explican la contribución investigativa; no se exige que reproduzcan los 17 tutoriales. La difusión pedagógica no demuestra eficacia educativa.'};
}

export function renderAudit(audit) {
  const lines = ['# Auditoría de cobertura y brechas de COBRIA C0', '',
    `Fecha: ${audit.date}. Línea base Git: \`${audit.baselineCommit}\`.`, '',
    'COBRIA posee fuentes para sus 17 áreas, pero la estructura del material no acredita un manual completo para principiantes. C0 congela el alcance de C1 a C15 y registra las brechas; no cierra esas fases ni modifica Core 1.0 o RC2.', '',
    '## Alcance y método', '', audit.method.structural, '', audit.method.qualitative, '',
    ...audit.method.limits.map(x => `- ${x}`), '',
    'La revisión es asistida por IA, no independiente. Cero validaciones de lectores establecidas por C0 no significa que ninguna persona haya leído material anterior: falta vincular resultados de tareas con estas áreas y esta edición.', '',
    '## Matriz de las 17 áreas', '',
    'E: explicación presente, con revisión muestral. I: ejemplo ilustrativo presente. P: ejecución o pruebas parciales por módulo, no por lección. L: anclajes en HTML local. W: fuente y rutas locales; no despliegue. NV: comprensión de lectores no verificada. Ninguna marca significa completitud.', '',
    '| Área | Explicado | Ejemplo | Ejecutable | Pruebas | Libro | Web | Lectores | Siguiente fase |',
    '|---|---|---|---|---|---|---|---|---|'];
  for (const area of audit.areas) lines.push(`| ${area.number} ${area.title} | E | I | P | P | ${area.coverage.libro === 'anclajes_locales_presentes' ? 'L' : 'falta'} | ${area.coverage.web === 'fuente_y_rutas_locales_presentes' ? 'W' : 'falta'} | NV | ${area.nextPhase} |`);
  lines.push('', '## Resultados estructurales', '',
    `${audit.totals.areas} áreas, ${audit.totals.lessons} lecciones, ${audit.totals.labs} laboratorios y ${audit.totals.practices} prácticas. Hay ${audit.totals.bareNpmLabCommands} comandos npm de laboratorio sin directorio declarado. Las cifras describen estructura, no porcentaje de calidad.`, '',
    'Los campos de ejecución y enlace de pruebas por lección se registran explícitamente, no se infieren del texto «Cómo comprobarlo». El JSON distingue esas ausencias de las pruebas existentes a nivel de proyecto.', '',
    'Las seis sondas ejecutadas están en `probes.json`. La sonda crítica creó cuatro archivos sintéticos únicamente en un directorio temporal. Las sondas no son un experimento científico ni una revisión independiente.', '',
    '## Brechas que bloquean el cierre', '');
  for (const finding of audit.findings) {
    lines.push(`### ${finding.id} ${finding.title}`, '', `Severidad: ${finding.severity}. Fase responsable: ${finding.phase}.`, '', finding.action, '',
      ...finding.evidence.map(x => `- [${x.path}:${x.line}](../../${x.path})${x.needle ? `: \`${x.needle.replaceAll('`', "'")}\`` : ''}`), '');
  }
  lines.push('## Criterio pendiente por área', '');
  for (const area of audit.areas) {
    lines.push(`### ${area.number} ${area.title}`, '', area.finding, '', `Para cerrar: ${area.acceptance}`, '',
      `Muestra cualitativa: lección ${area.sampledLesson}. Estado: parcial.`, '',
      ...area.sourceInventory.map(x => x.existsAtBaseline
        ? `- Fuente presente: [${x.path}](../../${x.path})`
        : `- Fuente ausente: \`${x.path}\``), '');
  }
  lines.push('## Separación científica y editorial', '', audit.scientificBoundary, '',
    'C11 debe conservar la especialización del artículo y enlazar afirmaciones con resultados. C10 debe revisar el libro y la web; compartir el mismo JSON solo demuestra una fuente común, no comprensión ni equivalencia de uso.', '',
    '## Reproducir y conservar la línea base', '',
    '`node editorial/audit-c0.mjs --check` verifica los derivados contra el commit congelado. Requiere ese objeto Git; no consulta la web ni ejecuta comandos de los laboratorios. `node editorial/audit-c0.mjs` regenera exclusivamente los derivados C0.', '',
    'Los cambios futuros de C1 a C15 no reescriben los resultados de esta línea base. Se registrarán cierres con sus propias pruebas, commit y revisión. Las huellas y los estados por lección están en `coverage.json`.', '');
  return lines.join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const review = JSON.parse(fs.readFileSync(path.join(root, 'editorial/c0/review.json'), 'utf8'));
  const read = createBaselineReader(root);
  if (read('editorial/curriculum.json') === null) throw new Error('Falta la línea base C0 en Git o sus entradas congeladas verificables');
  const probes = JSON.parse(fs.readFileSync(path.join(root, 'editorial/c0/probes.json'), 'utf8'));
  const result = buildAudit(review, read, probes);
  const outputs = {'coverage.json': `${JSON.stringify(result, null, 2)}\n`, 'AUDITORIA-C0.md': renderAudit(result)};
  for (const [name, value] of Object.entries(outputs)) {
    const target = path.join(root, 'editorial/c0', name);
    if (process.argv.includes('--check')) {
      if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== value) throw new Error(`Derivado C0 divergente: ${name}`);
    } else fs.writeFileSync(target, value);
  }
  console.log(`C0: ${result.totals.areas} áreas, ${result.totals.findings} brechas (${result.totals.critical} crítica); ninguna área declarada completa.`);
}
