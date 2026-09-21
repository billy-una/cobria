import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laboratorio guiado · COBRIA",
  description: "Práctica interactiva para convertir una necesidad de software en una decisión verificable.",
  alternates: { canonical: "/laboratorio" },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
