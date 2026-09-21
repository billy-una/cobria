import Link from "next/link";
import { cobria } from "./cobria-canonical";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return <main id="contenido"><header className="nav"><Link className="brand" href="/">COBRIA <span>guía de software</span></Link><nav aria-label="Navegación principal"><Link href="/fundamentos">Fundamentos</Link><Link href="/explorar">Buscar</Link><Link href="/mapa">Mapa</Link><Link href="/laboratorio">Laboratorio</Link><Link href="/recursos">Recursos</Link><Link href="/historia">Historia</Link></nav></header>{children}<footer><b>COBRIA</b><span>{cobria.identity.author} · {cobria.identity.place}</span><Link href="/privacidad">Privacidad y uso</Link></footer></main>;
}
