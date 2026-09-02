import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const packageData = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
const lock = JSON.parse(await fs.readFile(path.join(root, "package-lock.json"), "utf8"));
const components = Object.entries(lock.packages || {})
  .filter(([name]) => name && name !== "")
  .map(([name, data]) => ({
    type: "library",
    name: name.replace(/^node_modules\//, ""),
    version: data.version || "unknown",
    purl: data.version ? `pkg:npm/${name.replace(/^node_modules\//, "")}@${data.version}` : undefined
  }));
const sbom = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  serialNumber: "urn:uuid:00000000-0000-4000-8000-000000000001",
  version: 1,
  metadata: { component: { type: "application", name: packageData.name, version: packageData.version } },
  components
};
await fs.writeFile(path.join(root, "SBOM.cdx.json"), `${JSON.stringify(sbom, null, 2)}\n`);
console.log(JSON.stringify({ components: components.length, output: "SBOM.cdx.json" }));
