# Roadmap de remediación y publicación de COBRIA 1.0

> **Antecedente conservado.** El plan operativo vigente desde la auditoría del 19 de
> octubre de 2026 es [Entrega pública EP0–EP12](ROADMAP-ENTREGA-PUBLICA-COBRIA.md).
> Los estados siguientes describen comprobaciones anteriores; no acreditan que el
> libro esté editorialmente terminado ni que el alojamiento sirva los archivos actuales.

**Versión del plan:** 1.0  
**Fecha de corte:** 17 de octubre de 2026
**Estado inicial:** `ecosistema-1.0.0-rc1`, candidata no estable  
**Alcance:** repositorio, especificación, evidencia, artículo, documento maestro, libro,
sitio, paquete de réplica y publicación  
**Relación normativa:** este roadmap no modifica COBRIA Core 1.0  
**Naturaleza:** propuesta independiente; no constituye certificación ni estándar oficial

## 1. Resultado buscado

El objetivo es producir una candidata `ecosistema-1.0.0-rc2` que pueda clonarse,
construirse, probarse, compararse con lo publicado y revisarse sin conocimiento privado
del autor. La promoción posterior a `ecosistema-1.0.0` permanecerá bloqueada hasta cerrar
las puertas humanas y externas declaradas en este documento.

El trabajo se considera terminado cuando existe una cadena comprobable:

```text
fuente canónica
  → construcción limpia
  → pruebas y auditorías
  → artefactos con huellas
  → publicación RC
  → verificación pública independiente
  → autorización humana de versión estable
```

## 2. Reglas de ejecución

1. No se crea la etiqueta estable durante las fases automáticas.
2. Un resultado generado no se presenta como validación humana.
3. Los artefactos públicos deben ser exactamente los artefactos manifestados.
4. Ninguna cifra editorial se actualiza manualmente si puede derivarse de una fuente.
5. Cada fase conserva evidencia, comando, commit, resultado y limitación.
6. Un fallo de una fase bloquea las fases que dependan de ella.
7. Core 1.0 permanece congelado; una corrección editorial no cambia sus contratos.

## 3. Resumen de fases

| Fase | Resultado | Tipo | Depende de |
|---|---|---|---|
| R0 | línea base y estado RC coherentes | automática/editorial | — |
| R1 | construcción limpia y CI completa | automática | R0 |
| R2 | licencias, procedencia y repositorio saneados | automática/editorial | R0 |
| R3 | especificación normativa publicable | técnica/editorial | R0–R2 |
| R4 | ejemplos reales, ejecutables y probados | técnica | R1, R3 |
| R5 | libro pedagógico final | editorial/visual | R3, R4 |
| R6 | sitio público unificado, seguro y accesible | técnica/editorial | R1–R5 |
| R7 | evidencia científica y análisis confirmatorio | experimental | R1, R3, R4 |
| R8 | artículo, maestro y corpus sincronizados | científica/editorial | R5–R7 |
| R9 | candidata RC2 reproducible y publicada | automática/humana | R0–R8 |
| R10 | validación externa y decisión sobre 1.0.0 | humana/externa | R9 |

### Estado de ejecución

| Fase | Estado | Evidencia | Pendiente |
|---|---|---|---|
| R0 | implementada y consolidada localmente | identidad canónica RC2, manifiesto, libro, sitio e inventario sincronizados | desplegar derivados públicos solo con autorización |
| R1 | doble construcción local aprobada; CI preparada sin ejecución remota verificada | `make verificar-publicacion`, fases 2–36 y pruebas aprobadas en dos clones | configurar acceso autorizado a referencias, subir si se autoriza y observar una ejecución verde de GitHub Actions |
| R2 | implementada y verificada localmente | licencias multiclase, procedencia con SHA-256, archivo histórico y eliminación del andamiaje SQLite/D1 del sitio | completar metadatos y publicación remotos cuando exista autorización |
| R3 | implementada y verificada localmente | especificación normativa, 18 requisitos identificados, perfiles C1–C3, trazabilidad generada y compuerta `make verificar-especificacion` | someter el contenido a revisión externa en R10 |
| R4 | implementada y verificada localmente | referencia TypeScript para 30 patrones, 60 casos de comportamiento y ejemplos seleccionados comprobados en Python, Java y Go | someter pedagogía y API a revisión externa en R10 |
| R5 | implementada y verificada localmente | libro progresivo, rutas por rol, nueve aperturas de familia, ejercicios con solución, código enlazado y alternativa HTML accesible | lectura externa auténtica |
| R6 | funcional local; seguridad conocida mitigada por sustitución acotada | RC2 del 17 de octubre: cero avisos conocidos en la auditoría del sitio, adaptador glob con 13 pruebas, 2 pruebas de mapas de depuración y 11 pruebas web; 139 rutas verificadas | mantener la compatibilidad, desplegar solo con autorización y revisar accesibilidad externamente |
| R7 | compuerta automática implementada y verificada localmente | protocolo congelado, 270 observaciones distribuidas, 630 comparaciones algorítmicas, estadística y límites regenerables | réplica externa, transferencia y doble cribado permanecen abiertos para R10 |
| R8 | implementada y verificada localmente | sincronización R7 entre artículo, maestro, libro y sitio; cifras con fuente y límites | revisión editorial externa en R10 |
| R9 | doble construcción local e integridad aprobadas; publicación pendiente | `review/RC2-LOCAL-2026-10-17.json`: commit `cf59f07`, seis PDF, comparación aprobada, ZIP verificado y manifiesto de réplica de 412 archivos | ejecutar CI con referencias autorizadas; push, despliegue y GitHub Release requieren autorización; la reproducción local no acredita réplica externa |
| R10 | pendiente externa | protocolo y criterios definidos | revisión, transferencia, réplica y decisión humana auténticas |

## 4. Fases detalladas

### R0. Congelar la línea base y corregir el estado público

**Objetivo:** eliminar la contradicción entre “estable”, `1.0.0` y `rc1`.

**Trabajo:**

- declarar `ecosistema-1.0.0-rc1` como estado vigente en manifiesto, sitio, libro,
  metadatos, recursos y datos estructurados;
- reservar `ecosistema-1.0.0` para la futura promoción estable;
- inventariar fuentes canónicas, generados, archivos históricos y descargas públicas;
- registrar commit, tamaños y SHA-256 de la línea base;
- marcar como históricos los PDF que no forman parte de la distribución canónica.

**Entregables:** registro de versión, inventario, matriz fuente–derivado y declaración
única de estado.

**Puerta R0:** una búsqueda global no encuentra productos públicos que presenten la
candidata como estable o certificada.

### R1. Construcción limpia, pruebas y CI

**Objetivo:** hacer que un clon nuevo ejecute la misma verificación que el entorno local.

**Trabajo:**

- corregir la ruta duplicada del trabajo `package-integrity`;
- incorporar a CI las fases 19–36 y los cierres 0–18;
- crear una meta única `make verificar-publicacion` para la candidata local y reservar
  `make verificar-publicacion-publica` para etiquetas y artefactos ya comprometidos;
- construir PDFs, sitio, paquete y manifiestos desde un clon limpio;
- impedir que un gate dependa de archivos ignorados producidos previamente;
- conservar logs y resultados como artefactos de CI;
- diagnosticar el fallo de arranque actual de GitHub Actions.

**Comando meta esperado:**

```bash
make verificar-publicacion
```

**Puerta R1:** la compuerta local termina correctamente y la definición de GitHub Actions
ejecuta el mismo comando desde un checkout limpio. El resultado del servidor solo puede
confirmarse después de confirmar y subir estos cambios; no se infiere desde la ejecución
local.

### R2. Licencias, procedencia y saneamiento del repositorio

**Objetivo:** hacer inequívoco qué puede usarse, modificarse y publicarse.

**Trabajo:**

- añadir licencias raíz reconocibles para código y contenido, manteniendo clara la
  naturaleza multilicencia;
- crear un inventario de ilustraciones, fuentes, datos y recursos con procedencia;
- retirar del paquete público todo recurso sin derecho o procedencia demostrable;
- actualizar el `CITATION.cff` incluido en los paquetes;
- eliminar referencias activas a SQLite, PostgreSQL, MIT y enlaces pendientes cuando
  pertenezcan a metadatos obsoletos, conservándolas solo en archivo histórico;
- mover PDF y paquetes antiguos fuera de las rutas canónicas;
- completar descripción, sitio, temas y metadatos del repositorio GitHub.

**Puerta R2:** una persona puede determinar la licencia y procedencia de cada clase de
artefacto sin inferencias ni contradicciones.

### R3. Especificación normativa completa

**Objetivo:** sustituir el resumen de tres páginas por un documento normativo utilizable.

**Contenido mínimo:**

- alcance, audiencia y vocabulario normativo;
- modelo conceptual y términos canónicos;
- invariantes, precondiciones y poscondiciones;
- estados y transiciones de una proyección;
- requisitos identificados y niveles C1, C2 y C3;
- reglas de autoridad, ámbito, revisión, procedencia, equivalencia, publicación y retiro;
- criterios de conformidad y relación con pruebas ejecutables;
- compatibilidad, versionado, migración y extensiones;
- ejemplos conformes, no conformes y límites;
- matriz requisito–implementación–prueba–resultado–amenaza.

**Puerta R3:** cada obligación normativa tiene identificador, prueba o método de
inspección y referencia resoluble. El PDF y las fuentes publicadas representan el mismo
contenido.

### R4. Ejemplos prácticos reales y conformidad multilenguaje

**Objetivo:** reemplazar plantillas ilustrativas por ejemplos pedagógicos que implementen
el comportamiento de cada patrón.

**Estrategia:**

1. crear primero una implementación de referencia completa en TypeScript;
2. seleccionar patrones representativos para Python, Java y Go;
3. ampliar lenguajes solamente cuando exista compilación y prueba en CI;
4. evitar cuatro traducciones superficiales que no enseñen el patrón.

Cada ejemplo debe incluir problema ingenuo, solución, contrato, código ejecutable,
prueba positiva, prueba negativa, costo y condición para no usarlo.

**Puerta R4:** todo código publicado compila o se ejecuta automáticamente; ninguna ficha
utiliza tipos ausentes ni devuelve solamente el número del patrón como simulación de su
semántica.

### R5. Libro pedagógico final

**Objetivo:** convertir las fichas repetitivas en un libro progresivo y navegable.

**Trabajo:**

- organizar una ruta “desde cero” y rutas por rol;
- separar fundamentos, capas, patrones, datos, Core, seguridad, operación, IA y Build;
- crear una ilustración estructural específica por familia y diagramas específicos donde
  la relación no pueda explicarse bien solo con texto;
- reducir páginas repetidas y espacios vacíos;
- aumentar legibilidad del código y evitar cortes;
- añadir ejercicios, soluciones, decisiones y casos de fracaso;
- completar sinopsis, nota del autor, audiencia, cómo usar el libro, bibliografía y
  procedencia visual;
- producir un PDF etiquetado o una alternativa HTML accesible equivalente.

**Puerta R5:** revisión visual de todas las páginas, ejemplos ejecutables enlazados y
ninguna discrepancia de versión, título, licencia o estado.

**Estado local:** implementada. La edición principal reduce las fichas de seis a tres
páginas (concepto, decisión/práctica y código), añade nueve aperturas estructurales,
rutas desde cero y por rol, navegación semántica, enlaces a fuentes verificadas y una
declaración editorial única. `make verificar-r5` comprueba estos contratos; la lectura
externa continúa siendo una actividad humana posterior, no simulada.

### R6. Sitio público unificado

**Objetivo:** publicar una sola experiencia de COBRIA y eliminar la mezcla entre el
prototipo histórico y el ecosistema nuevo.

**Trabajo:**

- migrar o retirar las páginas heredadas;
- unificar marca, tipografía, navegación y vocabulario;
- mostrar versión, fecha, estado, autoridad, limitaciones y SHA-256 en Recursos;
- verificar que cada descarga coincide con el manifiesto;
- marcar archivo histórico con aviso visible y `noindex` cuando corresponda;
- ejecutar accesibilidad con axe, Lighthouse, teclado y tecnología de asistencia;
- añadir cabeceras CSP, HSTS, `X-Content-Type-Options`, política de referencia,
  permisos y protección de marcos según la plataforma;
- retirar dependencias y configuración SQLite no utilizadas;
- conservar buscador, relaciones, código copiable, prácticas, mapas y contexto para IA;
- probar diseño móvil, tablet, escritorio y movimiento reducido.

**Puerta R6:** construcción limpia, cero enlaces internos rotos, descargas con huellas
correctas, pruebas automáticas aprobadas y revisión manual de flujos críticos.

**Estado local:** implementada. La compuerta `make verificar-r6` reconstruye el sitio,
ejecuta lint y pruebas de renderizado, revisa dependencias, verifica las seis descargas
contra su manifiesto y confirma que las rutas históricas no compiten con la aplicación.
La revisión asistida por una persona usuaria de tecnología de apoyo continúa declarada
como validación externa y no se simula.

### R7. Evidencia científica confirmatoria

**Objetivo:** separar la utilidad demostrada de la promesa todavía no comprobada.

**Trabajo automático o experimental autorizado:**

- completar MongoDB, CouchDB y OpenSearch en condiciones reproducibles;
- documentar calentamiento, aleatorización, aislamiento y orden de corridas;
- medir p50, p95, p99, dispersión, intervalos, tamaños de efecto, CPU, memoria,
  almacenamiento, amplificación y recuperación;
- comparar contra documento único, índice, vista materializada, CQRS, eventos y
  proyección sin contratos COBRIA;
- regenerar tablas y gráficos desde resultados inmutables;
- publicar resultados negativos y límites.

**Trabajo humano pendiente:** doble cribado bibliográfico, estudio de transferencia y
réplica externa independiente.

**Puerta R7 automática:** resultados internos reproducibles y afirmaciones limitadas a
lo observado. **Puerta externa:** permanece abierta hasta recibir evidencia auténtica.

**Estado local:** compuerta automática cerrada. MongoDB, CouchDB y OpenSearch 3.2.0
aportan 90 observaciones válidas cada uno, con 30 repeticiones para `n=100`, `n=1000`
y `n=5000`. OpenSearch se ejecutó sobre ARM nativo después de aislar el fallo observado
en el entorno x86 emulado. Las 630 observaciones de alternativas siguen clasificadas
como microcomparación algorítmica, no como superioridad arquitectónica. El informe
registra como no concluyente OpenSearch con `n=100`. La revisión independiente, el
estudio de transferencia, el doble cribado y la réplica externa no se consideran
completados por esta fase.

### R8. Sincronización científica y editorial

**Objetivo:** actualizar todos los productos desde una sola fuente de afirmaciones.

**Trabajo:**

- ampliar y cerrar la revisión de literatura según su estado real;
- actualizar artículo y conclusiones exclusivamente con resultados reproducibles;
- mantener la especificación normativa sin narrativa experimental;
- mantener el artículo centrado en contribución, método, resultados y amenazas;
- mantener el documento maestro como desarrollo completo;
- mantener el libro como producto pedagógico;
- generar automáticamente cifras, versiones, estados, tablas y referencias comunes.

**Puerta R8:** ninguna cifra o afirmación cuantitativa publicada carece de fuente,
configuración, huella y clasificación de evidencia.

**Estado local:** compuerta automática cerrada. El sincronizador editorial deriva una
fuente R7 común para artículo, documento maestro, libro y sitio; publica versiones,
configuración, huellas y las nueve comparaciones pareadas. OpenSearch con `n=100`
permanece visible como resultado no concluyente. La especificación normativa no incorpora
conclusiones experimentales. Las puertas humanas de réplica externa, transferencia y
doble cribado continúan abiertas.

### R9. Construcción y publicación de `ecosistema-1.0.0-rc2`

**Objetivo:** producir una candidata pública completa sin declararla estable.

**Trabajo:**

- construir desde un clon limpio del commit candidato;
- generar ZIP, seis productos PDF, sitio, SBOM, manifiesto y `SHA256SUMS`;
- ejecutar dos construcciones independientes y comparar resultados;
- ejecutar el gate contra la URL pública, no solo contra el código fuente;
- comprobar cabeceras, versión, hashes, accesibilidad y rutas;
- crear una GitHub Release RC2 con todos los artefactos;
- registrar instrucciones exactas de reproducción y problemas conocidos.

**Puerta R9:** GitHub Release existente, CI verde, todos los artefactos descargables,
huellas públicas coincidentes y cero bloqueadores automáticos conocidos.

**Estado local:** automatización implementada. `make construir-rc2` exige un árbol limpio,
crea dos clones del mismo commit y prepara el paquete; `make verificar-r9` comprueba su
integridad. `make verificar-r9-publica` se reserva para después del despliegue. La fase
no se declara cerrada hasta que una persona autorizada publique la release y la puerta
pública confirme versión y huellas.

**Actualización del 17 de octubre:** dos clones limpios del commit `cf59f07` superaron
la puerta integral y produjeron una comparación aprobada. El registro automático está
en `review/RC2-LOCAL-2026-10-17.json`. Se utilizaron referencias locales explícitas:
el paquete no es autónomo respecto a los repositorios observados. GitHub Actions está
preparado para obtenerlos con acceso de solo lectura; no existe una ejecución remota
confirmada por este registro. La configuración posterior no se atribuye al ZIP anterior.

### R10. Validación externa y decisión de versión estable

**Objetivo:** determinar si RC2 puede promoverse sin exagerar su evidencia.

**Requiere personas o servicios externos auténticos:**

- dos revisiones técnicas/editoriales independientes;
- doble cribado bibliográfico;
- estudio de transferencia con consentimiento apropiado;
- réplica del paquete en otra computadora y por otra persona;
- adjudicación documentada de desacuerdos;
- autorización expresa del responsable del proyecto;
- depósito, firma o DOI únicamente si se decide utilizarlos.

**Puerta R10:** la evidencia conserva identidad o seudónimo gobernado, fecha, conflicto
de interés, consentimiento aplicable, artefacto revisado y declaración de independencia.
Una autodeclaración JSON aislada no basta para cerrar esta fase.

## 5. Compuerta maestra propuesta

La futura orden `make verificar-publicacion` debe verificar al menos:

```text
estado y versión coherentes
licencias y procedencia
árbol Git limpio
pruebas fases 2–36
cierres 0–18
compilación de ejemplos
construcción de PDF y sitio
accesibilidad automática
dependencias y SBOM
manifiesto y SHA-256
dos construcciones comparables
descargas públicas exactas
estado de GitHub Actions
estado de GitHub Release
puertas humanas separadas
```

La salida debe distinguir `failed`, `prepared`, `executed`, `externally-validated` y
`stable-authorized`. Ningún estado se infiere de la mera existencia de un archivo.

## 6. Definición de terminado para COBRIA 1.0

COBRIA 1.0 solo puede presentarse como estable cuando:

- R0–R9 están cerradas sin fallos automáticos;
- R10 posee evidencia externa auténtica y suficiente;
- todos los PDF y descargas coinciden con el manifiesto publicado;
- el artículo distingue resultados internos, históricos y externos;
- libro y sitio utilizan ejemplos ejecutables y pedagógicamente revisados;
- el repositorio posee release, licencias, cita, historial y reproducción comprobables;
- una persona autorizada aprueba explícitamente la promoción.

Hasta entonces, la denominación correcta es **COBRIA Ecosistema 1.0.0-rcN, propuesta
independiente y candidata no estable**.
