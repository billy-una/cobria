import { copyFile, mkdir, stat, lstat, readdir, readFile, writeFile, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const siteRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const repositoryRoot = path.resolve(siteRoot, "..");
const downloads = path.join(siteRoot, "public", "downloads");

const artifacts = [
  ["libro", "Libro pedagógico", "output/pdf/COBRIA-ecosistema-manual-completo.pdf", "COBRIA-libro-web.pdf", "educativa"],
  ["cuaderno", "Cuaderno de trabajo", "output/pdf/COBRIA-cuaderno-de-trabajo.pdf", "COBRIA-cuaderno.pdf", "educativa"],
  ["anexo", "Anexo técnico", "output/pdf/COBRIA-anexo-tecnico.pdf", "COBRIA-anexo-tecnico.pdf", "técnica"],
  ["articulo", "Artículo científico", "output/pdf/COBRIA-articulo-cientifico-actualizado.pdf", "COBRIA-articulo.pdf", "científica"],
  ["maestro", "Documento maestro", "output/pdf/COBRIA-documento-maestro-ecosistema.pdf", "COBRIA-documento-maestro.pdf", "metodológica"],
  ["especificacion", "Especificación del ecosistema", "output/pdf/COBRIA-especificacion-ecosistema-1.0.pdf", "COBRIA-especificacion.pdf", "normativa"],
];

const canonical = JSON.parse(await readFile(path.join(repositoryRoot, "editorial", "canonical.json"), "utf8"));
const sha256 = async file => createHash("sha256").update(await readFile(file)).digest("hex");

await mkdir(downloads, { recursive: true });
const staleMaster = path.join(downloads, "COBRIA-tesis.pdf");
if (await lstat(staleMaster).catch(error => { if (error.code === 'ENOENT') return null; throw error; }))
  throw new Error('Existe una copia tesis histórica: conservarla y revisarla explícitamente; la compatibilidad se resuelve por redirección, no sobrescribiendo el archivo.');

const manifestItems = [];
for (const [id, title, sourceRelative, targetName, authority] of artifacts) {
  const source = path.join(repositoryRoot, sourceRelative);
  const target = path.join(downloads, targetName);
  const info = await stat(source).catch(() => null);
  if (!info?.isFile()) {
    throw new Error(`Falta el artefacto canónico requerido: ${sourceRelative}`);
  }
  if (info.size > 24 * 1024 * 1024) {
    const temporary = `${target}.optimizado.pdf`;
    const optimized = await run("python3", [path.join(repositoryRoot, "replication", "scripts", "optimize-web-pdf.py"), source, temporary]);
    console.log(optimized.stdout.trim());
    await rename(temporary, target);
  } else {
    await copyFile(source, target);
  }
  const targetInfo = await stat(target);
  manifestItems.push({
    id, title, authority, mediaType: "application/pdf",
    version: canonical.identity.ecosystemVersion,
    status: canonical.release.status,
    href: `/downloads/${targetName}`,
    source: sourceRelative,
    bytes: targetInfo.size,
    sha256: await sha256(target),
    sourceBytes: info.size,
    sourceSha256: await sha256(source),
    optimized: targetInfo.size < info.size,
    optimization: info.size > 24 * 1024 * 1024 ? "jpeg-rgb-92-sin-remuestreo-texto-y-estructura-conservados" : "copia-canonica",
  });
  console.log(`Sincronizado ${sourceRelative} → public/downloads/${targetName}`);
}

const manifest = {
  schemaVersion: "1.0.0",
  release: canonical.release.tag,
  version: canonical.identity.ecosystemVersion,
  publicationDate: canonical.release.candidateDate,
  status: canonical.release.status,
  algorithm: "SHA-256",
  items: manifestItems,
};
await writeFile(path.join(downloads, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

// HTML de lectura con texto conservado, fuentes locales y límites de accesibilidad.
await run('python3', [path.join(repositoryRoot, 'editorial', 'ep9', 'reader_html.py')]);

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
