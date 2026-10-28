# Roadmap de cierre del ecosistema COBRIA

El alcance de esta secuencia es completar una edición pública comprensible y práctica
en las 17 áreas del currículo y separar su validación científica. Es una propuesta
independiente; no promete software universalmente optimizado ni altera Core 1.0.

La revisión profunda del 18 de octubre de 2026 se atiende mediante el
[plan correctivo PC0–PC11](ROADMAP-CORRECTIVO-COBRIA.md). Detalla integridad,
regresiones, alcance experimental, pedagogía y cierre externo sin sustituir
las fases C ni declarar resueltos sus criterios pendientes.

## Línea base y estado

C0 se ejecutó el 17 de octubre de 2026 sobre el commit
`deca1b14ff44805d5d36814654cf35be27d2fa89`. Su diagnóstico está en
[la matriz de cobertura](editorial/c0/AUDITORIA-C0.md), con datos estructurados en
`editorial/c0/coverage.json` y seis sondas en `editorial/c0/probes.json`.

Las 17 áreas poseen fuentes, 85 lecciones, 30 laboratorios y 12 prácticas. C0 registra
10 brechas, una crítica: la generación acepta simulación sin impedir escrituras.
La implementación local C1 y sus límites se registran en `editorial/c1/status.json`;
C2 se registra en `editorial/c2/status.json` y C3 en `editorial/c3/status.json`.
C4 conecta treinta decisiones, alternativas, límites y casos ejecutables al catálogo,
las fichas web y el libro; su comprobación local se registra en `editorial/c4/status.json`.
C5 añade un puente HTTP local con formulario, sesiones DEMO temporales, validación,
permisos, privacidad y rechazo antes del repositorio; su estado y límites se registran
en `editorial/c5/status.json`. No es autenticación de producción ni certificación accesible.
C6 incorpora defecto de caché reproducible, microensayo con protocolo y recuperación
documental con ensayo local de candidata y reversión; estado en `editorial/c6/status.json`.
No acredita operación de nube, aprobación humana ni recuperación integral del servicio.
C7 añade cortes temporales, rechazo de fuga, manifiesto, recuperación acotada,
abstención y herramienta de lectura; estado en `editorial/c7/status.json`.
La evaluación sintética conserva errores y no se atribuye entrenamiento ni calidad de IA real.
C8 conecta formulario, HTTP y PouchDB/LevelDB real en disco, con operación idempotente,
proyección, reapertura y restauración local. Guía: `manuales/33-aplicacion-integral-neutral.md`.
No acredita producción, replicación ni conformidad con la API normativa global.
Su estado local y límites se registran en `editorial/c8/status.json`.
C9 consolida el recorrido de Toolkit, tutorial, referencia, decisión del agregado C8
y procedimiento de recuperación; comprueba simulación, conflictos y código generado.
El estado y los límites se registran en `editorial/c9/status.json`.
C10 integra rutas de lectura, búsqueda, repasos, navegación y código legible en libro
y web. Su revisión local y límites están en `editorial/c10/status.json` y la auditoría
`editorial/c10/AUDITORIA-C10.md`. No acredita comprensión ni accesibilidad con personas.
C12 inicia la separación de CI pública y validación con referencias; su auditoría
está en `editorial/c12/AUDITORIA-C12.md`. Permanece parcial hasta observar ejecución
remota y construcción integral limpia. C11 y C13–C15 siguen pendientes.
Libro, web, manuales y aplicación deben cerrar
las brechas de uso; sus conteos no constituyen un porcentaje de calidad.

Esta secuencia C0–C15 no reemplaza los registros históricos R0–R10 ni las fases de
investigación 0–36. R9 conserva su doble construcción local aprobada, con referencias
externas al paquete. Esa aprobación técnica no demuestra comprensión por principiantes.
El ZIP RC2 del commit `cf59f07` permanece intacto y no incluye los cambios posteriores.

## Alcance congelado por fase

| Fase | Entrega requerida | Criterio de cierre |
|---|---|---|
| C0 | Inventario, matriz, brechas y alcance | Las 17 áreas quedan vinculadas a fuentes y criterios pendientes; no se infiere completitud |
| C1 | Ruta para principiantes | Entorno, instalación, carpetas, contrato, primera entrega y recuperación de errores con comandos reales |
| C2 | Datos desde cero | Diccionario legible y validable, atributos, claves físicas, nodos, catálogos, consultas y migración coherentes |
| C3 | Arquitectura y capas | Un caso evoluciona por pasos; cada archivo y dependencia tienen responsabilidad y prueba |
| C4 | Core y catálogo de patrones | Ejemplos completos, pruebas positivas y negativas, costos, alternativas y condiciones de no uso |
| C5 | API, experiencia, seguridad y privacidad | Flujo con interfaz, identidad, permisos, ámbito, errores y pruebas de rechazo; revisión accesible explícita |
| C6 | Calidad, rendimiento y operación | Defecto reproducible, corrección, medición, Functions, staging, promoción, respaldo y rollback verificables |
| C7 | Analítica e IA | Particiones sin fuga, procedencia, evaluación, abstención y herramientas sin autoridad implícita |
| C8 | Aplicación integral neutral | Mismo caso conectado a interfaz, API, motor documental real y operación; dobles separados de integración |
| C9 | Documentación y herramientas | Tutoriales, referencias, ADR, runbooks, comentarios y CLI congruentes; simulación con cero escrituras |
| C10 | Libro y web | Relato progresivo, búsqueda, ejercicios, código, ilustraciones, navegación y accesibilidad revisados |
| C11 | Maestro, especificación y artículo | Cada producto conserva su autoridad; afirmaciones, resultados, límites y referencias coinciden |
| C12 | Portabilidad y CI | Instalación y construcción reproducibles, acceso a referencias declarado y ejecución remota observada |
| C13 | Validación externa | Revisión independiente, lectura por principiantes, transferencia, réplica y doble cribado auténticos |
| C14 | Publicación candidata | Autorización, artefactos exactos, despliegue y comprobación pública contra el paquete |
| C15 | Decisión y mantenimiento de 1.0 | Hallazgos resueltos o bloqueantes; autorización humana y responsables de evolución |

## Orden de corrección

C1 incorpora la ruta [Tu primer proyecto](manuales/26-primer-proyecto-paso-a-paso.md),
simulación de generación sin efectos y contratos de ejecución para las diez primeras
lecciones. La copia nueva no instala paquetes externos de la aplicación y no es una
réplica independiente. La evaluación con principiantes continúa en C13.

C2 incorpora [Datos desde cero](manuales/27-datos-desde-cero.md): contrato local
alineado con el Dater, tabla de ocho claves (siete en v1 y una adición en v2),
catálogos por edición, nodos con responsabilidades y consulta acotada con índice
candidato. La transformación pura v1 a v2 conserva la entrada y exige una edición
explícita. Cinco instrucciones y nueve pruebas se verifican en una copia nueva.
No se confunde con el esquema 3 de referencia ni acredita índices desplegados,
migración de un motor remoto o comprensión con lectores.

C3 incorpora [un registro por capas](manuales/28-arquitectura-y-capas-paso-a-paso.md):
el mismo caso avanza de regla a caso de uso, puerto, controlador y composición.
El mapa de archivos declara responsabilidades y pruebas relacionadas. Dos variantes
locales prueban sustitución, no dos motores; el análisis estático usa la política
existente de fase 5 y prueba rechazos sin ejecutar las fuentes inválidas. Diez
instrucciones se comprueban en copia nueva. La comprensión de lectores sigue en C13.

Antes de ejecutar instrucciones de generación, debe resolverse C0-01: implementar
simulación sin efectos o rechazar la opción para generación. Pertenece a C9, pero es
prerrequisito de seguridad para los ejercicios de C1. No se espera hasta el final de C9.

C1 debe resolver primero las contradicciones de entidad y cantidad, los comandos sin
directorio y las metas inexistentes. C2 corrige diccionarios y sus referencias. C8 no
debe afirmar que una variable selecciona MongoDB mientras la composición siga fijando
memoria. C11 actualiza los estados científicos sin extrapolar evidencia interna.

## Regla de aceptación por área

Para cerrar un área se requieren explicación suficiente, ejemplo, procedimiento
ejecutable con directorio y prerrequisitos, resultado esperado, prueba pertinente,
representación en libro y web y revisión de tareas por lectores según el riesgo.
Una prueba global verde no reemplaza la prueba específica de la conducta enseñada.

El artículo no necesita convertirse en un tutorial de las 17 áreas: debe conservar
una contribución científica concreta. El maestro desarrolla su metodología, la norma
define obligaciones y el libro y la web enseñan. Ningún manual amplía la conformidad Core.

Cada cierre posterior identifica brecha, cambio, prueba, commit, limitación y revisión.
Modificar el alcance requiere nueva versión del plan y justificación; no se reescribe
la línea base C0 para aparentar que una brecha nunca existió.

## Actividades que requieren intervención humana o externa

No se automatizan identidades, consentimiento, independencia, comprensión de lectores,
accesibilidad con tecnologías de apoyo, doble cribado ni autorización de publicación.
Se pueden preparar materiales y analizar evidencias recibidas sin atribuir participación
humana a datos sintéticos o respuestas generadas.

## Reproducción de C0

```sh
node editorial/audit-c0.mjs --check
node --test replication/tests/c0-audit.test.mjs
make verificar COBRIA_SITE_ISOLATED=1
```

La comprobación C0 requiere historia Git con el commit congelado y no consulta la web.
Las sondas ya registradas no se sobrescriben ni se ejecutan dentro de esta comprobación.
Se conservan resultados locales y pendientes humanos por separado.
