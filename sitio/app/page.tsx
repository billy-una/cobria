import { cobria } from "./cobria-canonical";

const modules = [
  ["01", "Fundamentos", "Entidades, objetos de valor, contratos y vocabulario común.", "/fundamentos"],
  ["02", "Layers", "Responsabilidades claras desde la interfaz hasta la persistencia.", "/capas"],
  ["03", "Pattern Design", "Patrones prácticos para organizar cambios, lecturas y fallos.", "/patrones-diseno"],
  ["04", "Data", "Modelado documental, índices, catálogos y migraciones seguras.", "/datos"],
  ["05", "Core", "Invariantes COBRIA para autoridad y derivados reconstruibles.", "/core"],
  ["06", "API y experiencia", "Contratos, estados, accesibilidad e internacionalización.", "/api-ux"],
  ["07", "Seguridad", "Capacidades, ámbito, privacidad, secretos y suministro.", "/seguridad"],
  ["08", "Calidad y rendimiento", "Pruebas, mediciones, presupuestos y costo total.", "/calidad"],
  ["09", "Nube y operaciones", "Ambientes, despliegue, recuperación y observabilidad.", "/operaciones"],
  ["10", "Analítica e IA", "Conjuntos reproducibles, procedencia y abstención con evidencia.", "/ia"],
  ["11", "Build", "Una aplicación completa, explicada de principio a fin.", "/construir"],
  ["12", "Toolkit", "Herramientas seguras para personas, agentes y CI.", "/herramientas"],
  ["13", "Evidencia", "Experimentos, trazabilidad, límites y transferencia.", "/evidencia"],
  ["14", "Engineering", "Resiliencia, entrega, observabilidad, costo y evolución.", "/engineering"],
];

const patterns = [
  ["Entidad canónica", "Una identidad y una autoridad para cada hecho."],
  ["Repositorio con ámbito", "El límite de acceso forma parte de cada operación."],
  ["Caso de uso explícito", "Una intención del usuario, una entrada y un resultado."],
  ["Proyección reconstruible", "Una lectura optimizada que puede borrarse y rehacerse."],
  ["Catálogo versionado", "Datos de referencia que evolucionan sin romper el pasado."],
  ["Publicación segura", "La nueva lectura se hace visible solo después de verificarla."],
];

export default function Home() {
  return <main id="contenido">
    <header className="nav"><a className="brand" href="#home">COBRIA <span>guía de software</span></a><nav aria-label="Navegación principal"><a href="#path">Empezar</a><a href="#modules">Manuales</a><a href="/explorar">Buscar</a><a href="/mapa">Mapa</a><a href="/laboratorio">Laboratorio</a><a href="/evidencia">Evidencia</a><a href="/recursos">Recursos</a></nav></header>
    <section className="hero" id="home"><div className="hero-copy"><p className="eyebrow">De una idea a software mantenible</p><h1>Aprende a diseñar programas que puedan <em>entenderse, probarse y evolucionar.</em></h1><p className="lead">COBRIA reúne fundamentos, capas, patrones, bases de datos, calidad, operaciones e inteligencia artificial en una guía práctica. Core conserva el núcleo científico; el ecosistema enseña a construir alrededor de él.</p><div className="actions"><a className="primary" href="#path">Comenzar la ruta</a><a className="secondary" href="#build">Ver código ejecutable</a></div></div><div className="ecosystem" role="img" aria-label="Mapa de aprendizaje: fundamentos, datos y calidad sostienen capas, operación, inteligencia artificial y patrones"><div className="canopy">Patrones y decisiones</div><div className="bird" aria-hidden="true">✦</div><div className="trunk">Software<br/><b>verificable</b></div><div className="root r1">Fundamentos</div><div className="root r2">Datos</div><div className="root r3">Calidad</div><div className="projection p1">Capas</div><div className="projection p2">Operación</div><div className="projection p3">IA</div></div></section>
    <section className="learning" id="path"><div><p className="eyebrow">Ruta para principiantes</p><h2>No necesitas dominar arquitectura para empezar.</h2><p>Recorre {cobria.ecosystem.moduleCount} estaciones. En cada una encontrarás una explicación sencilla, una decisión concreta, código legible y una prueba que demuestra el resultado.</p></div><ol><li><b>1</b><span>Comprende el problema y nombra las responsabilidades.</span></li><li><b>2</b><span>Separa dominio, aplicación, infraestructura y presentación.</span></li><li><b>3</b><span>Elige patrones por necesidad, no por moda.</span></li><li><b>4</b><span>Construye, prueba, mide y conserva evidencia.</span></li></ol></section>
    <section className="modules" id="modules"><div className="section-head"><div><p className="eyebrow">Ecosistema COBRIA</p><h2>Un manual para cada decisión.</h2></div><span>{cobria.ecosystem.moduleCount} módulos conectados</span></div><div className="module-grid">{modules.map(([n,t,d,h])=><a className="module-card" href={h} key={n}><b>{n}</b><div><h3>{t}</h3><p>{d}</p></div><span aria-hidden="true">→</span></a>)}</div></section>
    <section className="layers" id="layers"><div><p className="eyebrow">Manual de capas</p><h2>Cada pieza sabe qué hacer y qué no debe hacer.</h2></div><div className="layer-stack"><article><b>Presentación</b><span>Traduce HTTP, interfaz o consola.</span></article><article><b>Aplicación</b><span>Coordina un caso de uso.</span></article><article><b>Dominio</b><span>Protege reglas e invariantes.</span></article><article><b>Puertos</b><span>Declara dependencias necesarias.</span></article><article><b>Infraestructura</b><span>Habla con motores y servicios.</span></article></div></section>
    <section className="catalog" id="patterns"><div className="section-head"><div><p className="eyebrow">Pattern Design</p><h2>Patrones contados como situaciones reales.</h2></div><span>Problema · solución · costo · prueba</span></div><div className="cards">{patterns.map(([t,d],i)=><article key={t}><div className="card-top"><b>{String(i+1).padStart(2,"0")}</b><span>Patrón práctico</span></div><h3>{t}</h3><p>{d}</p><a href="/patrones-diseno">Abrir el catálogo <span aria-hidden="true">→</span></a></article>)}</div></section>
    <section className="data-quality" id="data"><article><p className="eyebrow">Bases de datos</p><h2>Modela desde las consultas y las reglas.</h2><p>Aprende cuándo incrustar, referenciar, indexar o proyectar documentos; cómo versionar catálogos y cómo migrar sin perder trazabilidad.</p></article><article id="quality"><p className="eyebrow">Calidad y operación</p><h2>Un sistema terminado también se puede recuperar.</h2><p>Pruebas de contrato, casos negativos, métricas, respaldo, publicación gradual y procedimientos de reconstrucción.</p></article></section>
    <section className="ai" id="ai"><div><p className="eyebrow">IA y analítica responsables</p><h2>La respuesta importa. Su procedencia también.</h2><p>COBRIA separa el documento autoritativo de índices, vectores y conjuntos analíticos. Cada resultado declara origen, versión y ámbito; cuando la evidencia no basta, el sistema se abstiene.</p></div><ul><li>Particiones sin fuga</li><li>Conjuntos reproducibles</li><li>Recuperación autorizada</li><li>Auditoría narrativa</li></ul></section>
    <section className="build" id="build"><div><p className="eyebrow">COBRIA Build</p><h2>Una aplicación que puedes ejecutar y romper.</h2><p>El ejemplo de biodiversidad registra observaciones, evita duplicados, bloquea ámbitos no autorizados y reconstruye un resumen desde documentos canónicos.</p><div className="actions"><a className="primary" href="/construir">Estudiar el código</a><a className="secondary" href="/recursos">Descargar materiales</a></div></div><pre aria-label="Ejemplo de caso de uso"><code>{'const resultado = await registrar.ejecutar({\n  id: "obs-001",\n  ambito: "reserva-sur",\n  especie: "colibri",\n  cantidad: 3,\n  revision: 1\n}, contextoAutorizado);'}</code></pre></section>
    <section className="closing" id="operations"><p className="eyebrow">Una regla de salida</p><h2>Si otra persona no puede comprenderlo, probarlo y recuperarlo, todavía no está terminado.</h2><a className="primary" href="/fundamentos">Abrir los fundamentos</a></section>
    <footer><b>COBRIA</b><span>{cobria.identity.author} · {cobria.identity.place} · {cobria.identity.year}</span><a href="/historia">Historia y autor</a></footer>
  </main>;
}
