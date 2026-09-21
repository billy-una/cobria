import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorar patrones · COBRIA",
  description: "Buscador del catálogo COBRIA por problema, familia y nivel de aprendizaje.",
  alternates: { canonical: "/explorar" },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
