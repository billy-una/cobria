"use client";

import { useState } from "react";

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return <div className="manual-code">
    <div><span>Ejemplo práctico</span><button type="button" onClick={copy} aria-label="Copiar ejemplo de código">{copied ? "Copiado" : "Copiar"}</button></div>
    <pre><code>{code}</code></pre>
    <div className="copy-toast" role="status" aria-live="polite" data-visible={copied}>Código copiado al portapapeles</div>
  </div>;
}
