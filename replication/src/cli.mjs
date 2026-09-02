#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { LokiJsAdapter } from "./adapters/lokijs-adapter.mjs";
import { PouchDbAdapter } from "./adapters/pouchdb-adapter.mjs";
import { runConformance } from "./conformance.mjs";

function argumentsOf(argv) {
  const options = { command: argv[0], adapter: "lokijs", output: "cobria-informe" };
  for (let index = 1; index < argv.length; index++) {
    if (argv[index] === "--adaptador") options.adapter = argv[++index];
    else if (argv[index] === "--salida") options.output = argv[++index];
    else if (argv[index] === "--tamano") options.size = Number(argv[++index]);
  }
  return options;
}

async function adapterOf(value) {
  if (value === "lokijs") return new LokiJsAdapter();
  if (value === "pouchdb") return new PouchDbAdapter();
  const moduleUrl = value.startsWith("file:") ? value : pathToFileURL(path.resolve(value)).href;
  const loaded = await import(moduleUrl);
  if (typeof loaded.crearAdaptador === "function") return loaded.crearAdaptador();
  if (loaded.default && typeof loaded.default === "function") return new loaded.default();
  throw new Error("El módulo debe exportar crearAdaptador() o una clase predeterminada.");
}

function profileOf(result) {
  if (!result.P1.pass || !result.S1.pass) return "NO CONFORME";
  if (!result.P2.pass || !result.R1.pass) return "C1 FUNCIONAL";
  if (!result.A1.pass) return "C2 FUNCIONAL";
  return "C3 FUNCIONAL";
}

const options = argumentsOf(process.argv.slice(2));
if (options.command !== "verificar") {
  console.error("Uso: cobria verificar --adaptador lokijs|pouchdb|./mi-adaptador.mjs [--salida directorio] [--tamano 1000]");
  process.exitCode = 2;
} else {
  let adapter;
  try {
    adapter = await adapterOf(options.adapter);
    const result = await runConformance(adapter, { engine: options.adapter, size: options.size || 1000 });
    const profile = profileOf(result);
    const report = {
      specification: "COBRIA Core 1.1 (borrador)",
      scope: "conformidad funcional del arnés local",
      generatedAt: new Date().toISOString(),
      adapter: options.adapter,
      profile,
      tests: Object.fromEntries(["P1", "P2", "R1", "S1", "A1"].map(name => [name, result[name]])),
      limitations: [
        "El informe no sustituye una auditoría independiente.",
        "C3 funcional no demuestra observabilidad, retiro ni seguridad operativa en producción.",
        "La certificación normativa exige revisar trazabilidad y evidencia externa."
      ]
    };
    await fs.mkdir(options.output, { recursive: true });
    await fs.writeFile(path.join(options.output, "informe.json"), JSON.stringify(report, null, 2));
    await fs.writeFile(path.join(options.output, "informe.md"), `# Informe de conformidad COBRIA\n\n- Adaptador: ${options.adapter}\n- Resultado: **${profile}**\n- Alcance: ${report.scope}\n\n${Object.entries(report.tests).map(([name, value]) => `- ${name}: ${value.pass ? "superada" : "no superada"}`).join("\n")}\n\n## Límites\n\n${report.limitations.map(item => `- ${item}`).join("\n")}\n`);
    console.log(JSON.stringify({ profile, output: path.resolve(options.output) }));
    if (profile === "NO CONFORME") process.exitCode = 1;
  } catch (error) {
    console.error(`No se pudo verificar el adaptador: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (adapter?.close) await adapter.close();
  }
}
