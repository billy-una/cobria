# Auditoría de cobertura y brechas de COBRIA C0

Fecha: 2026-10-17. Línea base Git: `deca1b14ff44805d5d36814654cf35be27d2fa89`.

COBRIA posee fuentes para sus 17 áreas, pero la estructura del material no acredita un manual completo para principiantes. C0 congela el alcance de C1 a C15 y registra las brechas; no cierra esas fases ni modifica Core 1.0 o RC2.

## Alcance y método

Inventario de las 85 lecciones, 30 laboratorios, fuentes declaradas y anclajes del libro y sitio.

Lectura completa de la primera lección de cada módulo; revisión transversal de títulos, fragmentos y evidencias de las 85; lectura dirigida de manuales, CLI, composición y pruebas.

- No se leyó visualmente cada página PDF ni se auditó el despliegue público.
- Presencia de una fuente o prueba no prueba profundidad, eficacia educativa ni cobertura de cada lección.
- Los comandos se clasifican estáticamente; los ensayos acotados registrados no ejecutan todos los laboratorios.

La revisión es asistida por IA, no independiente. Cero validaciones de lectores establecidas por C0 no significa que ninguna persona haya leído material anterior: falta vincular resultados de tareas con estas áreas y esta edición.

## Matriz de las 17 áreas

E: explicación presente, con revisión muestral. I: ejemplo ilustrativo presente. P: ejecución o pruebas parciales por módulo, no por lección. L: anclajes en HTML local. W: fuente y rutas locales; no despliegue. NV: comprensión de lectores no verificada. Ninguna marca significa completitud.

| Área | Explicado | Ejemplo | Ejecutable | Pruebas | Libro | Web | Lectores | Siguiente fase |
|---|---|---|---|---|---|---|---|---|
| 01 Primeros pasos | E | I | P | P | L | W | NV | C1 |
| 02 Fundamentos de software | E | I | P | P | L | W | NV | C1 |
| 03 Arquitectura de software | E | I | P | P | L | W | NV | C3 |
| 04 Capas, carpetas y responsabilidades | E | I | P | P | L | W | NV | C3 |
| 05 Código, nombres y comentarios | E | I | P | P | L | W | NV | C9 |
| 06 Bases de datos y diccionario de datos | E | I | P | P | L | W | NV | C2 |
| 07 COBRIA Core | E | I | P | P | L | W | NV | C4 |
| 08 Patrones de diseño | E | I | P | P | L | W | NV | C4 |
| 09 API, experiencia e internacionalización | E | I | P | P | L | W | NV | C5 |
| 10 Documentación y comunicación | E | I | P | P | L | W | NV | C9 |
| 11 Seguridad y privacidad | E | I | P | P | L | W | NV | C5 |
| 12 Calidad, pruebas y rendimiento | E | I | P | P | L | W | NV | C6 |
| 13 Nube, ambientes y operaciones | E | I | P | P | L | W | NV | C6 |
| 14 Analítica e inteligencia artificial | E | I | P | P | L | W | NV | C7 |
| 15 Aplicación completa | E | I | P | P | L | W | NV | C8 |
| 16 Herramientas para personas e IA | E | I | P | P | L | W | NV | C9 |
| 17 Evidencia, evolución y publicación | E | I | P | P | L | W | NV | C11 |

## Resultados estructurales

17 áreas, 85 lecciones, 30 laboratorios y 12 prácticas. Hay 11 comandos npm de laboratorio sin directorio declarado. Las cifras describen estructura, no porcentaje de calidad.

Los campos de ejecución y enlace de pruebas por lección se registran explícitamente, no se infieren del texto «Cómo comprobarlo». El JSON distingue esas ausencias de las pruebas existentes a nivel de proyecto.

Las seis sondas ejecutadas están en `probes.json`. La sonda crítica creó cuatro archivos sintéticos únicamente en un directorio temporal. Las sondas no son un experimento científico ni una revisión independiente.

## Brechas que bloquean el cierre

### C0-01 La simulación de generación puede escribir

Severidad: critica. Fase responsable: C9.

No recomendar generar --simular hasta que rechace la opción o implemente un plan sin escrituras.

- [replication/src/cli.mjs:48](../../replication/src/cli.mjs): `await generate({type:options.type`
- [editorial/curriculum.json:1591](../../editorial/curriculum.json): `cobria generar --simular`

### C0-02 La regla de cantidad y la API de la entidad se contradicen

Severidad: alta. Fase responsable: C1.

Unificar el contrato, la forma de construcción y las pruebas antes de ampliar el tutorial.

- [replication/examples/ecosistema-app/src/domain/observacion.mjs:8](../../replication/examples/ecosistema-app/src/domain/observacion.mjs): `cantidad < 1`
- [editorial/curriculum.json:145](../../editorial/curriculum.json): `Observacion.crear`
- [editorial/curriculum.json:190](../../editorial/curriculum.json): `cantidad < 0`

### C0-03 Hay metas Make enseñadas que no existen

Severidad: alta. Fase responsable: C1.

Sustituir por comandos existentes y probarlos desde un directorio declarado.

- [editorial/labs.json:18](../../editorial/labs.json): `make verificar-ejemplos-patrones`
- [editorial/curriculum.json:1706](../../editorial/curriculum.json): `make paquete-candidato`
- [Makefile:124](../../Makefile): `verificar-r4:`

### C0-04 Los laboratorios no declaran siempre el directorio de ejecución

Severidad: alta. Fase responsable: C1.

Añadir cwd, prerrequisitos, salida esperada y una comprobación de que se ejecutó al menos una prueba pertinente.

- [editorial/labs.json:4](../../editorial/labs.json): `npm test -- --test-name-pattern`
- [replication/examples/ecosistema-app/package.json:8](../../replication/examples/ecosistema-app/package.json): `"test": "node --test"`

### C0-05 Seleccionar MongoDB por variable no cambia la aplicación

Severidad: alta. Fase responsable: C8.

Implementar composición configurable y una integración explícita con motor real sin confundirla con dobles.

- [editorial/curriculum.json:1490](../../editorial/curriculum.json): `COBRIA_ADAPTER=mongodb npm test`
- [replication/examples/ecosistema-app/src/composition.mjs:14](../../replication/examples/ecosistema-app/src/composition.mjs): `new RepositorioMemoria()`
- [replication/examples/ecosistema-app/test/app.test.mjs:158](../../replication/examples/ecosistema-app/test/app.test.mjs): `falsoFetch`

### C0-06 La documentación usa opciones CLI no implementadas

Severidad: alta. Fase responsable: C9.

Verificar cada ejemplo contra la ayuda y el comportamiento de la CLI; no agregar flags ficticios.

- [editorial/curriculum.json:1591](../../editorial/curriculum.json): `--comprobar`
- [editorial/curriculum.json:1545](../../editorial/curriculum.json): `--cambio cambio.json`
- [replication/src/cli.mjs:37](../../replication/src/cli.mjs): `CLI_OPTION_UNKNOWN`

### C0-07 Dos fuentes JSON declaradas no existen

Severidad: alta. Fase responsable: C2.

Enlazar el diccionario YAML y la fuente real de convenciones de código; validar existencia de todas las fuentes.

- [editorial/curriculum.json:607](../../editorial/curriculum.json): `specification/phase-3/data-dictionary.json`
- [specification/phase-3/data-dictionary.yaml:1](../../specification/phase-3/data-dictionary.yaml)
- [editorial/curriculum.json:506](../../editorial/curriculum.json): `specification/phase-6/code-conventions.json`
- [specification/phase-6/documentation.yaml:1](../../specification/phase-6/documentation.yaml)

### C0-08 Un manual conserva un estado confirmatorio anterior

Severidad: alta. Fase responsable: C11.

Sincronizar estados con R7 sin convertir su evidencia interna en réplica externa.

- [manuales/22-evidence-transfer.md:46](../../manuales/22-evidence-transfer.md): `faltan corridas de MongoDB`
- [ROADMAP-REMEDIACION-PUBLICA-1.0.md:254](../../ROADMAP-REMEDIACION-PUBLICA-1.0.md): `90 observaciones válidas cada uno`

### C0-09 La palabra estable en manuales puede confundirse con una edición cerrada

Severidad: media. Fase responsable: C10.

Distinguir madurez del texto, candidata editorial y estado publicado.

- [manuales/01-fundamentos.md:4](../../manuales/01-fundamentos.md): `Estado:** estable`
- [editorial/canonical.json:17](../../editorial/canonical.json): `candidate-non-stable`

### C0-10 La estructura uniforme no acredita aprendizaje ni ejecución por lección

Severidad: alta. Fase responsable: C13.

Añadir trazabilidad por lección y validación de tareas con lectores; no utilizar conteos como porcentaje de calidad.

- [editorial/ARQUITECTURA-PEDAGOGICA.md:54](../../editorial/ARQUITECTURA-PEDAGOGICA.md): `Criterio de completitud`
- [sitio/app/aprender/[modulo]/[leccion]/page.tsx:36](../../sitio/app/aprender/[modulo]/[leccion]/page.tsx): `Fuentes del módulo`

## Criterio pendiente por área

### 01 Primeros pasos

Hay un recorrido mínimo en memoria, pero la lección de instalación no explica Node, terminal, ubicación ni salida paso a paso.

Para cerrar: Entorno desde cero con directorio, versiones, resultado y solución de fallos.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [MANIFESTO.md](../../MANIFESTO.md)
- Fuente presente: [replication/examples/ecosistema-app/README.md](../../replication/examples/ecosistema-app/README.md)
- Fuente presente: [replication/examples/ecosistema-app/src/demo.mjs](../../replication/examples/ecosistema-app/src/demo.mjs)
- Fuente presente: [replication/examples/ecosistema-app/test/app.test.mjs](../../replication/examples/ecosistema-app/test/app.test.mjs)

### 02 Fundamentos de software

La entidad usa constructor y exige cantidad positiva; las lecciones enseñan Observacion.crear y cantidad no negativa.

Para cerrar: Contrato único entre explicación, API real, cantidad cero y pruebas de aceptación.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/01-fundamentos.md](../../manuales/01-fundamentos.md)
- Fuente presente: [replication/examples/ecosistema-app/src/domain/observacion.mjs](../../replication/examples/ecosistema-app/src/domain/observacion.mjs)
- Fuente presente: [replication/examples/ecosistema-app/test/app.test.mjs](../../replication/examples/ecosistema-app/test/app.test.mjs)

### 03 Arquitectura de software

Existen fronteras y ADR, pero los fragmentos de aptitud no son un tutorial ejecutable de evolución.

Para cerrar: Un caso pequeño antes y después, decisiones, dependencias y prueba que falla al romperlas.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [specification/MAPA-ECOSISTEMA.md](../../specification/MAPA-ECOSISTEMA.md)
- Fuente presente: [manuales/11-estado-y-roadmap-integral.md](../../manuales/11-estado-y-roadmap-integral.md)
- Fuente presente: [manuales/24-organizacion-y-operacion-del-proyecto.md](../../manuales/24-organizacion-y-operacion-del-proyecto.md)
- Fuente presente: [replication/src/auditor.mjs](../../replication/src/auditor.mjs)
- Fuente presente: [replication/tests/phase14-auditor.test.mjs](../../replication/tests/phase14-auditor.test.mjs)

### 04 Capas, carpetas y responsabilidades

Object, Dater, Repository, Catalog e Indexer están descritos; no se demuestra cada rol en un recorrido incremental único.

Para cerrar: Mapa archivo a responsabilidad y cambio real de adaptador, sin mezclar significado con almacenamiento.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/02-layers.md](../../manuales/02-layers.md)
- Fuente presente: [replication/examples/ecosistema-app/src/composition.mjs](../../replication/examples/ecosistema-app/src/composition.mjs)
- Fuente presente: [manuales/24-organizacion-y-operacion-del-proyecto.md](../../manuales/24-organizacion-y-operacion-del-proyecto.md)
- Fuente presente: [replication/examples/ecosistema-app/test/app.test.mjs](../../replication/examples/ecosistema-app/test/app.test.mjs)

### 05 Código, nombres y comentarios

Hay ejemplos de nombres y comentarios, pero las firmas y comandos ilustrativos no siempre corresponden al proyecto.

Para cerrar: Contratos reales, errores con firma correcta, formato y ejercicios de refactorización comprobados.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente ausente: `specification/phase-6/code-conventions.json`
- Fuente presente: [replication/examples/ecosistema-app/src/domain/error-cobria.mjs](../../replication/examples/ecosistema-app/src/domain/error-cobria.mjs)
- Fuente presente: [replication/examples/ecosistema-app/test/app.test.mjs](../../replication/examples/ecosistema-app/test/app.test.mjs)

### 06 Bases de datos y diccionario de datos

Existe diccionario YAML y Dater; el currículo enlaza un data-dictionary.json inexistente y simplifica la cantidad a >=0.

Para cerrar: Diccionario gradual consistente, nodos, catálogos, claves físicas, consultas y migración con ejemplos válidos e inválidos.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/04-bases-de-datos.md](../../manuales/04-bases-de-datos.md)
- Fuente ausente: `specification/phase-3/data-dictionary.json`
- Fuente presente: [manuales/24-organizacion-y-operacion-del-proyecto.md](../../manuales/24-organizacion-y-operacion-del-proyecto.md)
- Fuente presente: [replication/examples/ecosistema-app/src/infrastructure/data/observacion-dater.mjs](../../replication/examples/ecosistema-app/src/infrastructure/data/observacion-dater.mjs)
- Fuente presente: [replication/examples/ecosistema-app/test/app.test.mjs](../../replication/examples/ecosistema-app/test/app.test.mjs)

### 07 COBRIA Core

El núcleo y el arnés tienen evidencia técnica; los ejemplos del alumno todavía necesitan comandos completos y separación de perfiles.

Para cerrar: Adaptador mínimo explicado, informe interpretado y fallo por cada obligación relevante sin modificar Core 1.0.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [specification/COBRIA-CORE-1.0.md](../../specification/COBRIA-CORE-1.0.md)
- Fuente presente: [replication/src/conformance.mjs](../../replication/src/conformance.mjs)
- Fuente presente: [replication/src/core/cobria.mjs](../../replication/src/core/cobria.mjs)
- Fuente presente: [replication/tests/core11.test.mjs](../../replication/tests/core11.test.mjs)

### 08 Patrones de diseño

Las treinta fichas tienen referencia verificada; LAB-15 y LAB-16 invocan una meta Make inexistente.

Para cerrar: Problema ingenuo, solución, ejecución, prueba, costo y alternativa por patrón.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/03-pattern-design.md](../../manuales/03-pattern-design.md)
- Fuente presente: [libro-cobria/practical-examples.json](../../libro-cobria/practical-examples.json)
- Fuente presente: [replication/examples/patterns-r4/src/patrones.ts](../../replication/examples/patterns-r4/src/patrones.ts)
- Fuente presente: [replication/examples/patterns-r4/test/patrones.test.ts](../../replication/examples/patterns-r4/test/patrones.test.ts)

### 09 API, experiencia e internacionalización

Hay controladores y contratos; no son por sí solos servidor HTTP, interfaz de la aplicación ni prueba con tecnología de apoyo.

Para cerrar: Formulario y API conectados, estados, errores, cursores, idiomas y revisión accesible de la aplicación conductora.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/15-api-ux.md](../../manuales/15-api-ux.md)
- Fuente presente: [replication/examples/ecosistema-app/src/presentation/problema-http.mjs](../../replication/examples/ecosistema-app/src/presentation/problema-http.mjs)
- Fuente presente: [replication/examples/ecosistema-app/src/presentation/registrar-observacion-controller.mjs](../../replication/examples/ecosistema-app/src/presentation/registrar-observacion-controller.mjs)
- Fuente presente: [replication/examples/ecosistema-app/test/app.test.mjs](../../replication/examples/ecosistema-app/test/app.test.mjs)
- Fuente presente: [sitio/tests/rendered-html.test.mjs](../../sitio/tests/rendered-html.test.mjs)

### 10 Documentación y comunicación

La generación editorial existe, pero las lecciones de README repiten npm install/test/start sin situar carpeta ni prerrequisitos.

Para cerrar: Tutorial, referencia, ADR y runbook completos y mantenidos desde ejemplos reales.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/README.md](../../manuales/README.md)
- Fuente presente: [editorial/DICCIONARIO-TERMINOLOGICO.md](../../editorial/DICCIONARIO-TERMINOLOGICO.md)
- Fuente presente: [manuales/24-organizacion-y-operacion-del-proyecto.md](../../manuales/24-organizacion-y-operacion-del-proyecto.md)
- Fuente presente: [editorial/build-curriculum.mjs](../../editorial/build-curriculum.mjs)
- Fuente presente: [replication/tests/phase17-editorial.test.mjs](../../replication/tests/phase17-editorial.test.mjs)

### 11 Seguridad y privacidad

Autorización local probada; identidad verificada, Rules de la aplicación y rotación operativa requieren un recorrido separado.

Para cerrar: Modelo de amenazas y pruebas negativas que atraviesen identidad, autorización, proveedor, exportación y recuperación.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/16-security.md](../../manuales/16-security.md)
- Fuente presente: [specification/phase-7/security.json](../../specification/phase-7/security.json)
- Fuente presente: [manuales/24-organizacion-y-operacion-del-proyecto.md](../../manuales/24-organizacion-y-operacion-del-proyecto.md)
- Fuente presente: [replication/examples/ecosistema-app/src/application/security/autorizar-capacidad.mjs](../../replication/examples/ecosistema-app/src/application/security/autorizar-capacidad.mjs)
- Fuente presente: [replication/examples/ecosistema-app/test/app.test.mjs](../../replication/examples/ecosistema-app/test/app.test.mjs)

### 12 Calidad, pruebas y rendimiento

Existe metodología de defectos y evidencia experimental; un comando de estadísticas no demuestra que el alumno ejecutó el experimento.

Para cerrar: Reproducir un defecto, corregirlo, demostrar regresión y medir una optimización con carga y límites.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/17-quality-performance.md](../../manuales/17-quality-performance.md)
- Fuente presente: [specification/phase-9/quality.json](../../specification/phase-9/quality.json)
- Fuente presente: [manuales/23-metodologia-de-correccion-verificable.md](../../manuales/23-metodologia-de-correccion-verificable.md)
- Fuente presente: [manuales/24-organizacion-y-operacion-del-proyecto.md](../../manuales/24-organizacion-y-operacion-del-proyecto.md)
- Fuente presente: [replication/scripts/run-r7-confirmatory.mjs](../../replication/scripts/run-r7-confirmatory.mjs)
- Fuente presente: [replication/examples/operacion-documental/test/operacion.test.mjs](../../replication/examples/operacion-documental/test/operacion.test.mjs)

### 13 Nube, ambientes y operaciones

Los mecanismos locales no sustituyen Functions y staging de una aplicación real; publicar del Toolkit solo simula.

Para cerrar: Proveedor opcional aislado, Function, Rules, promoción por huella, humo, respaldo y rollback con evidencia propia.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/18-cloud-operations.md](../../manuales/18-cloud-operations.md)
- Fuente presente: [specification/phase-8/environments.json](../../specification/phase-8/environments.json)
- Fuente presente: [manuales/24-organizacion-y-operacion-del-proyecto.md](../../manuales/24-organizacion-y-operacion-del-proyecto.md)
- Fuente presente: [replication/examples/operacion-documental/src/application/verificar-entrega.mjs](../../replication/examples/operacion-documental/src/application/verificar-entrega.mjs)
- Fuente presente: [replication/examples/operacion-documental/test/operacion.test.mjs](../../replication/examples/operacion-documental/test/operacion.test.mjs)

### 14 Analítica e inteligencia artificial

La recuperación es determinista y léxica; no demuestra evaluación de un modelo generativo ni comprensión humana.

Para cerrar: Conjunto reconstruible, ausencia de fuga, citas, abstención y extensión a modelos con evaluación explícita.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/19-analytics-ai.md](../../manuales/19-analytics-ai.md)
- Fuente presente: [replication/examples/ecosistema-app/src/application/ai/recuperar-evidencia.mjs](../../replication/examples/ecosistema-app/src/application/ai/recuperar-evidencia.mjs)
- Fuente presente: [replication/examples/ecosistema-app/src/application/analytics/construir-conjunto.mjs](../../replication/examples/ecosistema-app/src/application/analytics/construir-conjunto.mjs)
- Fuente presente: [replication/examples/ecosistema-app/test/app.test.mjs](../../replication/examples/ecosistema-app/test/app.test.mjs)

### 15 Aplicación completa

La composición fija memoria e ignora COBRIA_ADAPTER; los otros adaptadores se prueban con dobles, no como aplicación integral.

Para cerrar: Instalación hasta interfaz, API, motor real, seguridad, operación y retirada en un mismo proyecto.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/20-build-reference.md](../../manuales/20-build-reference.md)
- Fuente presente: [replication/examples/ecosistema-app/GUIA-PASO-A-PASO.md](../../replication/examples/ecosistema-app/GUIA-PASO-A-PASO.md)
- Fuente presente: [manuales/24-organizacion-y-operacion-del-proyecto.md](../../manuales/24-organizacion-y-operacion-del-proyecto.md)
- Fuente presente: [replication/examples/ecosistema-app/src/composition.mjs](../../replication/examples/ecosistema-app/src/composition.mjs)
- Fuente presente: [replication/examples/ecosistema-app/test/app.test.mjs](../../replication/examples/ecosistema-app/test/app.test.mjs)

### 16 Herramientas para personas e IA

Algunos flags pedagógicos no existen; generar acepta --simular pero no lo aplica y escribe archivos.

Para cerrar: Alinear ayuda y lecciones con comandos reales; una simulación debe producir cero escrituras.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/21-toolkit.md](../../manuales/21-toolkit.md)
- Fuente presente: [replication/src/cli.mjs](../../replication/src/cli.mjs)
- Fuente presente: [replication/src/generator.mjs](../../replication/src/generator.mjs)
- Fuente presente: [replication/tests/phase13-generator.test.mjs](../../replication/tests/phase13-generator.test.mjs)

### 17 Evidencia, evolución y publicación

Hay réplica local y límites, pero manuales/22 mantiene resultados confirmatorios incompletos y aparece una meta de paquete inexistente.

Para cerrar: Inventario vigente en todos los productos y revisión, transferencia, cribado y réplica externos auténticos.

Muestra cualitativa: lección 1. Estado: parcial.

- Fuente presente: [manuales/22-evidence-transfer.md](../../manuales/22-evidence-transfer.md)
- Fuente presente: [MATRIZ-TRAZABILIDAD-RELEASE.md](../../MATRIZ-TRAZABILIDAD-RELEASE.md)
- Fuente presente: [replication/scripts/build-remediation-r9.py](../../replication/scripts/build-remediation-r9.py)
- Fuente presente: [replication/tests/release-handoff.test.mjs](../../replication/tests/release-handoff.test.mjs)

## Separación científica y editorial

El maestro y el artículo explican la contribución investigativa; no se exige que reproduzcan los 17 tutoriales. La difusión pedagógica no demuestra eficacia educativa.

C11 debe conservar la especialización del artículo y enlazar afirmaciones con resultados. C10 debe revisar el libro y la web; compartir el mismo JSON solo demuestra una fuente común, no comprensión ni equivalencia de uso.

## Reproducir y conservar la línea base

`node editorial/audit-c0.mjs --check` verifica los derivados contra el commit congelado. Requiere ese objeto Git; no consulta la web ni ejecuta comandos de los laboratorios. `node editorial/audit-c0.mjs` regenera exclusivamente los derivados C0.

Los cambios futuros de C1 a C15 no reescriben los resultados de esta línea base. Se registrarán cierres con sus propias pruebas, commit y revisión. Las huellas y los estados por lección están en `coverage.json`.
