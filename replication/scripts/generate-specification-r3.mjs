import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const input = path.join(root, "specification", "requirements-1.0.json");
const outputDir = path.join(root, "specification", "generated");
const check = process.argv.includes("--check");
const model = JSON.parse(await readFile(input, "utf8"));

function tex(value) {
  return String(value)
    .replaceAll("\\", "\\textbackslash{}")
    .replaceAll("&", "\\&")
    .replaceAll("%", "\\%")
    .replaceAll("$", "\\$")
    .replaceAll("#", "\\#")
    .replaceAll("_", "\\_")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("~", "\\textasciitilde{}")
    .replaceAll("^", "\\textasciicircum{}");
}

function pathTex(value) {
  return `\\path{${String(value).replaceAll("}", "\\}")}}`;
}

const byLevel = Object.groupBy(model.requirements, (requirement) => requirement.level);
const requirements = [
  "% Generado desde specification/requirements-1.0.json. No editar a mano.",
  `\\newcommand{\\ConteoRequisitos}{${model.requirements.length}}`,
];
for (const level of ["C1", "C2", "C3"]) {
  const meta = model.levels[level];
  requirements.push(`\\subsection{Nivel ${level}: ${tex(meta.name)}}`);
  requirements.push(`\\label{nivel:${level.toLowerCase()}}`);
  if (meta.inherits.length) {
    requirements.push(`Este nivel hereda todos los requisitos de ${tex(meta.inherits.join(" y "))}.`);
  }
  for (const item of byLevel[level] ?? []) {
    requirements.push(`\\begin{requisito}{${tex(item.id)} --- ${tex(item.title)}}`);
    requirements.push(`\\textbf{Obligación normativa (${tex(item.keyword)}).} ${tex(item.statement)}\\par`);
    requirements.push("\\textbf{Criterios de aceptación.}");
    requirements.push("\\begin{itemize}");
    for (const acceptance of item.acceptance) requirements.push(`\\item ${tex(acceptance)}`);
    requirements.push("\\end{itemize}");
    requirements.push(`\\textbf{Responsable.} ${tex(item.owner)}.\\par`);
    requirements.push(`\\textbf{Verificación.} ${tex(item.test)}.\\par`);
    requirements.push(`\\textbf{Comando reproducible.} \\texttt{\\detokenize{${item.command}}}\\par`);
    requirements.push(`\\textbf{Evidencia resoluble.} ${item.evidence.map(pathTex).join("; ")}.\\par`);
    requirements.push(`\\textbf{Amenaza residual.} ${tex(item.threat)}\\par`);
    requirements.push(`\\textbf{Origen normativo.} ${tex(item.source)}.`);
    requirements.push("\\end{requisito}");
  }
}

const traceability = [
  "% Generado desde specification/requirements-1.0.json. No editar a mano.",
  "\\begin{longtable}{>{\\bfseries}p{.10\\linewidth}p{.06\\linewidth}p{.18\\linewidth}p{.23\\linewidth}p{.25\\linewidth}}",
  "\\toprule",
  "ID & Nivel & Responsable & Método & Evidencia principal \\\\",
  "\\midrule",
  "\\endfirsthead",
  "\\toprule",
  "ID & Nivel & Responsable & Método & Evidencia principal \\\\",
  "\\midrule",
  "\\endhead",
];
for (const item of model.requirements) {
  traceability.push(
    `${tex(item.id)} & ${tex(item.level)} & ${tex(item.owner)} & ${tex(item.test)} & ${pathTex(item.evidence[0])} \\\\`
  );
}
traceability.push("\\bottomrule", "\\end{longtable}");

const outputs = new Map([
  [path.join(outputDir, "requirements-1.0.tex"), requirements.join("\n") + "\n"],
  [path.join(outputDir, "traceability-1.0.tex"), traceability.join("\n") + "\n"],
]);

await mkdir(outputDir, { recursive: true });
let stale = false;
for (const [file, content] of outputs) {
  if (check) {
    const current = await readFile(file, "utf8").catch(() => "");
    if (current !== content) {
      console.error(`Derivado desactualizado: ${path.relative(root, file)}`);
      stale = true;
    }
  } else {
    await writeFile(file, content);
    console.log(`Generado ${path.relative(root, file)}`);
  }
}
if (stale) process.exit(1);
if (check) console.log(`Especificación sincronizada: ${model.requirements.length} requisitos.`);
