# Hoja de ruta para completar COBRIA

Esta hoja de ruta convierte COBRIA en un manifiesto, manual y conjunto de herramientas para personas programadoras y agentes de inteligencia artificial. Las fases 0–8 producen conocimiento revisable; las fases 9–16 convierten ese conocimiento en contratos y comandos ejecutables.

## Reglas de ejecución

1. Una fase no se cierra solo porque exista texto: debe cumplir su criterio de salida.
2. Todo hallazgo procedente de un proyecto de referencia debe enlazar repositorio, commit y archivo; el dominio se anonimiza cuando se publica como investigación.
3. Una IA puede redactar, comparar y detectar inconsistencias, pero no reemplaza la aprobación del responsable, una revisión independiente ni un estudio con participantes.
4. Los nombres físicos (`n8`, `a`, `b`, `c`) nunca sustituyen el diccionario lógico.
5. Una recomendación de rendimiento debe indicar carga, línea base, resultado y costo.
6. Una fase pendiente permanece como pendiente; no se inventa evidencia.

## Fase 0 — Inventario y procedencia

**Objetivo:** saber de dónde proviene cada idea y qué evidencia la sostiene.

**Productos:** inventario de repositorios, mapa de evidencia, patrones observados y declaración de alcance y originalidad.

**Salida:** cada afirmación importante enlaza una fuente y distingue observación, adaptación, propuesta y resultado experimental.

## Fase 1 — Manifiesto y lenguaje común

**Objetivo:** fijar principios, alcance, términos y promesa responsable.

**Productos:** `MANIFESTO.md`, glosario, términos canónicos, alias, nombres desaconsejados y declaración de lo que COBRIA no es.

**Salida:** artículo, documento maestro, libro, sitio, especificación y código utilizan conceptos compatibles.

## Fase 2 — Requisitos y decisiones

**Objetivo:** transformar necesidades en requisitos verificables.

**Productos:** actores, historias, casos de uso, requisitos funcionales y no funcionales, criterios de aceptación y ADR.

**Salida:** cada componente responde a un requisito o decisión registrada.

## Fase 3 — Modelado y diccionarios de datos

**Objetivo:** pasar del lenguaje del dominio a documentos físicos sin perder significado.

**Productos:** diccionarios conceptual, lógico y físico; entidades; atributos; identidades; ámbitos; tiempos; sensibilidad; retención; catálogos y migraciones.

**Salida:** toda clave física traduce a un atributo lógico con definición, tipo, regla, procedencia, responsable y ejemplos.

## Fase 4 — Nodos, agregados y atributos compactos

**Objetivo:** enseñar cuándo reutilizar, separar o crear un nodo.

**Productos:** mapa `nX/snX/lX`, propiedad por módulo, relaciones, índices, matriz de lectura/escritura, claves `a,b,c` y plantilla para nodos nuevos.

**Salida:** ningún nodo nuevo existe sin ADR, diccionario, reglas, índices, migración y pruebas.

## Fase 5 — Arquitectura, capas y repositorio

**Objetivo:** hacer visibles responsabilidades y dirección de dependencias.

**Productos:** manual de capas, carpetas, archivos, puertos, adaptadores, Daters, casos de uso, servicios, controladores, composición y reglas de importación.

**Salida:** dominio y aplicación no dependen de rutas físicas, SDK, interfaz ni proveedor.

## Fase 6 — Lenguaje, comentarios e internacionalización

**Objetivo:** mantener significado consistente en código, interfaz, datos y documentación.

**Productos:** Language Manager, comentarios, docstrings, errores, claves de traducción, i18n, l10n, fechas, zonas, monedas, unidades y accesibilidad.

**Salida:** los textos visibles no están incrustados en la lógica y los identificadores no dependen de traducciones.

## Fase 7 — Ciberseguridad y privacidad

**Objetivo:** integrar seguridad desde identidad y dato hasta despliegue e IA.

**Productos:** amenazas, capacidades, clasificación, reglas por nodo, secretos, SBOM, vulnerabilidades, excepciones, incidentes y recuperación.

**Salida:** toda operación sensible declara actor, capacidad, ámbito, finalidad, auditoría y caso negativo.

## Fase 8 — Cloud, Functions, eventos y operación

**Objetivo:** describir la ejecución responsable de un proyecto moderno.

**Productos:** contratos de Functions, eventos, webhooks, tareas, workers, colas, idempotencia, límites, reintentos, dead-letter, infraestructura, CI/CD, observabilidad y RTO/RPO.

**Salida:** cada unidad desplegable posee responsable, recursos, permisos, timeout, métricas, recuperación y costo.

## Fase 9 — Manifiestos legibles por máquinas

**Objetivo:** convertir la documentación en datos verificables.

**Productos:** `manifest.yaml`, `architecture.yaml`, `data-dictionary.yaml`, `nodes.yaml`, `catalogs.yaml`, `functions.yaml`, `security.yaml`, `quality.yaml`, `operations.yaml` y `traceability.yaml`.

**Salida:** una herramienta puede interpretar el proyecto sin extraer reglas desde párrafos libres.

## Fase 10 — Esquemas y validación estructural

**Objetivo:** definir qué constituye un manifiesto COBRIA válido.

**Productos:** JSON Schema para proyecto, diccionario, nodo, catálogo, Function, seguridad, calidad, rendimiento y trazabilidad; ejemplos válidos e inválidos.

**Salida:** un validador detecta campos ausentes, versiones incompatibles y referencias rotas.

## Fase 11 — CLI COBRIA

**Objetivo:** ofrecer una interfaz reproducible para validar proyectos.

**Productos:** comandos `init`, `inventariar`, `validar-*`, `explicar`, `contexto`, `impacto`, `auditar`, `medir`, `comparar`, `verificar` y `generar-informe`.

**Salida:** instalación limpia, ayuda en español, códigos de salida estables, JSON e informe legible.

## Fase 12 — Generadores

**Objetivo:** crear estructuras correctas sin copiar plantillas opacas.

**Productos:** generadores de entidad, valor, caso de uso, puerto, adaptador, Dater, nodo, catálogo, Function, evento, ADR y prueba.

**Salida:** cada generación incluye código, prueba, documentación y manifiesto; repetirla no sobrescribe trabajo.

## Fase 13 — Auditor automático

**Objetivo:** encontrar divergencias entre manifiesto, código, datos y seguridad.

**Comprobaciones:** acceso directo a base, claves físicas fuera del Dater, nodos sin dueño, Functions sin timeout, catálogos sin versión, traducciones faltantes, comentarios obsoletos, permisos excesivos, derivados no reconstruibles y requisitos sin prueba.

**Salida:** hallazgos con regla, severidad, ubicación, evidencia y remediación.

## Fase 14 — Rendimiento, costo y optimización

**Objetivo:** optimizar para objetivos explícitos sin prometer superioridad universal.

**Productos:** cargas, presupuestos, línea base, p50/p95/p99, CPU, memoria, red, almacenamiento, amplificación, recuperación, costo y criterios de retiro.

**Salida:** cada cambio informa beneficio, regresión y costo bajo una configuración reproducible.

## Fase 15 — Contexto para agentes de IA

**Objetivo:** permitir que una IA comprenda y modifique el proyecto con límites verificables.

**Productos:** `AGENTS.md`, contexto por caso de uso, archivos relevantes, datos, dependencias, pruebas, seguridad, operaciones prohibidas e impacto.

**Salida:** un agente nuevo explica un flujo sin recibir todo el repositorio ni confundir claves físicas con reglas.

## Fase 16 — Conformidad, transferencia y publicación

**Objetivo:** demostrar comprensión, ejecución y reproducción fuera del autor.

**Productos:** niveles C0–C5, réplica, artículo, documento maestro, libro, sitio, aplicación neutral, informes, revisión independiente y estudio de transferencia.

**Salida:** otra persona puede implementar, verificar y explicar el resultado. Las actividades humanas conservan consentimiento y evidencia real.

## Orden de cierre

```text
Procedencia → Manifiesto → Requisitos → Diccionarios → Nodos → Arquitectura
→ Lenguaje → Seguridad → Operación → Manifiestos → Esquemas → CLI
→ Generadores → Auditoría → Optimización → Contexto IA → Transferencia
```
