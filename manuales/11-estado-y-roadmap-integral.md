# Estado actual y roadmap integral de COBRIA

**Corte:** 20 de septiembre de 2026  
**Repositorio canónico:** <https://github.com/billy-una/cobria>  
**`main` observado:** `0c2b747`  
**Rama de endurecimiento:** `hardening-phase-0-1` (`9eaeb22`)

## Propósito

COBRIA evoluciona de una arquitectura NoSQL verificable a un manual integral para
aprender, construir, probar, asegurar, desplegar, operar y evolucionar software. El
ecosistema incluye Core, Manifesto, Build, Layers, Pattern Design, Data,
Documentation, Quality, Security, Cloud, Operations, API/UX, Performance,
Analytics & AI, Evidence, AI Development y Templates.

Se distinguen tres estados:

- **documentado:** existe una explicación revisable;
- **implementado:** existe código o configuración;
- **cerrado:** se superó el gate y se conservó evidencia verificable.

## Estado actual

| Área | Estado | Brecha principal |
|---|---|---|
| Core NoSQL | sólido y ejecutable localmente | integrar endurecimiento y repetir confirmatorios |
| Artículo y documento maestro | avanzados | actualizar solo con evidencia vigente |
| Libro | avanzado | sincronizarlo con el ecosistema ampliado |
| Sitio | prototipo avanzado en repo separado | incorporar el manual completo y construcción limpia |
| Patrones, capas y datos | documentación inicial | fichas uniformes y fuentes canónicas validables |
| Seguridad | contrato defensivo y ejemplo ejecutable | controles productivos y pruebas externas |
| Cloud y staging | contrato, plantilla y gates reproducibles | piloto en proveedor autorizado |
| Calidad y operación | matriz, telemetría y evidencia ejecutables | línea base y humo productivo |
| Analítica e IA | prototipo verificable | evaluación humana y escenarios externos |
| Transferencia científica | instrumentada | revisión, participantes y réplica externa |

## Roadmap por fases

### Fase 0 — Inventario, procedencia y alcance

Congelar qué se observó y con qué límites. Inventariar COBRIA, BSHandball, CRMHotel,
POS Guápiles y BIOSVA con URL, commit, archivo, licencia,
patrón y grado de generalización.

**Entregables:** inventario, mapa de evidencia, declaración de originalidad y material
histórico separado. **Gate:** ninguna afirmación importante carece de fuente o
clasificación. **Estado:** avanzado; faltan SHA completos congelados.

### Fase 1 — Manifiesto, vocabulario y límites

Consolidar principios, glosario, términos canónicos, niveles de obligación y relación
entre las partes de COBRIA. **Entregables:** `MANIFESTO.md`, glosario, mapa del
ecosistema y ADR de alcance. **Gate:** especificación, artículo, maestro, libro, sitio y
código no se contradicen. **Estado:** implementado y documentado; la propagación y
comprobación editorial integral se ejecutará en la fase 17 antes de declararlo cerrado.

### Fase 2 — Requisitos, actores y decisiones

Crear actores, historias, casos de uso, requisitos funcionales/no funcionales, criterios
de aceptación y ADR. **Gate:** no existe componente obligatorio sin requisito ni
requisito sin aceptación. **Estado:** implementado y documentado; la ejecución de los
gates especializados continúa en las fases 3–18.

### Fase 3 — Diccionarios y contratos de datos

Modelar niveles conceptual, lógico y físico; identidad, ámbito, tiempo, unidades,
sensibilidad, retención, catálogos, índices, migraciones y claves compactas `n8`, `a`,
`b`, `c`. **Entregables:** diccionario Markdown/YAML y casos válidos e inválidos.
**Gate:** cada clave física tiene significado, regla, procedencia, versión y responsable.
**Estado:** implementado y documentado con fuente canónica validable y caso neutral;
extensión a nodos y agregados continúa en la fase 4.

### Fase 4 — Nodos, agregados y almacenamiento NoSQL

Definir cuándo anidar, separar, referenciar, indexar o proyectar; documentar nodos
`nX/snX/lX`, cardinalidad, crecimiento, ciclo de vida, atomicidad, consultas y costos.
**Gate:** ningún nodo o derivado existe sin necesidad, dueño, regla, índice y prueba.
**Estado:** implementado y documentado mediante topología neutral validable; garantías
específicas de motores y mediciones de carga continúan en fases posteriores.

### Fase 5 — Arquitectura, capas y repositorio

Formalizar presentación, aplicación, dominio, puertos, adaptadores, datos,
infraestructura y composición; Daters, servicios, casos de uso, controladores y reglas de
importación. **Entregables:** manual de capas, árbol recomendado y ficha por archivo.
**Gate:** dominio/aplicación no dependen de UI, rutas físicas o SDK. **Estado:**
implementado y documentado en el ejemplo neutral; auditorías multilenguaje y adopción en
proyectos externos continúan pendientes.

### Fase 6 — Documentación, comentarios y lenguaje

Definir README, ADR, diagramas, API, eventos, runbooks, comentarios, docstrings, errores,
deuda trazable, i18n, fechas, monedas, zonas y unidades. **Gate:** los comentarios
explican por qué; cada documento tiene responsable, versión y vigencia; los textos no
están incrustados en lógica. **Estado:** implementado y documentado en fuentes canónicas
y ejemplo neutral; propagación a todo producto histórico continúa en fase 17.

### Fase 7 — Seguridad, privacidad y suministro

Cubrir amenazas, capacidades, aislamiento, reglas por nodo, secretos, App Check,
webhooks, abuso, privacidad, retención, dependencias, SBOM e incidentes. **Gate:** cada
operación sensible declara actor, capacidad, ámbito, finalidad, auditoría y caso negativo
ejecutado. **Estado:** cerrado para el contrato y el ejemplo neutral; los controles del
proveedor, pruebas distribuidas y ejercicios humanos continúan como validación externa.

### Fase 8 — Ambientes, staging, cloud y entrega

Separar local, test, preview, staging, producción y recuperación; proyectos/aliases de
Firebase; Functions, eventos, workers, colas, reintentos, idempotencia, dead-letter,
regiones, cuotas, CI/CD, promoción, humo, rollback y recuperación.

**Entregables:** manual de ambientes, inventario desplegable, plantilla de Function,
pipeline `preview → staging → producción`, checklist y runbook. **Gate:** el pipeline
valida destino, cuenta, rama, variables, reglas, pruebas, artefacto y rollback; staging no
usa datos personales de producción. **Estado:** cerrado para contrato y simulación;
despliegue, humo y rollback reales requieren cuentas e identidades autorizadas.

### Fase 9 — Calidad, pruebas y observabilidad

Unificar pruebas unitarias, contrato, integración, emuladores, motores reales, E2E,
accesibilidad, seguridad, rendimiento, resiliencia, migraciones y humo; logs, métricas,
trazas, SLO y alertas. **Gate:** cada requisito posee prueba y cada despliegue produce
evidencia. **Estado:** cerrado para contrato, instrumentación neutral y evidencia de gate;
E2E, accesibilidad y humo reales permanecen explícitamente pendientes.

### Fase 10 — API, integración, UX y accesibilidad

Formalizar APIs, eventos, paginación, errores, webhooks, timeouts, reintentos,
compatibilidad, formularios, estados, responsive, accesibilidad e i18n. **Gate:** entradas,
salidas, errores, compatibilidad y accesibilidad se prueban. **Estado:** cerrado para
contratos y controles automáticos; tecnologías de asistencia y personas siguen pendientes.

### Fase 11 — Manifiestos legibles por máquinas

Crear `project.yaml`, `architecture.yaml`, `data-dictionary.yaml`, `nodes.yaml`,
`functions.yaml`, `security.yaml`, `quality.yaml`, `environments.yaml` y
`traceability.yaml`. **Gate:** cada concepto tiene ID, fuente, versión, responsable y
referencias resolubles. **Estado:** implementado mediante generación determinista y gate
de procedencia, unicidad, vigencia y resolución de enlaces.

### Fase 12 — Esquemas, CLI y validadores

Crear JSON Schema y una CLI con `init`, `validar`, `explicar`, `contexto`, `impacto`,
`auditar`, `medir` y `verificar`. **Gate:** instalación limpia, ayuda en español, códigos
estables, salida humana/JSON y casos positivos/negativos. **Estado:** implementado con
diez esquemas, ocho comandos, paquete verificable y pruebas positivas/negativas.

### Fase 13 — Generadores y plantillas

Generar de forma idempotente proyecto, módulo, entidad, valor, caso de uso, puerto,
adaptador, Dater, nodo, catálogo, Function, evento, ADR, prueba y runbook. **Gate:** cada
generación añade código, prueba, documento y manifiesto sin sobrescribir. **Estado:**
implementado para quince tipos, con gramática segura, preflight, idempotencia y conflictos.

### Fase 14 — Auditor automático e impacto

Detectar imports prohibidos, claves físicas fuera del Dater, acceso directo a proveedores,
Functions sin límites, catálogos sin versión, permisos excesivos y requisitos sin prueba.
**Gate:** fixtures positivos/negativos demuestran cada regla y documentan falsos positivos.
**Estado:** implementado con siete reglas explicables, fixtures positivos/negativos,
salida JSON, remediación por hallazgo y análisis de importadores directos. El análisis
transitivo y la cobertura multilenguaje continúan como evolución posterior.

### Fase 15 — Rendimiento, costo y sostenibilidad

Medir carga, presupuesto, p50/p95/p99, CPU, memoria, red, almacenamiento, amplificación,
recuperación, energía y costo; comparar documento, índice, caché, vista, CQRS, eventos y
proyección simple. **Gate:** cada recomendación registra línea base, beneficio, regresión y
costo. **Estado:** implementado para comparación algorítmica local con siete alternativas,
630 observaciones, p50/p95/p99, MAD/IQR, recursos, amplificación y presupuestos. Red,
facturación, energía medida y cargas distribuidas permanecen como validación externa.

### Fase 16 — Contexto y límites para agentes de IA

Crear `AGENTS.md` raíz/por módulo, mapas de flujo, comandos autorizados, archivos
protegidos, riesgos, datos, pruebas y criterios de aceptación. **Gate:** un agente nuevo
explica e implementa un cambio acotado sin confundir clave física, dominio, ambiente o
autoridad. **Estado:** implementado con seis instrucciones jerárquicas, política legible
por máquinas, cinco invariantes, rutas protegidas, contrato de cambio, contexto portátil
y fixtures de aceptación/rechazo. La transferencia independiente se evalúa en fase 18.

### Fase 17 — Ecosistema editorial y sitio

Sincronizar especificación normativa, artículo, documento maestro, libro pedagógico,
sitio interactivo, ejemplos y recursos desde fuentes canónicas. **Gate:** una modificación
canónica actualiza derivados y no introduce cifras sin evidencia. **Estado:** implementado
con registro de cinco productos, identidad y afirmaciones canónicas, cinco derivados,
control de desincronización y consumo directo desde LaTeX, libro y sitio. La revisión
visual y académica permanece humana.

### Fase 18 — Conformidad, transferencia y publicación externa

Ejecutar réplica confirmatoria, revisión independiente, estudio humano, transferencia,
comparación industrial, release firmado, archivo público y DOI cuando proceda. **Gate:**
terceros comprenden, implementan, ejecutan y critican COBRIA sin asistencia del autor.
**Estado:** preparación técnica cerrada con protocolos, esquemas de captura, fuente ciega,
paquete verificable y control contra evidencia externa simulada. La fase permanece
`prepared-not-externally-validated`: revisión, doble cribado, participantes, réplica,
licencia, firma y DOI requieren personas o servicios externos auténticos.

### Fase 19 — COBRIA Engineering

Convertir las prácticas transversales de construcción y operación en contratos neutrales:
estado operativo explícito, autoridad transaccional, cola fuera de línea gobernada,
promoción ligada al artefacto, telemetría privada, optimización con presupuesto, retiro
verificable de legado e incidentes como conocimiento.

**Entregables:** ocho contratos `ENG-001..ENG-008`, catálogo legible por máquinas,
procedencia congelada de POS Guápiles, modelo de adopción, manual, página web, capítulo
pedagógico y gate automático. **Gate:** cada patrón declara problema, contrato, evidencia,
costo, retiro y responsable; Core 1.0 permanece intacto. **Estado:** implementado y
verificable localmente; infraestructura real, rollback, transferencia y revisión humana
continúan pendientes.

### Fase 20 — Laboratorio COBRIA Engineering

Convertir los ocho contratos Engineering en componentes neutrales ejecutables y casos
positivos/negativos. **Entregables:** laboratorio sin dependencias externas, trazabilidad,
nueve pruebas y gate propio. **Gate:** `make verificar-fase-20` ejecuta nueve pruebas y
cubre `ENG-001..ENG-008`. **Estado:** implementado y ejecutado localmente; no representa
infraestructura productiva ni sustituye validación humana.

### Fase 21 — Piloto de adopción COBRIA Engineering

Aplicar la rúbrica a la franja operativa de POS Guápiles sin modificar el proyecto.
**Entregables:** evaluador reproducible, commit y huellas congeladas, matriz de ocho
contratos, rúbrica y brechas. **Gate:** 8/8 contratos poseen evidencia estructural,
el checkout está limpio y cero se presentan como validados operacionalmente. **Estado:**
ejecutado como piloto estructural local sobre `303890830433f5019818a1b4fd696b9e33b45392`;
staging, producción, rollback, accesibilidad y transferencia humana no fueron evaluados.

### Fase 22 — Evaluación Engineering dirigida por manifiesto

Separar las reglas de adopción del motor de evaluación. Cada proyecto declara repositorio,
commit, alcance, responsables, evidencias y términos; el motor lee objetos Git sin ejecutar
el proyecto ni depender de su árbol actual. **Entregables:** esquema JSON, manifiesto de
referencia, motor genérico, CLI, informe y casos de seguridad. **Gate:** el motor no contiene
rutas de POS Guápiles, rechaza rutas inseguras, conserva los ocho contratos y reproduce
8/8 estructurales con cero afirmaciones operacionales. **Estado:** implementado y ejecutado
localmente; revisión semántica y transferencia a un segundo proyecto siguen pendientes.

### Fase 23 — Comparación de transferencia entre proyectos

Aplicar exactamente el mismo motor a POS Guápiles, CRMHotel y BSHandball mediante tres
manifiestos y commits congelados. **Entregables:** informes individuales, matriz por
contrato, comparación JSON, pruebas y gate reproducible. **Resultado:** 8/8, 5/8 y 4/8
evidencias estructurales, respectivamente, y cero validaciones operacionales. Las cifras
describen cobertura del manifiesto, no calidad ni madurez. **Estado:** implementado y
ejecutado localmente; quedan pendientes revisión semántica independiente y manifiestos
preparados por equipos externos.

### Fase 24 — Revisión semántica independiente

Someter las coincidencias estructurales a dos revisores humanos independientes mediante
tres muestras seudónimas. **Entregables:** paquete ciego con fragmentos, rúbrica de tres
decisiones, esquema de respuesta, declaración de conflictos, acuerdo bruto, kappa de Cohen
y protocolo de adjudicación. **Gate técnico:** tres paquetes con ocho contratos, huellas
reproducibles y ninguna respuesta precargada. **Estado:** preparación técnica terminada;
0/6 respuestas humanas, acuerdo y adjudicación pendientes. Revisores sintéticos solo se
permiten como fixtures de software y nunca como evidencia científica.

### Fase 25 — Calibración dimensional de evidencia

Transformar el desacuerdo de ENG-007 en una regla verificable. La evidencia se separa en
tres dimensiones obligatorias: frontera explícita, control automático contra crecimiento y
ruta de retiro. **Resultado:** POS Guápiles 3/3, CRMHotel 2/3 y BSHandball 3/3 sobre sus
commits congelados. **Estado:** implementado como evaluación estructural de la propuesta;
no constituye certificación, conformidad oficial ni validación operacional.

### Fase 26 — Rúbrica dimensional de Engineering

Generalizar la calibración a ENG-001..ENG-008. Cada contrato se descompone en tres
dimensiones conjuntivas con criterio observable y contraejemplo de evidencia insuficiente.
**Entregables:** catálogo de 24 dimensiones, plantilla vacía, generador, pruebas y gate.
**Estado:** implementado como instrumento de la propuesta; cero decisiones precargadas y
cero certificación oficial.

### Fase 27 — Expediente dimensional comparativo

Cruzar la rúbrica general con la evidencia candidata de POS Guápiles, CRMHotel y
BSHandball sin convertir coincidencias estructurales en cumplimiento. **Entregables:**
matriz reproducible de 3 proyectos, 24 contratos observados y 72 decisiones dimensionales,
con commit, ruta, huella y términos encontrados. **Gate:** todas las decisiones permanecen
`pending-semantic-review`, no existen rankings y las afirmaciones de certificación y
validación operacional son cero. **Estado:** implementado como cola de revisión de la
propuesta; su resolución requiere lectura semántica explícita y, cuando corresponda,
evidencia operacional externa.

### Fase 28 — Revisión dimensional ciega

Preparar dos formularios independientes sobre tres muestras seudónimas, ocho contratos y
tres dimensiones. **Entregables:** 144 juicios esperados, fragmentos con huellas,
instrucciones, protocolo, esquema de respuesta, clave de coordinación excluida y gate de
atestación. **Gate:** formularios sin respuestas, identidad ni atestaciones precargadas;
cero acuerdo, certificación o validación humana declarados. **Estado:** infraestructura
implementada y comprobada localmente; las respuestas auténticas requieren dos personas
independientes y no pueden sustituirse con simulaciones o agentes de IA.

### Fase 29 — Ingesta y acuerdo dimensional

Recibir sin modificar dos formularios auténticos, comprobar que contienen las mismas 72
dimensiones y calcular acuerdo observado y kappa de Cohen solo después de validar
atestación, independencia y conflicto. **Entregables:** requisitos trazables, motor de
pareo, registro de desacuerdos, informe reproducible, pruebas y gate. **Estado:** mecanismo
implementado como parte de una propuesta independiente; 0/2 respuestas recibidas, cero
pares y métricas nulas. El acuerdo real continúa pendiente de personas externas.

### Fase 30 — Adjudicación dimensional trazable

Preparar la resolución de los desacuerdos auténticos de la Fase 29 mediante una tercera
persona distinta del par original. **Entregables:** requisitos trazables, formulario,
esquema, motor que protege decisiones originales, informe, pruebas y gate. **Estado:**
mecanismo implementado como propuesta independiente; al existir 0/2 respuestas previas,
hay cero desacuerdos disponibles y cero adjudicaciones. Ningún agente de IA ni fixture se
presenta como adjudicador humano.

### Fase 31 — Validación operacional controlada

Preparar ensayos de promoción y rollback, reintento y dead-letter, telemetría privada,
reconstrucción equivalente y aislamiento de ámbito. **Entregables:** cinco hipótesis con
inyección, resultado, aborto y evidencia; plantilla vacía, requisitos, validador, pruebas y
gate. **Estado:** instrumento implementado como propuesta independiente; 0/5 escenarios
ejecutados, ningún ambiente autorizado utilizado y cero validación operacional. La corrida
auténtica requiere staging o ambiente controlado, cuenta, datos y responsable autorizados.

### Fase 32 — Repetición externa

Paquete de cinco tareas para otra persona y otra computadora. **Estado:** preparado; cero
repeticiones y atestaciones externas recibidas. No constituye certificación.

### Fase 33 — Síntesis científica condicionada

Integra evidencia local y conserva en estado pendiente revisión humana, operación y réplica
externa. **Estado:** síntesis provisional; efectos e intervalos externos permanecen nulos.

### Fase 34 — Sincronización editorial de cierre

Propaga un estado común a artículo, documento maestro, libro y sitio. **Estado:** cuatro
productos sincronizados sin promover pendientes a resultados validados.

### Fase 35 — Candidato reproducible local

Construye un manifiesto determinista con huellas de fuentes de cierre. **Estado:** candidato
local no firmado, no publicado y sin condición de release oficial.

### Fase 36 — Preparación de publicación

Expone bloqueadores de revisión, operación, réplica, firma y DOI. **Estado:** propuesta
preparada pero no publicada; el acto de publicación continúa bajo autoridad humana.

## Orden recomendado

```text
Procedencia → Manifiesto → Requisitos → Datos → Nodos → Capas
→ Documentación → Seguridad → Staging/Cloud → Calidad → API/UX
→ Manifiestos → CLI → Generadores → Auditor → Optimización
→ Contexto IA → Ecosistema editorial → Validación externa
→ Industrialización y operación verificable
```

## ChatGPT con GitHub y sin comandos

- Puede **cerrar razonablemente las fases 0–6**, sujeto a aprobación humana de dominio,
  privacidad y publicación.
- Puede **preparar las fases 7–11**, redactando controles, configuración, pipelines,
  planes, contratos y YAML; no puede demostrar que funcionan sin ejecución.
- Desde la **fase 12 se necesitan comandos** para instalar, validar, compilar, probar,
  analizar y medir. Escribir código en GitHub no equivale a verificarlo.
- La **fase 18 necesita personas o servicios externos**: una IA no sustituye revisión
  independiente, participantes, consentimiento, aprobación ética, firma o depósito.

**Respuesta breve:** ChatGPT–GitHub puede trabajar documentalmente hasta la fase 11,
pero sin comandos solo debería declarar cerradas, como máximo, las fases 0–6. Para cerrar
7–17 hacen falta herramientas y ambientes; para cerrar 18 hacen falta terceros.

## Próximo ciclo

1. Corregir y fusionar `hardening-phase-0-1`.
2. Congelar SHA completos de los repositorios de referencia.
3. Cerrar fases 0–2 y fijar el vocabulario canónico.
4. Convertir diccionarios, nodos, ambientes y Functions en manifiestos.
5. Implementar validación y CLI mínima.
6. Sincronizar libro, artículo, maestro y sitio.
7. Ejecutar evidencia confirmatoria y solicitar validación externa.
8. Aplicar COBRIA Engineering en un segundo proyecto y medir transferencia sin ayuda del autor.
