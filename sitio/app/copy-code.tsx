"use client";

import { useState } from "react";

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [failed,setFailed]=useState(false);
  async function copy() {
    setFailed(false);
    try{await navigator.clipboard.writeText(code);setCopied(true);window.setTimeout(()=>setCopied(false),1800);}
    catch{setCopied(false);setFailed(true);}
  }
  return <div className="manual-code">
    <div><span>Código o comando</span><button type="button" onClick={copy} aria-label="Copiar ejemplo de código">{copied ? "Copiado" : "Copiar"}</button></div>
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- El código desplazable necesita foco para operarse con teclado; no simula un botón. */}
    <pre tabIndex={0} aria-label="Código del ejemplo; use las flechas para desplazarse"><code>{code}</code></pre>
    <div className="copy-toast" role="status" aria-live="polite" data-visible={copied||failed}>{failed?'No se pudo copiar. Seleccione el código y cópielo manualmente.':copied?'Código copiado al portapapeles':''}</div>
  </div>;
}
