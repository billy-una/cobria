import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // La identidad de despliegue pertenece a la candidata, no a una ejecución
  // particular. Vinext la incorpora en los artefactos cliente y servidor.
  deploymentId: "cobria-ecosistema-1-0-0-rc2",
  generateBuildId: async () => "cobria-ecosistema-1-0-0-rc2",
};

export default nextConfig;
