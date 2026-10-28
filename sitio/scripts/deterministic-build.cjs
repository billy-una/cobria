"use strict";
/* eslint-disable @typescript-eslint/no-require-imports */

// Vinext beta genera una identidad RSC aleatoria incluso cuando Next recibe un
// generateBuildId estable. Esa identidad cambia los nombres de chunks sin
// cambiar el programa. Este preload solo actúa durante `npm run build` y fija
// ese material de construcción; no interviene en el servidor ni en ejecución.
if (process.env.COBRIA_DETERMINISTIC_BUILD === "1") {
  const crypto = require("node:crypto");
  const { syncBuiltinESMExports } = require("node:module");
  const seed = crypto
    .createHash("sha256")
    .update("COBRIA|ecosistema-1.0.0-rc2|vinext-rsc-build-identity")
    .digest();

  crypto.randomBytes = function deterministicRandomBytes(size, callback) {
    const output = Buffer.alloc(size);
    for (let offset = 0; offset < size; offset += 1) {
      output[offset] = seed[offset % seed.length];
    }
    if (typeof callback === "function") {
      queueMicrotask(() => callback(null, output));
      return undefined;
    }
    return output;
  };
  syncBuiltinESMExports();
}
