import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const source = JSON.parse(await readFile(path.join(root, "sitio/public/catalogo.json"), "utf8"));
const examples = JSON.parse(await readFile(path.join(root, "libro-cobria/practical-examples.json"), "utf8"));
const taxonomy = JSON.parse(await readFile(path.join(root, "specification/pattern-taxonomy.json"), "utf8"));
const byId = new Map(examples.map((item) => [item.id, item]));

const sourcesByFamily = {
  "Modelado documental": ["Evans (2003)", "Fowler (2002)", "Kleppmann (2017)"],
  "Seguridad por ámbito": ["OWASP: principios de autorización", "Kleppmann (2017)"],
  "Catálogos y vocabularios": ["Fowler (2002)", "Evans (2003)"],
  "Proyecciones de lectura": ["Fowler (2002)", "Kleppmann (2017)"],
  "Reconstrucción": ["Kleppmann (2017)", "Fowler (2002)"],
  "Eventos y consistencia": ["Kleppmann (2017)", "Fowler (2002)"],
  "Gobernanza del ciclo de vida": ["Kleppmann (2017)", "Sadalage y Fowler (2012)"],
  "Analítica reproducible": ["Kleppmann (2017)", "composición COBRIA"],
  "IA con procedencia": ["Kleppmann (2017)", "composición COBRIA"]
};

function firstSentence(text) {
  return text.split(/(?<=[.!?])\s+/)[0];
}

const names = new Set(source.items.map((item) => item.nombre));
const items = source.items.map((item) => {
  const example = byId.get(item.id);
  const relations = item.relaciones.filter((name) => names.has(name)).map((name) => ({ type: "complementa", target: name }));
  return {
    id: item.id,
    slug: item.slug,
    nombre: item.nombre,
    familia: item.familia,
    tipo: item.tipo,
    estado: "documentado",
    resumen: item.proposito,
    problema: item.problema,
    contexto: item.aplicacion,
    fuerzas: ["simplicidad frente a control", "rendimiento frente a costo total", "autonomía frente a autoridad y trazabilidad"],
    cuandoUsar: firstSentence(item.aplicacion),
    cuandoEvitar: `Evítelo cuando el problema descrito no existe o una alternativa más simple satisface el contrato de ${item.nombre}.`,
    estructura: example?.participantes?.join(" → ") ?? item.contrato,
    participantes: example?.participantes ?? [],
    secuencia: item.contrato,
    ejemplo: { escena: example?.escena ?? item.analogia, problema: example?.problema ?? item.problema, resultado: example?.resultado ?? item.solucion },
    codigo: example?.code ?? {},
    casoNegativo: `La solución se introduce sin contrato ni prueba y termina ocultando el problema que ${item.nombre} debía controlar.`,
    antipatrones: [`${item.nombre} ceremonial`, "aplicación sin medición ni caso negativo"],
    consecuencias: item.metricas,
    pruebas: [`comprobar: ${item.contrato}`, `resolver y verificar: ${item.ejercicio}`],
    seguridad: "Conservar actor, capacidad, ámbito y finalidad cuando el flujo accede o transforma información sensible.",
    operacion: item.metricas,
    migracionRetiro: `Introducir detrás de un contrato, comparar el comportamiento y retirar cuando deje de justificar su costo. ${item.aplicacion}`,
    relaciones: relations,
    ejercicio: { consigna: item.ejercicio, resultadoEsperado: "Decisión justificada, caso negativo y evidencia observable." },
    procedencia: { clasificacion: item.evidencia, fuentes: sourcesByFamily[item.familia] ?? ["composición COBRIA"], sourceSlug: item.slug }
  };
});

const catalog = {
  schemaVersion: taxonomy.schemaVersion,
  catalogVersion: taxonomy.catalogVersion,
  status: "documentado",
  source: taxonomy.source,
  itemCount: items.length,
  families: taxonomy.families,
  items
};

for (const relative of ["editorial/generated/pattern-catalog.json", "sitio/public/pattern-catalog.json"]) {
  const output = path.join(root, relative);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}
console.log(`Catálogo enriquecido generado: ${items.length} patrones, ${taxonomy.families.length} familias.`);
