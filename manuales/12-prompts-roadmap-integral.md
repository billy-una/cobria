# Prompts del roadmap integral COBRIA 0–18

Estos prompts corresponden exactamente a las fases de
`11-estado-y-roadmap-integral.md`. Sustituya `<PROYECTO>` y `<FASE>` solo con valores
reales. Todo agente debe preservar cambios ajenos, evitar secretos y distinguir
**documentado**, **implementado** y **cerrado**.

## Prompt base obligatorio

```text
Trabaja en el repositorio COBRIA y lee manuales/11-estado-y-roadmap-integral.md y manuales/10-repositorios-de-referencia.md. Ejecuta solo la fase indicada. Inspecciona antes de editar. Cita URL, rama, commit y archivo reales. No inventes resultados, revisiones humanas, despliegues ni evidencia. Entrega archivos modificados, trazabilidad, verificaciones realizadas, riesgos y pendientes. No marques la fase cerrada si no supera su gate.
```

## Fase 0 — Inventario y procedencia

```text
Ejecuta la fase 0. Inventaría los repositorios declarados, registra URL, SHA completo, fecha, licencia, archivos relevantes, patrón observado, clasificación y límite de inferencia. Separa observación, adaptación COBRIA, práctica establecida, experimento y resultado. No extraigas datos personales ni secretos. Produce inventario y mapa de evidencia revisables.
```

## Fase 1 — Manifiesto y vocabulario

```text
Ejecuta la fase 1. Compara especificación, artículo, maestro, libro, sitio y código. Define propósito, principios, partes del ecosistema, términos canónicos, alias, niveles normativos y afirmaciones prohibidas. Registra contradicciones y ADR de alcance. Mantén Core normativo separado de los manuales pedagógicos.
```

## Fase 2 — Requisitos y decisiones

```text
Ejecuta la fase 2 para <PROYECTO>. Identifica actores, objetivos, casos de uso, requisitos funcionales/no funcionales y criterios observables. Asigna IDs estables y relaciona requisito, componente, dato, amenaza y prueba. Crea ADR cuando haya alternativas. No propongas tecnología sin un requisito que la justifique.
```

## Fase 3 — Diccionarios de datos

```text
Ejecuta la fase 3. Construye diccionarios conceptual, lógico y físico. Para cada dato documenta significado, clave física, tipo, obligatoriedad, formato, unidad, ámbito, tiempo, procedencia, sensibilidad, retención, versión, responsable, consumidores, índices, ejemplos y reglas. Traduce n8, a, b y c sin permitir que el dominio dependa de esas claves. Incluye migraciones y casos inválidos.
```

## Fase 4 — Nodos y almacenamiento NoSQL

```text
Ejecuta la fase 4. Analiza nX, snX, lX, agregados, documentos, referencias, índices y proyecciones. Decide separar o anidar según identidad, ciclo de vida, cardinalidad, crecimiento, atomicidad, acceso, retención y propietario. Para cada nodo genera ADR, diccionario, ownership, matriz de lectura/escritura, índices, migración y pruebas propuestas.
```

## Fase 5 — Capas y responsabilidades

```text
Ejecuta la fase 5. Audita carpetas, archivos, imports y flujo. Clasifica presentación, aplicación, dominio, puertos, adaptadores, datos, infraestructura y composición. Documenta Daters, servicios, casos de uso y controladores. Detecta SDK en dominio, reglas en UI, acceso directo a datos, ciclos y responsabilidades ambiguas. Propón migración incremental con pruebas.
```

## Fase 6 — Documentación, comentarios y lenguaje

```text
Ejecuta la fase 6. Diseña README por nivel, ADR, diagramas, documentación de API/eventos, runbooks y metadatos de vigencia. Audita comentarios y docstrings: conserva motivos, invariantes, riesgos, seguridad, compatibilidad y deuda trazable; elimina repeticiones del código. Define errores estables, i18n, fechas, zonas, monedas, unidades, plurales y accesibilidad.
```

## Fase 7 — Seguridad y privacidad

```text
Ejecuta la fase 7 como auditor defensivo. Modela activos, actores, fronteras, amenazas, capacidades, ámbito, reglas por nodo, secretos, dependencias, Functions, webhooks, registros, privacidad, IA e incidentes. Aplica mínimo privilegio. Diseña pruebas negativas para acceso cruzado, revisión obsoleta, manipulación, repetición, abuso y permisos excesivos. No declares seguridad completa sin ejecución.
```

## Fase 8 — Ambientes, staging y cloud

```text
Ejecuta la fase 8. Inventaría local, test, preview, staging, producción y recuperación. Para Firebase registra aliases y proyectos sin credenciales. Documenta cada Function, evento, tarea, worker, webhook y cola: contrato, ámbito, región, memoria, timeout, concurrencia, idempotencia, reintentos, dead-letter, secretos, permisos, métricas, costo y recuperación. Diseña preview → staging → producción, humo y rollback. Nunca copies datos personales de producción a staging.
```

## Fase 9 — Calidad y observabilidad

```text
Ejecuta la fase 9. Relaciona cada tipo de cambio con pruebas unitarias, contrato, integración, emulador, motor real, E2E, accesibilidad, seguridad, rendimiento, resiliencia, migración y humo. Define logs estructurados, métricas, trazas, SLI/SLO, alertas y evidencia posdespliegue. Separa pruebas disponibles de pruebas realmente ejecutadas.
```

## Fase 10 — API, integración y UX

```text
Ejecuta la fase 10. Especifica APIs y eventos con versión, validación, idempotencia, paginación, errores, autenticación, autorización, timeouts, reintentos, compatibilidad y pruebas de contrato. Audita formularios, navegación, estados vacíos/carga/error, responsive, teclado, lectores de pantalla, contraste e internacionalización.
```

## Fase 11 — Manifiestos de máquina

```text
Ejecuta la fase 11. Convierte únicamente documentación aprobada en project.yaml, architecture.yaml, data-dictionary.yaml, nodes.yaml, functions.yaml, security.yaml, quality.yaml, environments.yaml y traceability.yaml. Cada registro debe tener ID, versión, responsable, estado y fuente. Detecta referencias rotas; no inventes campos para completar plantillas.
```

## Fase 12 — Esquemas y CLI

```text
Ejecuta la fase 12. Define JSON Schema para los manifiestos y una CLI neutral en español con init, validar, explicar, contexto, impacto, auditar, medir y verificar. Incluye ayuda, códigos de salida, salida humana y JSON, ejemplos válidos/inválidos y pruebas. Ejecuta instalación limpia y validadores antes de declarar cierre.
```

## Fase 13 — Generadores

```text
Ejecuta la fase 13. Implementa generadores idempotentes de proyecto, módulo, entidad, valor, caso de uso, puerto, adaptador, Dater, nodo, catálogo, Function, evento, ADR, prueba y runbook. Cada operación debe producir código, prueba, documentación y manifiesto, explicar cambios y rechazar sobrescrituras. Verifica el resultado en un proyecto temporal.
```

## Fase 14 — Auditor automático

```text
Ejecuta la fase 14. Implementa reglas con ID, severidad, ubicación, evidencia y remediación para imports prohibidos, claves físicas fuera del Dater, acceso directo al proveedor, nodos sin dueño, Functions sin límites, catálogos sin versión, permisos excesivos, derivados no reconstruibles y requisitos sin prueba. Añade fixtures positivos/negativos y mide falsos positivos.
```

## Fase 15 — Rendimiento y costo

```text
Ejecuta la fase 15. Congela carga, semilla, ambiente, índices, presupuesto y línea base. Mide p50, p95, p99, dispersión, CPU, memoria, red, almacenamiento, amplificación, frescura, recuperación y costo. Compara documento, índice, caché, vista, CQRS, eventos, proyección simple y COBRIA. Cambia una variable por vez y conserva resultados negativos.
```

## Fase 16 — Contexto para IA

```text
Ejecuta la fase 16. Crea AGENTS.md raíz y por módulo, mapas de flujo, archivos relevantes, datos, dependencias, comandos permitidos, archivos protegidos, seguridad, pruebas, prohibiciones y criterios de aceptación. Comprueba con tareas ciegas que otro agente entiende un flujo sin todo el repositorio y no confunde claves físicas, ámbito, ambiente o autoridad.
```

## Fase 17 — Artículo, maestro, libro y sitio

```text
Ejecuta la fase 17. Define fuentes canónicas y regenera especificación, artículo, documento maestro, libro, sitio, ejemplos y recursos. Mantén norma, evidencia científica y explicación pedagógica separadas. Comprueba enlaces, terminología, cifras, accesibilidad, construcción limpia y ausencia de contenido obsoleto. No publiques ni despliegues sin autorización explícita.
```

## Fase 18 — Validación externa

```text
Prepara la fase 18 sin simularla. Empaqueta réplica confirmatoria, rúbrica independiente, estudio humano, transferencia, comparación industrial, release, firmas y depósito. Genera formularios y validadores vacíos. Solo incorpora resultados recibidos de terceros con consentimiento, procedencia y commit evaluado. No suplantes revisores ni participantes y no inventes DOI.
```

## Fase 19 — COBRIA Engineering

```text
Ejecuta la fase 19 sin modificar COBRIA Core 1.0. Audita estados asíncronos, operaciones críticas, política offline, colas y dead-letter, promoción de artefactos, observabilidad, presupuestos de rendimiento y costo, retiro de legado e incidentes. Para cada hallazgo crea un contrato con ID ENG, problema, aceptación, prueba, responsable, costo y criterio de retiro. Distingue lo observado en repositorios de referencia de la adaptación neutral COBRIA. Integra fuentes canónicas, manual, libro, sitio y un gate automático; no declares validación operacional sin infraestructura real.
```

## Fase 20 — Laboratorio COBRIA Engineering

```text
Ejecuta la fase 20. Implementa un laboratorio neutral, pequeño y sin dependencias externas para los contratos ENG-001..ENG-008. Incluye éxito y rechazo para estado operativo, autoridad e idempotencia, preflight offline, cola acotada y dead-letter, release por digest, telemetría sanitizada no bloqueante y presupuesto no-growth de legado. Relaciona cada prueba con su contrato y conserva como pendientes la infraestructura real, accesibilidad humana, rollback y transferencia externa.
```

## Fase 21 — Piloto de adopción COBRIA Engineering

```text
Ejecuta la fase 21 sobre un checkout Git autorizado y limpio. Congela remoto, rama, commit y huellas de archivos; aplica ENG-001..ENG-008 sin modificar el proyecto; distingue documentación, implementación local, ejecución controlada, validación operacional y transferencia. Genera JSON reproducible, rúbrica y brechas. La existencia de código o pruebas no autoriza afirmar producción, seguridad integral, rollback real ni validación humana.
```

## Fase 22 — Evaluación Engineering dirigida por manifiesto

```text
Ejecuta la fase 22. Extrae las rutas y criterios específicos del piloto hacia un manifiesto JSON con esquema. El motor debe aceptar cualquier checkout Git, leer exclusivamente el commit declarado, rechazar rutas absolutas o con .., no ejecutar código evaluado y producir huellas y estados reproducibles. Incluye un fixture válido, casos negativos y una comprobación de que cambios locales posteriores no alteran el informe. Conserva operationallyValidated en cero salvo protocolo operacional separado.
```

## Auditoría final de fase

```text
Audita la fase <FASE>. Enumera entregables, IDs, fuentes, cambios, verificaciones, resultados, riesgos y pendientes humanos. Comprueba el gate literalmente. Clasifica el estado como documentado, implementado o cerrado y justifica cada palabra con evidencia. Si falta un comando, credencial, ambiente o persona, devuelve pendiente y explica el siguiente paso exacto.
```
