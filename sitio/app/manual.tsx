import Link from "next/link";
import { CopyCode } from "./copy-code";

const content: Record<
  string,
  {
    number: string;
    title: string;
    intro: string;
    outcomes: string[];
    sections: { title: string; text: string; code?: string }[];
  }
> = {
  fundamentos: {
    number: "01",
    title: "Fundamentos",
    intro:
      "Convierte una necesidad en conceptos, reglas y contratos antes de escoger tecnología.",
    outcomes: [
      "Convertir una necesidad en contrato",
      "Distinguir dato, regla, entidad y valor",
      "Diseñar casos correctos y negativos",
    ],
    sections: [
      {
        title: "Empieza por el lenguaje",
        text: "Una entidad conserva identidad a través del tiempo. Un objeto de valor se define por sus atributos. Un servicio coordina una regla que no pertenece a una sola entidad.",
      },
      {
        title: "Contrato mínimo",
        text: "Toda operación declara entrada, precondiciones, resultado, errores y evidencia.",
        code: "registrar(entrada, contexto)\n  exige identidad, ámbito y permiso\n  valida reglas del dominio\n  conserva revisión y evidencia",
      },
      {
        title: "Ejemplo: observaciones comunitarias",
        text: "Una persona autorizada registra especie, cantidad, zona y fecha. La cantidad positiva es una regla; la especie y la fecha son datos; la observación conserva identidad; el caso de uso coordina autorización y persistencia.",
      },
      {
        title: "Pruebe antes de optimizar",
        text: "Compruebe una entrada válida, una cantidad inválida, el rechazo de otro ámbito, la repetición idempotente y el conflicto de contenido. Empiece con memoria antes de elegir un proveedor.",
        code: "feliz → revisión 1\nregla → OBS_QUANTITY_INVALID\námbito ajeno → ACCESS_DENIED\nrepetición → un solo documento",
      },
      {
        title: "Criterio de avance",
        text: "Otra persona puede leer el contrato, ejecutar las pruebas y explicar dónde vive cada regla sin consultar al autor. Después continúe con Layers, Data o Pattern Design según su problema.",
      },
    ],
  },
  capas: {
    number: "02",
    title: "Manual de capas",
    intro:
      "Separa responsabilidades para cambiar una interfaz o un motor sin reescribir el negocio.",
    outcomes: [
      "Reconocer cinco capas",
      "Separar once responsabilidades",
      "Auditar dependencias y legado",
    ],
    sections: [
      {
        title: "Cinco responsabilidades",
        text: "Presentación traduce la interacción; aplicación coordina casos de uso; dominio protege reglas; puertos declaran capacidades; infraestructura conecta bases y servicios.",
      },
      {
        title: "Composición",
        text: "Las dependencias se conectan en un único punto. El dominio no importa SDK, HTTP ni componentes visuales.",
        code: "const app = crearAplicacion({\n  repositorio: new RepositorioMongo(),\n  reloj: new RelojSistema(),\n  autorizar\n});",
      },
      {
        title: "Object, Dater, Repository y UseCase",
        text: "Object protege identidad e invariantes; Dater traduce la forma lógica y física; Repository accede por identidad y ámbito; UseCase completa una intención. Dater es un término propio de COBRIA, equivalente a responsabilidades de Data Mapper y serialización.",
      },
      {
        title: "Catalog, Indexer y Connector",
        text: "Catalog gobierna significado y versión; Indexer construye un derivado sin autoridad; Connector oculta red, SDK y fallos técnicos. Separarlos permite cambiar vocabulario, lectura y proveedor por razones distintas.",
        code: "dominio ← aplicación\n   ↑          ↑\ninfraestructura\n\nDater ≠ Repository ≠ Connector\nIndexer ≠ autoridad",
      },
      {
        title: "Migración sin reescritura total",
        text: "Congele el crecimiento legado, seleccione un flujo, escriba una prueba de caracterización, extraiga regla y puerto, conecte el adaptador y retire la fachada cuando quede sin consumidores.",
      },
    ],
  },
  patrones: {
    number: "03",
    title: "Pattern Design",
    intro:
      "Usa patrones como respuestas a tensiones reales, con costos, fallos y pruebas.",
    outcomes: [
      "Elegir por problema",
      "Explicar consecuencias",
      "Probar rechazos",
    ],
    sections: [
      {
        title: "Ficha de patrón",
        text: "Cada ficha contiene propósito, contexto, problema, fuerzas, solución, participantes, consecuencias, implementación, pruebas y relaciones.",
      },
      {
        title: "Repositorio con ámbito",
        text: "El ámbito no es un filtro opcional. Forma parte de la identidad y de toda lectura, escritura, caché y reconstrucción.",
        code: "const documento = await repositorio.obtener({\n  ambito: contexto.ambito,\n  id: solicitud.id\n});",
      },
    ],
  },
  datos: {
    number: "04",
    title: "Bases de datos",
    intro:
      "Diseña documentos, índices, catálogos y migraciones desde consultas, invariantes y ciclos de vida.",
    outcomes: [
      "Incrustar o referenciar",
      "Diseñar índices",
      "Versionar documentos",
    ],
    sections: [
      {
        title: "Documento antes que colección",
        text: "Agrupa datos que se leen, cambian y eliminan juntos. Referencia entidades con identidad propia. Proyecta solo cuando una lectura medida necesita otra forma.",
      },
      {
        title: "Evolución segura",
        text: "Cada documento declara versión. Los lectores aceptan un intervalo explícito y las migraciones son deterministas e idempotentes.",
        code: '{\n  "id": "obs-001",\n  "ambito": "reserva-sur",\n  "revision": 4,\n  "versionEsquema": 2\n}',
      },
    ],
  },
  apiux: {
    number: "05",
    title: "API & UX",
    intro:
      "Diseña contratos y experiencias que personas, clientes y agentes puedan comprender, reintentar, localizar y usar de forma accesible.",
    outcomes: [
      "Versionar operaciones y eventos",
      "Representar ocho estados de interfaz",
      "Verificar accesibilidad e i18n",
    ],
    sections: [
      {
        title: "Contrato de extremo a extremo",
        text: "Cada operación declara identidad, capacidad, ámbito, entrada, salida, errores, idempotencia, timeout, reintento, compatibilidad y telemetría permitida.",
        code: "POST /v1/ambitos/{ambito}/observaciones\nIdempotency-Key: op-42\n→ 201 o application/problem+json",
      },
      {
        title: "Problemas estables",
        text: "El código gobierna automatización y el detalle se localiza. La respuesta no expone stack, secretos, consultas ni existencia de recursos fuera del ámbito.",
        code: '{ "status": 403, "code": "ACCESS_DENIED",\n  "traceId": "traza-42" }',
      },
      {
        title: "Ocho estados de interfaz",
        text: "Inicial, carga, vacío, éxito, error recuperable, error definitivo, sin permiso y desconectado. Ningún estado depende solo del color.",
      },
      {
        title: "Accesibilidad verificable",
        text: "Los controles automáticos cubren semántica, foco y adaptación; teclado, lectores de pantalla, zoom, reflujo y comprensión continúan requiriendo comprobación humana.",
      },
    ],
  },
  seguridad: {
    number: "06",
    title: "Security",
    intro:
      "Integra identidad, capacidades, ámbito, privacidad, secretos y respuesta a incidentes en cada flujo.",
    outcomes: [
      "Modelar amenazas y fronteras",
      "Aplicar mínimo privilegio",
      "Probar rechazo y recuperación",
    ],
    sections: [
      {
        title: "Autorizar antes de acceder",
        text: "El servidor deriva identidad y capacidades, valida ámbito y finalidad, y falla cerrado antes de leer, consultar caché o revelar existencia.",
        code: "actor → capacidad → ámbito → finalidad\n→ validar → ejecutar → auditar",
      },
      {
        title: "Secretos y Functions",
        text: "Los secretos viven en un gestor o identidad de carga. Una Function pública limita tamaño, tiempo, frecuencia y costo; usa idempotencia y dependencias mínimas.",
      },
      {
        title: "Privacidad y suministro",
        text: "Cada atributo declara finalidad y retención. Lockfile, SBOM, procedencia y revisión de dependencias acompañan al artefacto promovido.",
      },
      {
        title: "Incidentes",
        text: "Detectar, preservar, contener, erradicar, recuperar, comunicar y aprender. Nunca se elimina evidencia para aparentar cierre.",
      },
    ],
  },
  calidad: {
    number: "07",
    title: "Calidad y rendimiento",
    intro:
      "Demuestra corrección y optimiza mediante evidencia, presupuestos y comparaciones explícitas contra alternativas más simples.",
    outcomes: [
      "Relacionar cambios y pruebas",
      "Interpretar p50, p95 y p99",
      "Decidir por costo total",
    ],
    sections: [
      {
        title: "Pruebas según el riesgo",
        text: "Las unitarias protegen reglas; las de contrato validan adaptadores; integración y E2E conectan flujos; seguridad, concurrencia, migración, resiliencia y accesibilidad atacan riesgos concretos.",
        code: "cambio de esquema\n→ unidad + migración + contrato + rollback",
      },
      {
        title: "Medición reproducible",
        text: "Congele datos, semilla, entorno, calentamiento, orden y alternativas. Publique cada observación junto con p50, p95, p99, dispersión e intervalos cuando el diseño los permita.",
        code: "30 corridas × 3 tamaños × 7 alternativas\n= 630 observaciones conservadas",
      },
      {
        title: "Costo total",
        text: "Una lectura más rápida puede aumentar escritura, almacenamiento, memoria, reconstrucción y mantenimiento. Compare primero documento único, índice nativo y otras opciones más sencillas.",
      },
      {
        title: "Definición de terminado",
        text: "Una capacidad está terminada cuando sus requisitos, pruebas, límites, observabilidad, recuperación y documentación coinciden; pasar una prueba aislada no basta.",
        code: "make verificar-cierre-8-9",
      },
    ],
  },
  operaciones: {
    number: "08",
    title: "Nube y operaciones",
    intro:
      "Lleva el mismo artefacto desde local hasta producción y prepara observación, degradación, recuperación y retiro sin improvisar.",
    outcomes: [
      "Separar ambientes y datos",
      "Promover sin recompilar",
      "Observar y recuperar",
    ],
    sections: [
      {
        title: "Ambientes realmente aislados",
        text: "Local, test, preview, staging, producción y recuperación poseen cuentas, identidades y políticas de datos separadas. Staging no usa copias personales de producción.",
        code: "local → test → preview → staging → producción\n                              ↘ recuperación",
      },
      {
        title: "Promoción y reversión",
        text: "Se construye una vez, se identifica por huella y se promueve el mismo artefacto. Cada cambio declara plan de humo, migración, compatibilidad y artefacto anterior.",
        code: "construir → verificar → promover huella\n→ humo → observar → continuar o revertir",
      },
      {
        title: "Functions, colas y tareas",
        text: "Cada desplegable fija región, memoria, timeout, concurrencia, idempotencia, reintentos, dead-letter, secretos, permisos, métricas, costo y responsable.",
      },
      {
        title: "SLO y recuperación",
        text: "Indicadores y alertas enlazan responsables y runbooks. Los objetivos publicados son propuestas hasta validarse con tráfico real; respaldo solo cuenta cuando la restauración se ensaya.",
      },
    ],
  },
  ia: {
    number: "09",
    title: "Analítica e inteligencia artificial",
    intro:
      "Construye conjuntos, características, modelos y recuperación que conserven consentimiento, ámbito, tiempo, versión y procedencia.",
    outcomes: [
      "Evitar fugas",
      "Reproducir conjuntos",
      "Abstenerse con evidencia",
    ],
    sections: [
      {
        title: "Analítica reproducible",
        text: "Una partición se define por entidad y tiempo antes de calcular rasgos. El manifiesto conserva finalidad, consentimiento, tiempos válido y conocido, fuentes, exclusiones, transformación, semilla y huella.",
        code: "fuentes → consentimiento → corte temporal\n→ partición por entidad → transformación versionada → huella",
      },
      {
        title: "RAG autorizado",
        text: "Identidad, capacidad y ámbito se comprueban antes de similitud. Cada cita conserva identidad y revisión; una respuesta sin evidencia suficiente se abstiene.",
        code: "autorizar → filtrar ámbito → recuperar\n→ verificar citas → responder o abstenerse",
      },
      {
        title: "Modelos, herramientas y deriva",
        text: "Cada versión registra propósito, datos, evaluación, umbrales, responsable y rollback. Una alerta de deriva o retroalimentación no reentrena ni escribe automáticamente.",
      },
      {
        title: "Evidencia acotada",
        text: "Treinta repeticiones léxicas conservaron reproducibilidad, cero fugas de ámbito y abstención apropiada. No demuestran calidad generativa, ausencia de sesgo ni utilidad humana.",
        code: "30 repeticiones · 0 fugas de ámbito\n30 abstenciones · recuperación léxica",
      },
    ],
  },
  construir: {
    number: "10",
    title: "COBRIA Build",
    intro:
      "Recorre una aplicación neutral desde la necesidad hasta datos, API, seguridad, operación, analítica e IA.",
    outcomes: [
      "Completar catorce hitos",
      "Relacionar código y pruebas",
      "Distinguir evidencia y límites",
    ],
    sections: [
      {
        title: "Caso: biodiversidad",
        text: "Una observación canónica conserva identidad, ámbito, especie, cantidad, revisión y fecha. El adaptador puede cambiar sin modificar el caso de uso.",
      },
      {
        title: "De la regla a la frontera",
        text: "Dominio, puerto, Dater, adaptadores y composición mantienen las dependencias hacia adentro. Seguridad, idempotencia, revisión, RFC 9457 y cursores completan la operación.",
        code: "necesidad → dominio → caso de uso → puerto\n→ adaptador → controlador → composición",
      },
      {
        title: "Derivados, analítica e IA",
        text: "La misma aplicación reconstruye un resumen, produce un conjunto sin fuga, recupera solo evidencia autorizada y se abstiene sin convertir IA en autoridad.",
      },
      {
        title: "Guía ejecutable",
        text: "HITOS.json enlaza catorce pasos con archivos y pruebas. La guía propone cambios deliberados, casos negativos y ejercicios de extensión.",
        code: "cd replication/examples/ecosistema-app\nnpm test\n# 23 pruebas esperadas",
      },
    ],
  },
  toolkit: {
    number: "11",
    title: "Herramientas para personas e IA",
    intro:
      "Valida, explica, genera, audita e informa sin convertir automatización en autoridad o certificación.",
    outcomes: [
      "Generar sin sobrescribir",
      "Producir HTML y JSON",
      "Simular sin desplegar",
    ],
    sections: [
      {
        title: "CLI comprensible",
        text: "Los comandos usan códigos estables, mensajes en español y salida JSON para CI. iniciar, validar, explicar, contexto, impacto, auditar, medir, generar y verificar cubren el ciclo local.",
        code: "cobria validar --json\ncobria explicar --id NODE-OBS-CANONICAL",
      },
      {
        title: "Generación conservadora",
        text: "La misma entrada produce los mismos bytes. Un archivo divergente detiene toda la operación y los nombres que escapan rutas son rechazados.",
      },
      {
        title: "Informes duales",
        text: "informar produce HTML para lectura y JSON para automatización. Ambos declaran alcance local y límites.",
        code: "cobria informar --salida ./informe --json",
      },
      {
        title: "Publicación solo simulada",
        text: "Sin --simular, Toolkit rechaza publicar. La simulación valida ambiente y huella, enumera gates y realiza cero mutaciones.",
        code: "cobria publicar --simular --ambiente staging \\\n  --artefacto sha256:<64-hex> --json",
      },
    ],
  },
  engineering: {
    number: "12",
    title: "COBRIA Engineering",
    intro:
      "Convierte una arquitectura comprensible en software operable, recuperable y mantenible.",
    outcomes: [
      "Controlar operaciones críticas",
      "Promover el mismo artefacto",
      "Medir y retirar complejidad",
    ],
    sections: [
      {
        title: "Una operación completa",
        text: "La interfaz representa sus estados; una frontera confiable deriva actor, capacidad y ámbito, valida, aplica idempotencia, conserva auditoría y publica derivados recuperables.",
        code: "intención → validar → autorizar → idempotencia\n→ aplicar autoridad → outbox → auditar → responder",
      },
      {
        title: "Optimizar con presupuesto",
        text: "Mide primero, encuentra la causa, aplica el cambio más pequeño y repite la misma carga. Conserva beneficio, regresiones, costo y condición de retiro.",
        code: "medir → causa raíz → cambio mínimo\n→ verificar → documentar → conservar o retirar",
      },
      {
        title: "Entregar sin sorpresas",
        text: "Preview, staging y producción reciben el mismo digest. Cada promoción conserva pruebas, respaldo, aprobación, humo y rollback.",
        code: "commit → artefacto → preview → staging\n→ aprobación → producción → humo",
      },
      {
        title: "Laboratorio ejecutable",
        text: "Nueve pruebas neutrales ejercitan los ocho contratos Engineering sin depender de nube, navegador ni datos reales. La ejecución local enseña el mecanismo, pero no simula producción.",
        code: "make verificar-fase-20\n# 9 pruebas · 8 contratos · 0 dependencias externas",
      },
      {
        title: "Piloto de adopción",
        text: "POS Guápiles aportó evidencia estructural reproducible para 8 de 8 contratos. El piloto reporta 0 como validación operacional porque no ejecutó producción, rollback real ni evaluación humana.",
        code: "make verificar-fase-21\n# 8/8 estructurales · 0 operacionales",
      },
      {
        title: "Manifiesto de adopción",
        text: "Cada proyecto declara commit, responsables, rutas y términos. El motor lee objetos Git, rechaza rutas inseguras y no ejecuta el código evaluado.",
        code: "cobria engineering evaluar \\\n  --manifiesto adoption-manifest.json \\\n  --proyecto ./mi-proyecto",
      },
      {
        title: "Tres proyectos, una misma rúbrica",
        text: "El motor inspeccionó commits congelados de tres sistemas distintos. Encontró evidencia estructural para 8/8, 5/8 y 4/8 contratos; las brechas requieren revisión humana y no califican la calidad del proyecto.",
        code: "make verificar-fase-23\n# 3 proyectos · 8 contratos\n# 0 validaciones operacionales",
      },
      {
        title: "Revisión semántica preparada",
        text: "Tres muestras seudónimas permiten que dos personas independientes clasifiquen cada contrato como respaldado, no respaldado o insuficiente. El paquete conserva desacuerdos y exige atestación humana.",
        code: "make preparar-revision-fase-24\nmake verificar-fase-24\n# estado oficial: 0/6 respuestas humanas",
      },
      {
        title: "Tres dimensiones, no una palabra",
        text: "ENG-007 solo queda respaldado estructuralmente cuando aparecen una frontera legacy, un control verificable contra crecimiento y una ruta de retiro. La calibración produjo 3/3, 2/3 y 3/3 en los tres casos.",
        code: "make verificar-fase-25\n# propuesta estructural · no certificación oficial",
      },
      {
        title: "Veinticuatro dimensiones",
        text: "Los ocho contratos Engineering se dividen en tres criterios conjuntivos. La plantilla nace sin decisiones: obliga a aportar evidencia y evita convertir ausencia de evaluación en incumplimiento.",
        code: "make verificar-fase-26\n# 8 contratos · 24 dimensiones · 0 decisiones precargadas",
      },
      {
        title: "Expediente dimensional comparativo",
        text: "La evidencia candidata de tres commits se cruza con las 24 dimensiones. Las 72 celdas permanecen pendientes de lectura semántica: sirven como cola revisable, no como ranking ni certificación.",
        code: "make verificar-fase-27\n# 3 proyectos · 72 decisiones pendientes\n# 0 certificaciones · 0 validaciones operacionales",
      },
      {
        title: "Revisión dimensional ciega",
        text: "Dos personas reciben las mismas tres muestras sin la clave de identidad. Cada una debe justificar 72 decisiones y declarar independencia; el paquete nace vacío y no simula participación humana.",
        code: "make preparar-revision-fase-28\nmake verificar-fase-28\n# 144 juicios esperados · 0 recibidos",
      },
      {
        title: "Acuerdo solo después de recibir",
        text: "La ingesta conserva los formularios originales y calcula acuerdo observado y kappa únicamente con dos respuestas humanas completas, distintas y sin conflicto. Sin ellas, todas las métricas permanecen nulas.",
        code: "make procesar-respuestas-fase-29\nmake verificar-fase-29\n# propuesta independiente · acuerdo todavía no calculado",
      },
      {
        title: "Adjudicar sin borrar el desacuerdo",
        text: "Una tercera persona puede resolver únicamente las dimensiones donde dos revisores discrepan. Ambas decisiones originales permanecen intactas y, sin un par humano previo, la adjudicación continúa vacía.",
        code: "make procesar-adjudicacion-fase-30\nmake verificar-fase-30\n# 0 desacuerdos disponibles · 0 adjudicaciones",
      },
      {
        title: "Validación operacional controlada",
        text: "Cinco escenarios preparan rollback, reintentos, telemetría, reconstrucción y aislamiento. La plantilla exige ambiente autorizado y evidencia con huellas; actualmente no afirma ninguna ejecución real.",
        code: "make generar-plantilla-fase-31\nmake verificar-fase-31\n# 5 escenarios preparados · 0 ejecutados",
      },
      {
        title: "Del paquete externo a la publicación responsable",
        text: "Las fases 32 a 36 preparan réplica independiente, síntesis condicionada, sincronización editorial, candidato reproducible y publicación. Los resultados humanos, la firma y el DOI permanecen pendientes.",
        code: "make verificar-fase-32 verificar-fase-33 verificar-fase-34\nmake verificar-fase-35 verificar-fase-36\n# propuesta preparada · no publicada",
      },
    ],
  },
};

export function ManualPage({ kind }: { kind: keyof typeof content }) {
  const page = content[kind];
  const hrefs: Record<string, string> = { patrones: "/patrones-diseno", apiux: "/api-ux", seguridad: "/seguridad", toolkit: "/herramientas" };
  return (
    <main className="manual-page" id="contenido">
      <header className="nav">
        <Link className="brand" href="/">
          COBRIA <span>guía de software</span>
        </Link>
        <nav aria-label="Navegación principal">
          <Link href="/">Inicio</Link>
          <a href="/patrones-diseno">Catálogo</a>
          <a href="/recursos">Recursos</a>
        </nav>
      </header>
      <div className="manual-shell">
        <aside aria-label="Índice del manual">
          <b>{page.number}</b>
          <p>Manual COBRIA</p>
          <nav aria-label="Módulos COBRIA">
            {Object.entries(content).map(([slug, item]) => (
              <a
                href={hrefs[slug] ?? `/${slug}`}
                aria-current={slug === kind ? "page" : undefined}
                key={slug}
              >
                {item.number} · {item.title}
              </a>
            ))}
          </nav>
        </aside>
        <article>
          <p className="eyebrow">Ruta de aprendizaje</p>
          <h1>{page.title}</h1>
          <p className="manual-intro">{page.intro}</p>
          <div className="outcomes" aria-label="Resultados de aprendizaje">
            {page.outcomes.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          {page.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
              {section.code && <CopyCode code={section.code} />}
            </section>
          ))}
          <div className="manual-next">
            <b>Práctica sugerida</b>
            <p>
              Aplica esta decisión a un flujo pequeño, escribe primero el caso
              negativo y conserva evidencia para revisarlo.
            </p>
          </div>
        </article>
      </div>
      <footer>
        <b>COBRIA</b>
        <span>Billy Jak Cordero Porras · Coto Brus, Costa Rica</span>
        <a href="/recursos">Documentos</a>
      </footer>
    </main>
  );
}
