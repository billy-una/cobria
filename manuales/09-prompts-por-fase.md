# Prompts para ejecutar las fases COBRIA

## Instrucción común

Ejecute cada prompt desde el repositorio COBRIA. El agente debe inspeccionar antes de escribir, preservar cambios ajenos, citar archivos reales, no inventar resultados y finalizar con artefactos modificados, pruebas, riesgos y pendientes humanos.

## Fase 0 — Procedencia

```text
Analiza los repositorios declarados en manuales/10-repositorios-de-referencia.md. Registra URL, rama, commit, fecha, archivo, patrón, evidencia y límite de inferencia. Distingue patrón establecido, adaptación COBRIA, experimento y resultado ejecutado. No copies secretos ni datos personales. Genera inventario, mapa de evidencia y declaración de originalidad.
```

## Fase 1 — Manifiesto

```text
Revisa todo COBRIA y construye un manifiesto coherente en español. Define alcance, principios, términos, alias y afirmaciones que COBRIA no hace. Detecta contradicciones entre especificación, artículo, documento maestro, libro, sitio y código. Conserva una definición canónica y registra decisiones editoriales.
```

## Fase 2 — Requisitos

```text
Convierte necesidades en actores, casos de uso, requisitos funcionales y no funcionales y criterios observables. Asigna identificadores estables. Relaciona cada requisito con componente, dato, riesgo y prueba. Crea ADR para decisiones con alternativas. No propongas infraestructura sin requisito.
```

## Fase 3 — Diccionarios

```text
Construye los diccionarios conceptual, lógico y físico de <PROYECTO>. Para cada dato documenta significado, tipo, obligatoriedad, reglas, unidad, ámbito, tiempos, procedencia, versión, sensibilidad, retención, consumidores, responsable, ejemplos e índices. Relaciona a,b,c con nombres lógicos sin permitir que el dominio dependa de esas claves. Incluye casos inválidos y migraciones.
```

## Fase 4 — Nodos

```text
Analiza nX, snX, lX y atributos compactos. Decide qué pertenece al mismo agregado y qué se separa según identidad, ciclo de vida, crecimiento, acceso, retención, escritura y propietario. Antes de crear un nodo, demuestra por qué los existentes no sirven y genera ADR, diccionario, índices, reglas, migración y pruebas. Produce mapa de ownership y matriz de lectura/escritura.
```

## Fase 5 — Arquitectura

```text
Audita capas, carpetas, archivos y dependencias. Clasifica presentación, aplicación, dominio, puertos, infraestructura y composición. Documenta responsabilidad, conocimiento permitido, entradas, salidas, errores y pruebas. Detecta acceso directo a base, reglas en UI, SDK en dominio, ciclos y archivos ambiguos. Propón migración incremental, no reescritura total.
```

## Fase 6 — Lenguaje e i18n

```text
Define nombres, comentarios, docstrings, errores, mensajes, claves i18n y datos localizables. Conserva identidad independiente de traducción. Comprueba UTC, America/Costa_Rica al presentar, moneda ISO, unidades y plurales. Elimina comentarios que repiten código y conserva decisiones, invariantes, riesgos, ADR y compatibilidad. Incluye accesibilidad.
```

## Fase 7 — Ciberseguridad

```text
Realiza una auditoría defensiva. Modela amenazas, datos, actores, fronteras, capacidades, reglas por nodo, secretos, dependencias, Functions, webhooks, registros, IA e incidentes. Aplica mínimo privilegio y ámbito. Crea pruebas negativas para acceso cruzado, revisión obsoleta, entrada manipulada, repetición, permisos excesivos y exposición. Informa amenaza residual; no afirmes seguridad completa.
```

## Fase 8 — Cloud y Functions

```text
Inventaría los ambientes local, test, preview, staging, producción y recuperación, además de cada servicio, HTTP Function, consumidor, tarea, webhook y cola. Para Firebase registra proyecto y alias por ambiente sin copiar credenciales. Documenta trigger, contrato, ámbito, identidad, región, memoria, timeout, concurrencia, idempotencia, reintentos, dead-letter, secretos, permisos, métricas, costo, degradación y recuperación. Diseña el flujo preview → staging → producción con validación de cuenta, rama, variables, reglas, pruebas, artefacto, humo y rollback. No uses datos personales de producción en staging. Compara servidor, contenedor, Function y worker; elige lo más sencillo que cumpla requisitos. Genera configuración, checklist y runbook, pero no declares un despliegue ejecutado sin evidencia del proveedor.
```

## Fase 9 — Manifiestos

```text
Transforma la documentación aprobada en YAML para proyecto, arquitectura, diccionario, nodos, catálogos, Functions, seguridad, calidad, operación y trazabilidad. Cada concepto tiene una fuente canónica y referencias por ID. Incluye versión, responsable y fecha. Valida referencias y genera una vista Markdown.
```

## Fase 10 — Esquemas

```text
Define JSON Schema para los manifiestos COBRIA. Incluye tipos, enumeraciones, campos obligatorios, formatos, restricciones, referencias y compatibilidad. Crea ejemplos mínimos, completos e inválidos. Ejecuta el validador y conserva resultados reproducibles. No cambies el significado solo para facilitar el esquema.
```

## Fase 11 — CLI

```text
Implementa una CLI neutral en español con ayuda, códigos de salida y salidas humana y JSON. Comienza con init, validar, validar-diccionario, validar-nodos, validar-seguridad y generar-trazabilidad. Añade pruebas aisladas y ejemplos; no dependas de credenciales ni de repositorios de referencia.
```

## Fase 12 — Generadores

```text
Añade generadores idempotentes de entidad, valor, caso de uso, puerto, adaptador, Dater, catálogo, nodo, Function, evento, ADR y prueba. Cada comando produce código sencillo, actualiza manifiestos y explica lo creado. No sobrescribas archivos; informa conflictos. Verifica cada plantilla con una construcción limpia.
```

## Fase 13 — Auditor

```text
Construye reglas COBRIA con identificador, severidad, evidencia y remediación. Detecta claves físicas fuera del Dater, nodos sin diccionario, acceso sin ámbito, Functions sin límites, catálogos sin versión, errores sin código, traducciones faltantes, permisos excesivos, derivados sin reconstrucción y requisitos sin prueba. Añade fixtures positivos y negativos y documenta límites del análisis.
```

## Fase 14 — Optimización

```text
Define carga, línea base y presupuesto antes de optimizar. Mide p50, p95, p99, CPU, memoria, red, almacenamiento, amplificación, frescura, recuperación y costo. Compara documento, índice, caché, vista, CQRS, eventos, proyección simple y COBRIA. Cambia una variable por vez y publica resultados negativos. No generalices una prueba local.
```

## Fase 15 — Contexto IA

```text
Genera AGENTS.md y contexto por caso de uso con propósito, archivos, reglas, datos, dependencias, pruebas, seguridad, prohibiciones y aceptación. Implementa contexto, explicar e impacto. Comprueba que un agente explique el flujo sin todo el repositorio y que nunca confunda a,b,c con significado de dominio.
```

## Fase 16 — Transferencia

```text
Audita COBRIA de C0 a C5. Relaciona requisito, patrón, implementación, prueba, resultado, amenaza y documento. Regenera artículo, documento maestro, libro, sitio y réplica. Separa evidencia histórica, confirmatoria y pendiente. Prepara revisión externa y estudio humano, pero no simules participantes, consentimiento ni revisión independiente.
```

## Control final de cualquier fase

```text
Revisa el trabajo como auditor independiente. Enumera archivos, decisiones, pruebas, resultados, afirmaciones no demostradas, riesgos y trabajo humano pendiente. Confirma que no introdujiste SQL en el núcleo NoSQL, datos personales, secretos, resultados inventados ni referencias sin fuente. No marques la fase completa si falta su criterio de salida.
```

## Prompt maestro para el roadmap integral

```text
Lee manuales/11-estado-y-roadmap-integral.md, manuales/08-hoja-de-ruta-fases.md y manuales/10-repositorios-de-referencia.md. Trabaja únicamente en la fase <N>. Antes de editar, informa qué está documentado, implementado y cerrado; identifica dependencias y archivos canónicos. Usa enlaces, ramas y commits reales. Produce entregables, trazabilidad y checklist del gate. Si no tienes terminal, credenciales, ambiente real o participantes, prepara los artefactos pero conserva el estado pendiente. No mezcles evidencia histórica con confirmatoria ni contenido pedagógico con requisitos normativos.
```
