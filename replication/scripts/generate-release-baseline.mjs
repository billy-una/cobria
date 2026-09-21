import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "../..");
const scopePath = path.join(root, "editorial/release-scope.json");
const scope = JSON.parse(await readFile(scopePath, "utf8"));
const outputPath = path.join(root, scope.inventoryOutput);

function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function normalizeStatus(line) {
  return { code: line.slice(0, 2), path: line.slice(3).replace(/^"|"$/g, "") };
}

function classify(filePath) {
  if (filePath === scope.inventoryOutput) return "inventory";
  for (const group of scope.classifications) {
    if (group.paths.some((prefix) => filePath === prefix || filePath.startsWith(`${prefix}/`))) {
      return group.id;
    }
  }
  return "repository";
}

const rawStatus = git("status", "--short", "--untracked-files=all");
const changes = rawStatus
  ? rawStatus.split("\n").map(normalizeStatus).filter((item) => item.path !== scope.inventoryOutput)
  : [];

const statusCounts = changes.reduce((counts, item) => {
  const key = item.code === "??" ? "untracked" : item.code.includes("D") ? "deleted" : item.code.includes("M") ? "modified" : "other";
  counts[key] += 1;
  return counts;
}, { modified: 0, deleted: 0, untracked: 0, other: 0 });

const classificationCounts = changes.reduce((counts, item) => {
  const key = classify(item.path);
  counts[key] = (counts[key] ?? 0) + 1;
  return counts;
}, {});

const protectedCorePath = path.join(root, scope.protectedCore);
const canonicalFiles = [
  "MANIFESTO.md",
  "IDENTIDAD-ECOSISTEMA-COBRIA.md",
  "ROADMAP-CIERRE-ECOSISTEMA-COBRIA.md",
  "editorial/canonical.json",
  "editorial/products.json",
  scope.protectedCore
];

const hashes = {};
for (const relative of canonicalFiles) {
  try {
    hashes[relative] = sha256(await readFile(path.join(root, relative)));
  } catch {
    hashes[relative] = null;
  }
}

const report = {
  schemaVersion: "1.0.0",
  baselineDate: scope.baselineDate,
  targetRelease: scope.targetRelease,
  repository: {
    head: git("rev-parse", "HEAD"),
    branch: git("branch", "--show-current"),
    clean: changes.length === 0,
    statusCounts,
    classificationCounts
  },
  protectedCore: {
    path: scope.protectedCore,
    sha256: sha256(await readFile(protectedCorePath))
  },
  canonicalHashes: hashes,
  publicProducts: scope.publicProducts,
  blockers: [
    ...(changes.length ? ["El árbol de trabajo no representa todavía una release confirmada."] : []),
    "La publicación estable y el despliegue en producción requieren autoridad humana."
  ]
};

await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Inventario reproducible escrito en ${path.relative(root, outputPath)}`);
