# Auditoría técnica y científica asistida de COBRIA

**Fecha de corte:** 20 de septiembre de 2026  
**Repositorio auditado:** `https://github.com/billy-una/cobria.git`  
**Revisión local:** `0c2b74797a134693065163af87422a9f57a46771` con cambios sin confirmar  
**Naturaleza:** auditoría crítica asistida por IA; **no sustituye** la revisión humana independiente P18.

## Estado de remediación posterior

La remediación técnica solicitada se ejecutó después del corte inicial:

- **B-01 cerrado:** el paquete contiene 564 archivos, documenta la instalación limpia y
  superó `make verificar` desde un directorio temporal sin dependencias preinstaladas.
- **B-02 cerrado por decisión del autor:** `LICENSES.md` declara Apache-2.0 para código y
  CC BY 4.0 para textos y datos, con exclusiones explícitas para terceros.
- **B-03 cerrado:** compilación, salida editorial y descarga web poseen huellas idénticas
  para el documento maestro y el artículo.
- **B-04 mitigado, no cerrado editorialmente:** el manifiesto 1.1 registra
  `dirty: true`; ya no atribuye el contenido modificado únicamente al commit anterior.
  La consolidación en un commit y etiqueta firmada debe hacerse tras revisar las
  eliminaciones deliberadamente, sin confirmar cambios ajenos de manera automática.
- Los ocho errores de lint y todas las vulnerabilidades informadas por `npm audit`
  quedaron resueltos; sitio y réplica reportan cero vulnerabilidades conocidas.
- El auditor recorrió 938 archivos sin falsos positivos y el catálogo web ahora está
  versionado.
- El benchmark se regeneró con calentamiento explícito, orden determinista aleatorio y
  fórmula de proxy declarada. El análisis confirmatorio añade IC95, pares, tamaños de
  efecto y ajuste Holm, y falla por defecto cuando faltan motores o celdas.

Permanecen fuera de esta remediación las corridas reales ausentes de CouchDB y
OpenSearch, la réplica externa, la revisión humana y el estudio con participantes. No se
fabricaron resultados para cerrar esas actividades.

## Dictamen ejecutivo

COBRIA posee un núcleo conceptual coherente, contratos ejecutables, separación editorial explícita y una delimitación científica considerablemente más honesta que la habitual en propuestas arquitectónicas. El artículo no presenta los resultados históricos como conformidad vigente y reconoce que faltan réplica externa, transferencia humana y revisión independiente.

El repositorio, sin embargo, **todavía no está listo para una publicación reproducible ni para declararse release estable**. El principal problema ya no es la cantidad de contenido: es la correspondencia entre lo que se promete, lo que se empaqueta, lo que se ejecuta y lo que se publica. Se identifican **cuatro bloqueadores**, seis defectos mayores y varias limitaciones metodológicas.

### Veredicto

- **Valor conceptual:** alto.
- **Madurez de la especificación:** media-alta.
- **Calidad de la evidencia interna:** media, con buena trazabilidad lógica pero evidencia confirmatoria incompleta.
- **Reproducibilidad externa actual:** insuficiente.
- **Preparación editorial:** insuficiente por desincronización de artefactos.
- **Preparación para publicación científica:** condicionada; no recomendable como versión final hasta cerrar B-01 a B-04.

## Fortalezas verificadas

1. La especificación, el artículo, el documento maestro, el libro y el sitio tienen autoridades diferenciadas.
2. El artículo delimita correctamente las 270 corridas históricas y no las presenta como conformidad vigente.
3. Las limitaciones de los experimentos locales están declaradas: proceso único, ausencia de red, costos administrados y medición energética.
4. La fase 18 conserva como pendientes las actividades que una IA no puede fabricar: revisión humana, doble cribado, participantes, réplica externa, licencia, firma y DOI.
5. El artículo ciego declara `Autor anonimizado` en sus metadatos y tiene 11 páginas.
6. Las compilaciones recientes del documento maestro y del artículo concluyeron sin referencias o citas indefinidas detectables en los registros revisados.
7. El conjunto de pruebas interno y los validadores de fases aportan una base útil para convertir COBRIA en una especificación de conformidad.

## Bloqueadores

### B-01 — El paquete de transferencia no reproduce la verificación prometida

**Severidad:** crítica.  
**Evidencia:** `output/release/phase18-transfer/README-TRANSFERENCIA.md` pide ejecutar `make verificar`, pero el paquete omite `specification/phase-2` a `phase-17` y otros insumos requeridos por el `Makefile`. La ejecución falla inmediatamente porque no existe `specification/phase-2/REQUISITOS-ECOSISTEMA.md`.

**Causa:** la lista de fuentes del empaquetador incluye solamente Core 1.0, fase 18, partes de réplica y algunos documentos de revisión.

**Criterio de cierre:** construir el paquete en un directorio vacío, instalar exclusivamente desde sus archivos de bloqueo y ejecutar allí el comando documentado con salida cero. Añadir esa prueba a integración continua.

### B-02 — No existe una licencia pública confirmada

**Severidad:** crítica para distribución.  
**Evidencia:** `replication/LICENSE` y `replication/DATA-LICENSE` aparecen eliminados; el estado P18 conserva `P18-LICENSE` como `pending-human-legal-choice`. El propio paquete indica que no puede redistribuirse como release definitivo.

**Impacto:** las afirmaciones de “libre uso” no tienen soporte jurídico verificable. Código, texto, datos e ilustraciones pueden necesitar licencias diferentes.

**Criterio de cierre:** decisión humana y jurídica; publicar licencias explícitas para código, contenido, datos y medios, acompañadas por inventario de terceros y procedencia de ilustraciones.

### B-03 — Los productos publicados no corresponden a las compilaciones actuales

**Severidad:** crítica editorial.  
**Evidencia:** `make construir-maestro` produce `build/maestro/main.pdf` de 174 páginas, mientras el catálogo editorial anuncia `output/pdf/COBRIA-documento-maestro-ecosistema.pdf`, que tiene 193 páginas y una fecha anterior. Sus huellas SHA-256 son diferentes. El artículo compilado y el artículo publicado también difieren. El `Makefile` no copia los PDF recién compilados a las rutas declaradas en `editorial/products.json`.

**Impacto:** el sitio puede distribuir un documento distinto del que superó la compilación y las revisiones actuales.

**Criterio de cierre:** una sola canalización atómica debe compilar, verificar, copiar con nombre canónico, calcular huella y sincronizar el sitio. El gate debe fallar si la huella de `build/` no coincide con la de `output/pdf/`.

### B-04 — El estado del repositorio no permite una liberación inmutable

**Severidad:** crítica de procedencia.  
**Evidencia:** se observaron 127 archivos nuevos, 66 eliminados y 17 modificados sin confirmar. El manifiesto del paquete registra únicamente el `HEAD` anterior, sin indicar que el árbol estaba sucio.

**Impacto:** el identificador de commit no describe el contenido empaquetado; una tercera persona no puede reconstruir el release desde esa revisión.

**Criterio de cierre:** consolidar deliberadamente los cambios, revisar las eliminaciones, crear un commit limpio y una etiqueta firmada. El generador debe registrar `dirty: true/false` y rechazar releases definitivos desde un árbol sucio.

## Defectos mayores

### M-01 — Calidad y accesibilidad del sitio no pasan el lint

Se detectaron ocho errores: navegación interna con elementos `a` en vez del componente del enrutador, `tabIndex` sobre un elemento no interactivo, variables sin uso y reasignación de funciones. `make verificar-sitio` no ejecuta el lint, por lo que el gate verde no cubre esta dimensión.

**Cierre:** incorporar `npm run lint` al gate y resolver los ocho errores.

### M-02 — Dependencias con vulnerabilidades conocidas

El sitio reportó 23 vulnerabilidades: 16 altas, seis moderadas y una baja. La réplica reportó dos moderadas asociadas a la cadena de PouchDB/UUID. Algunas correcciones propuestas son incompatibles y requieren migración, no un `--force` automático.

**Cierre:** clasificar explotabilidad en producción, actualizar dependencias con pruebas de regresión, generar SBOM y fijar una política de severidad para CI.

### M-03 — El auditor se audita incorrectamente a sí mismo

La auditoría de 933 archivos devolvió nueve hallazgos. Siete corresponden a fixtures deliberadamente inválidos y uno a un ejemplo normativo negativo. Solo `sitio/public/catalogo.json` parece un defecto de producto real. La herramienta no diferencia producto, ejemplo negativo y fixture.

**Impacto:** falsos positivos y una salida global fallida que reduce la confianza en el gate.

**Cierre:** exclusiones declarativas o metadatos de expectativa; los fixtures negativos deben producir el hallazgo esperado sin contaminar la auditoría del producto.

### M-04 — El catálogo del sitio carece de versión documental

`sitio/public/catalogo.json` es un arreglo sin envoltorio de versión, aunque el propio patrón “Catálogo versionado” exige versión.

**Cierre:** publicar un objeto con `schemaVersion`, `catalogVersion`, fecha, procedencia y elementos; adaptar consumidores y esquema JSON.

### M-05 — La repetición confirmatoria distribuida está incompleta

Solo se encontró `replication/results/core-1.3-confirmatory/mongodb/raw.jsonl`, con 80 observaciones. No existe el archivo correspondiente a CouchDB en ese directorio ni un informe confirmatorio allí. El script estadístico espera MongoDB y CouchDB, pero omite silenciosamente los archivos ausentes y aun informa el número de motores “esperados”. OpenSearch sigue pendiente.

**Cierre:** exigir motores y conteos congelados, fallar ante celdas ausentes, emitir un manifiesto por ejecución y separar con claridad resultados preliminares de resultados confirmatorios.

### M-06 — El plan estadístico publicado no está implementado por completo

El artículo anuncia intervalos del 95 %, diferencias y razones pareadas, ajustes por comparaciones múltiples y tamaños de efecto. El script confirmatorio actual calcula p50, p95, p99, media y desviación; no implementa todavía todos esos elementos.

**Cierre:** implementar el plan antes de incorporar cifras confirmatorias al artículo, congelar el código y probarlo con datos sintéticos de resultado conocido.

## Observaciones metodológicas

### S-01 — El benchmark de 630 observaciones es una microcomparación algorítmica

Las siete estrategias se ejecutan en un único proceso JavaScript sobre documentos sintéticos. La implementación mide estructuras distintas y aproximaciones diferentes de escritura, no sistemas equivalentes desplegados. Es adecuada como instrumento pedagógico y gate de regresión, pero no permite concluir superioridad arquitectónica.

### S-02 — Orden fijo, calentamiento no implementado y dependencia entre corridas

Las estrategias se ejecutan siempre en el orden de inserción del objeto y las 30 repeticiones reutilizan el mismo conjunto. El plan declara “una construcción implícita por estrategia”, pero el código no contiene una fase de calentamiento descartada. Esto deja efectos de JIT, caché, recolección y orden como factores de confusión.

**Mejora:** orden aleatorio determinista por semilla, calentamiento explícito no medido, procesos aislados o bloques contrabalanceados y registro de GC disponible.

### S-03 — La métrica `workProxy` combina unidades incompatibles

`cpuMs * 1000 + storageBytes` suma tiempo transformado y bytes. Puede usarse como puntuación convencional si se justifica y normaliza, pero no posee interpretación física directa.

### S-04 — La memoria es demasiado ruidosa para inferencias fuertes

La diferencia de `heapUsed` dentro del mismo proceso depende del recolector y puede truncarse a cero. El plan sí reconoce esta limitación; conviene mantener la métrica como exploratoria.

### S-05 — Falta preinscripción externa verificable del benchmark nuevo

Existen plan y presupuestos versionados en el árbol actual, pero no se verificó una marca temporal externa anterior a los resultados. Por tanto, deben tratarse como criterios de ingeniería hasta contar con un registro inmutable previo.

### S-06 — La validez externa continúa abierta

Los perfiles proceden del mismo autor y ecosistema. No hay todavía prueba de que equipos independientes comprendan e implementen COBRIA sin asistencia. Esta es la amenaza principal y está correctamente reconocida por el artículo.

## Riesgos editoriales y de producto

1. La fuente canónica y la ruta descargable pueden divergir sin que el gate falle.
2. El sitio puede aprobar construcción y pruebas aunque falle lint y accesibilidad estática.
3. Los archivos históricos eliminados deben clasificarse antes de confirmar el cambio: archivo deliberado, reemplazo o pérdida de evidencia.
4. La matriz de trazabilidad es útil, pero sus estados como “cubierta funcional” deben enlazar a resultados inmutables, no solo a nombres de pruebas.
5. El paquete no incluye por ahora firma, DOI ni licencia, lo cual está bien declarado; no debe presentarse como release público.

## Orden de remediación recomendado

1. Congelar el árbol y resolver conscientemente las 66 eliminaciones.
2. Reparar el paquete externo y probarlo desde cero.
3. Unificar construcción, publicación, huellas y descargas.
4. Resolver licencia y procedencia de terceros mediante decisión humana.
5. Añadir lint, auditoría de dependencias, SBOM y estado limpio a CI.
6. Hacer que el auditor comprenda fixtures negativos y versionar el catálogo web.
7. Completar las celdas confirmatorias y hacer que el análisis falle ante ausencias.
8. Implementar íntegramente el plan estadístico anunciado.
9. Repetir con orden aleatorio, calentamiento explícito y entornos distribuidos realistas.
10. Entregar a revisores y participantes externos sin intervención del autor.

## Gates mínimos para declarar una versión publicable

- `git status --porcelain` vacío.
- `make verificar` exitoso en el repositorio y dentro del paquete transferible.
- `npm run lint` y pruebas del sitio exitosas.
- cero vulnerabilidades altas explotables o excepción documentada y aprobada.
- huellas idénticas entre compilados aprobados, productos editoriales y descargas web.
- licencia y procedencia explícitas.
- conjunto confirmatorio completo según protocolo, sin celdas omitidas silenciosamente.
- artículo ciego inspeccionado visualmente y por extracción de texto.
- al menos una réplica externa y una revisión humana independiente registradas.

## Conclusión

COBRIA ya supera la etapa de idea: existe una composición técnica coherente y comprobable. Aun así, su afirmación científica más fuerte no debe ser “COBRIA mejora universalmente el rendimiento”, sino: **COBRIA propone contratos verificables para gobernar autoridad, ámbito, derivación y reconstrucción en sistemas documentales, y ofrece un programa experimental refutable para evaluar sus costos y beneficios**.

La próxima ganancia de calidad no proviene de añadir capítulos, patrones o motores. Proviene de cerrar la cadena completa: requisito → implementación → prueba → resultado inmutable → afirmación editorial → réplica externa. Hasta que esa cadena sea reproducible fuera del entorno del autor, COBRIA debe presentarse como una propuesta madura con evidencia interna prometedora, no como una arquitectura universalmente validada.
