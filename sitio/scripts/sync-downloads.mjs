import { copyFile, mkdir, stat, readdir, readFile, writeFile, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const siteRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const repositoryRoot = path.resolve(siteRoot, "..");
const downloads = path.join(siteRoot, "public", "downloads");

const artifacts = [
  ["output/pdf/COBRIA-ecosistema-manual-completo.pdf", "COBRIA-libro-web.pdf"],
  ["output/pdf/COBRIA-cuaderno-de-trabajo.pdf", "COBRIA-cuaderno.pdf"],
  ["output/pdf/COBRIA-anexo-tecnico.pdf", "COBRIA-anexo-tecnico.pdf"],
  ["output/pdf/COBRIA-articulo-cientifico-actualizado.pdf", "COBRIA-articulo.pdf"],
  ["output/pdf/COBRIA-documento-maestro-ecosistema.pdf", "COBRIA-documento-maestro.pdf"],
  ["output/pdf/COBRIA-especificacion-ecosistema-1.0.pdf", "COBRIA-especificacion.pdf"],
];

await mkdir(downloads, { recursive: true });
const staleMaster = path.join(downloads, "COBRIA-tesis.pdf");
if ((await stat(staleMaster).catch(() => null))?.isFile()) {
  const archive = path.join(siteRoot, "public", "archivo");
  await mkdir(archive, { recursive: true });
  await rename(staleMaster, path.join(archive, "COBRIA-documento-maestro-historico.pdf"));
}

for (const [sourceRelative, targetName] of artifacts) {
  const source = path.join(repositoryRoot, sourceRelative);
  const target = path.join(downloads, targetName);
  const info = await stat(source).catch(() => null);
  if (!info?.isFile()) {
    throw new Error(`Falta el artefacto canónico requerido: ${sourceRelative}`);
  }
  if (info.size > 24 * 1024 * 1024) {
    const temporary = `${target}.optimizado.pdf`;
    await run("gs", ["-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.6", "-dPDFSETTINGS=/ebook", "-dNOPAUSE", "-dQUIET", "-dBATCH", `-sOutputFile=${temporary}`, source]);
    await rename(temporary, target);
  } else {
    await copyFile(source, target);
  }
  console.log(`Sincronizado ${sourceRelative} → public/downloads/${targetName}`);
}

async function cleanHtml(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await cleanHtml(target);
    if (entry.isFile() && entry.name.endsWith(".html")) {
      const source = await readFile(target, "utf8");
      const cleaned = source.replace(/<aside class="ad-space[^>]*>[\s\S]*?<\/aside>/g, "");
      if (cleaned !== source) await writeFile(target, cleaned);
    }
  }
}
await cleanHtml(path.join(siteRoot, "public"));
