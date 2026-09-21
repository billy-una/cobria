import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./manual.css";
import { cobria } from "./cobria-canonical";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cobria-atlas.sectagpt.chatgpt.site"),
  title: cobria.titles.site,
  description: "Manuales de fundamentos, capas, patrones, bases de datos, calidad, operaciones, analítica, IA y arquitectura NoSQL reconstruible.",
  keywords: ["COBRIA", "patrones de diseño", "arquitectura de software", "NoSQL", "manual de programación", "software verificable"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "es_CR", title: cobria.titles.site, description: "Patrones, capas, datos, calidad y operaciones para construir software verificable.", url: "/", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: cobria.titles.site, description: "Guía abierta de patrones y software verificable.", images: ["/og.png"] },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const datosEstructurados = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: cobria.titles.site, url: "https://cobria-atlas.sectagpt.chatgpt.site/", inLanguage: "es-CR", description: "Guía abierta de patrones, capas, datos y software verificable." },
      { "@type": "CreativeWork", name: "COBRIA", version: cobria.identity.ecosystemVersion, author: { "@type": "Person", name: cobria.identity.author }, license: "https://creativecommons.org/licenses/by/4.0/", url: "https://cobria-atlas.sectagpt.chatgpt.site/recursos", inLanguage: "es-CR" },
    ],
  };
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a className="skip-link" href="#contenido">Saltar al contenido principal</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }} />
        {children}
      </body>
    </html>
  );
}
