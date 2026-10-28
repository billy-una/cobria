import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { practiceFor } from './lesson-practice.mjs';
import { buildEp2 } from './ep2/build.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));

export function buildCurriculum() {
  buildEp2();
  const base = JSON.parse(fs.readFileSync(path.join(here, "pedagogy.json"), "utf8"));
  const extension = JSON.parse(fs.readFileSync(path.join(here, "pedagogy-extension.json"), "utf8"));
  const labs = JSON.parse(fs.readFileSync(path.join(here, "labs.json"), "utf8"));
  const engineering = JSON.parse(fs.readFileSync(path.join(here, "engineering-practices.json"), "utf8"));
  const dataLessons = JSON.parse(fs.readFileSync(path.join(here, "data-lessons.json"), "utf8"));
  const architectureLessons = JSON.parse(fs.readFileSync(path.join(here, "architecture-lessons.json"), "utf8"));
  const workshops = [dataLessons, ...architectureLessons.modules.map(module=>({...module,
    guide:architectureLessons.guide,testFile:architectureLessons.testFile}))];
  const modules = base.modules.map(module => {
    const original = module.key === "operaciones" ? module.lessons.slice(0, 2) : module.lessons;
    const extra = extension.extraLessons[module.key] ?? [];
    const meta = extension.moduleMeta[module.key];
    if (!meta) throw new Error(`Falta metadata del módulo ${module.key}`);
    const workshop = workshops.find(item=>item.module===module.key);
    const sourceLessons = workshop ? workshop.lessons.map(lesson => {
      const testFile = workshop.testFile ?? 'replication/examples/ecosistema-app/test/datos-c2.test.mjs';
      const pattern = `--test-name-pattern=^${lesson.testName}$`;
      return {...lesson, guide:workshop.guide, codeKind:'lectura-guiada', execution:{
        cwd:'.', binary:'node', argv:['--test','--test-reporter=tap',pattern,testFile],
        command:`node --test --test-reporter=tap --test-name-pattern='^${lesson.testName}$' ${testFile}`,
        kind:'prueba-local', minimumPassed:1, expected:lesson.expected,
        prerequisites:['Node.js 22.13 o superior.', 'Terminal en la raíz de COBRIA; no requiere instalar paquetes ni conectar un motor.'],
        tests:[testFile], troubleshooting:['pass 0 no demuestra el caso: revise el nombre exacto de la prueba.',
          workshop.module === 'datos' ? 'Si hay fail, lea el primer error y compárelo con el diccionario; no cambie la regla para obtener verde.' :
            'Si hay fail, lea el primer error y compárelo con el contrato y el mapa de responsabilidades; no oculte el rechazo.']
      }};
    }) : [...original, ...extra];
    if (module.key === dataLessons.module) meta.sources = [dataLessons.guide,
      'replication/examples/ecosistema-app/data/diccionario-observaciones.json', ...meta.sources];
    else if(workshop) meta.sources = [workshop.guide,
      'replication/examples/ecosistema-app/data/arquitectura.json', ...meta.sources];
    const lessons = sourceLessons.map(lesson => ({...lesson,
      execution: lesson.execution ?? null, codeKind: lesson.codeKind ?? 'contrato-orientativo',
      guide: lesson.guide ?? null}));
    for (const lesson of lessons) if (lesson.execution) {
      const value = lesson.execution;
      if (!value.cwd || !value.command || !value.expected || !value.argv?.length || !value.tests?.length) {
        throw new Error(`Contrato de ejecución incompleto: ${lesson.title}`);
      }
      for (const filename of value.tests) if (!fs.existsSync(path.resolve(here, '..', filename))) {
        throw new Error(`Prueba de lección ausente: ${filename}`);
      }
    }
    if (lessons.length < extension.minimumLessonsPerModule) {
      throw new Error(`${module.key} solo tiene ${lessons.length} lecciones`);
    }
    const contextual = {...module,...meta};
    return {...contextual, lessons:lessons.map((lesson,index)=>({...lesson,
      guide:lesson.guide ?? meta.sources[0],practice:practiceFor(contextual,lesson,index)}))};
  });
  const known = new Set(modules.map(module => module.key));
  const practiceIds = new Set();
  for (const practice of engineering.practices) {
    if (practiceIds.has(practice.id)) throw new Error(`Práctica duplicada: ${practice.id}`);
    practiceIds.add(practice.id);
    for (const key of practice.modules) if (!known.has(key)) throw new Error(`Módulo desconocido en ${practice.id}: ${key}`);
    for (const field of ["title", "situation", "rule", "code", "verification", "limit"]) {
      if (!practice[field]) throw new Error(`Falta ${field} en ${practice.id}`);
    }
    if (!practice.steps?.length) throw new Error(`Faltan pasos en ${practice.id}`);
  }
  for (const lab of labs.labs) if (!known.has(lab.module)) throw new Error(`Laboratorio ${lab.id} usa módulo desconocido`);
  if (labs.labs.length !== 30) throw new Error(`Se esperaban 30 laboratorios y existen ${labs.labs.length}`);
  const curriculum = {
    schemaVersion: "1.0.0",
    version: base.version,
    title: base.title,
    promise: base.promise,
    lessonModel: base.lessonModel,
    moduleCount: modules.length,
    lessonCount: modules.reduce((sum, module) => sum + module.lessons.length, 0),
    labCount: labs.labs.length,
    practiceCount: engineering.practices.length,
    practiceSource: engineering.source,
    practiceExample: engineering.example,
    modules,
    labs: labs.labs,
    practices: engineering.practices
  };
  fs.writeFileSync(path.join(here, "curriculum.json"), `${JSON.stringify(curriculum, null, 2)}\n`);
  const contentMap = {
    schemaVersion: "1.0.0",
    authorityFlow: ["especificación", "evidencia", "maestro y artículo", "currículo", "libro y sitio"],
    rule: "El libro y el sitio consumen el mismo currículo; las fases internas no forman la ruta pedagógica.",
    modules: modules.map((module, index) => ({
      number: index + 1,
      key: module.key,
      title: module.title,
      route: module.route,
      lessonRoutes: module.lessons.map((_, lessonIndex) => `/aprender/${module.key}/${lessonIndex + 1}`),
      checkpoint: module.checkpoint,
      sources: module.sources,
      bookSection: `Parte ${index + 1}: ${module.title}`,
      lessonCount: module.lessons.length,
      labIds: labs.labs.filter(lab => lab.module === module.key).map(lab => lab.id),
      practiceIds: engineering.practices.filter(practice => practice.modules.includes(module.key)).map(practice => practice.id)
    }))
  };
  fs.writeFileSync(path.join(here, "content-map.json"), `${JSON.stringify(contentMap, null, 2)}\n`);
  return curriculum;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const curriculum = buildCurriculum();
  console.log(`Currículo generado: ${curriculum.moduleCount} módulos, ${curriculum.lessonCount} lecciones y ${curriculum.labCount} laboratorios.`);
}
