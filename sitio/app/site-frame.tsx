import Link from "next/link";
import { cobria } from "./cobria-canonical";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return <main id="contenido"><header className="nav"><Link className="brand" href="/">COBRIA <span>guía de software</span></Link><nav aria-label="Navegación principal"><Link href="/">Inicio</Link><Link href="/comenzar">Guía</Link><Link href="/explorar">Patrones</Link><Link href="/mapa">Mapa</Link><Link href="/laboratorio">Laboratorio</Link><Link href="/recursos">Recursos</Link></nav></header>{children}<footer><b>COBRIA</b><span>{cobria.identity.author} · {cobria.identity.place}</span><nav aria-label="Enlaces editoriales"><Link href="/historia">Historia</Link><Link href="/privacidad">Privacidad y uso</Link></nav></footer></main>;
}
