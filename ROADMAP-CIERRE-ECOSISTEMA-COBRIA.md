# Roadmap de cierre del ecosistema COBRIA

**Versión del plan:** 1.0  
**Fecha de corte:** 21 de septiembre de 2026  
**Estado:** plan de integración y publicación; no modifica COBRIA Core 1.0  
**Autor y responsable editorial:** Billy Jak Cordero Porras  
**Repositorio canónico:** <https://github.com/billy-una/cobria>

## 1. Resultado final buscado

COBRIA debe terminar como un **ecosistema abierto de patrones, manuales, contratos,
herramientas y evidencia para construir software**, comprensible por personas que están
aprendiendo, profesionales y agentes de inteligencia artificial.

No será solamente una arquitectura NoSQL ni una colección de documentos. Su promesa
pública será:

> COBRIA ayuda a convertir una necesidad en software comprensible, mantenible,
> verificable, seguro y operable mediante capas, patrones, contratos, datos, pruebas y
> decisiones explícitas.

COBRIA Core conservará una función precisa: ser la especialización normativa y
científica sobre autoridad, ámbito, revisión, procedencia y derivados reconstruibles en
sistemas documentales NoSQL. Los demás productos enseñarán a construir un proyecto
completo sin convertir cada recomendación en una obligación Core.

## 2. Las partes definitivas de COBRIA

| Producto | Pregunta que responde | Resultado mínimo |
|---|---|---|
| **COBRIA Manifesto** | ¿Qué principios gobiernan el método? | Principios, lenguaje, límites y regla de decisión |
| **COBRIA Fundamentos** | ¿Qué debe comprender una persona antes de diseñar? | Problema, requisito, dominio, datos, funciones, errores y pruebas |
| **COBRIA Layers** | ¿Dónde vive cada responsabilidad? | Capas, dependencias, puertos, adaptadores y composición |
| **COBRIA Pattern Design** | ¿Qué soluciones recurrentes pueden reutilizarse? | Catálogo de patrones, antipatrones, código y relaciones |
| **COBRIA Data** | ¿Cómo se modelan, guardan y evolucionan los datos? | Diccionario, catálogos, nodos, índices, consultas, migraciones y respaldo |
| **COBRIA Core** | ¿Qué contratos vuelven gobernables los derivados NoSQL? | Especificación C1–C3 y pruebas de conformidad |
| **COBRIA API & UX** | ¿Cómo se exponen capacidades y se diseñan interfaces utilizables? | Contratos, estados, accesibilidad, i18n y experiencia adaptable |
| **COBRIA Security** | ¿Cómo se protege cada flujo? | Identidad, autorización, ámbito, secretos, privacidad y suministro |
| **COBRIA Quality** | ¿Cómo se demuestra que el sistema funciona? | Estrategia de pruebas, gates, trazabilidad y definición de terminado |
| **COBRIA Performance** | ¿Cómo se optimiza sin crear complejidad injustificada? | Línea base, presupuestos, perfiles, costo total y reglas de decisión |
| **COBRIA Cloud & Operations** | ¿Cómo llega y permanece sano en producción? | Ambientes, Functions, despliegue, telemetría, respaldo y recuperación |
| **COBRIA Analytics & AI** | ¿Cómo se usan datos e IA con procedencia? | Conjuntos reproducibles, particiones, modelos, RAG, abstención y auditoría |
| **COBRIA Engineering** | ¿Cómo se coordinan las decisiones durante todo el ciclo? | Método operativo, ADR, evolución, resiliencia y costo |
| **COBRIA Build** | ¿Cómo se aplica todo en orden? | Proyecto neutral completo, incremental y ejecutable |
| **COBRIA Toolkit** | ¿Cómo se automatiza y verifica el método? | CLI, esquemas, generadores, auditor, informes y plantillas |
| **COBRIA Evidence** | ¿Qué afirmaciones están respaldadas y con qué límites? | Protocolos, resultados, amenazas, réplicas y trazabilidad |
| **COBRIA Knowledge** | ¿Cómo se estudia y comparte COBRIA? | Especificación, artículo, maestro, libro, sitio y recursos |

## 3. Reglas de integración

1. **Core no absorbe todo COBRIA.** Core conserva un alcance NoSQL normativo.
2. **Pattern Design es el centro pedagógico.** Los otros manuales enlazan patrones y
   explican cuándo usarlos, cuándo evitarlos y cómo probarlos.
3. **Layers asigna responsabilidades.** Un patrón no se coloca en una carpeta por su
   nombre, sino por la autoridad y dependencia que posee.
4. **Data enseña desde cero.** Incluye diccionario de datos, atributos físicos como
   `a`–`h`, nodos, catálogos, índices, migraciones y traducción mediante Daters.
5. **Build demuestra la integración.** Ningún manual se considera terminado si su
   contenido no aparece aplicado en el proyecto de referencia.
6. **Toolkit verifica, no inventa evidencia.** Automatiza contratos y produce informes;
   no convierte una propuesta en resultado ejecutado.
7. **Knowledge deriva de fuentes canónicas.** Libro, web y documentos no mantienen
   definiciones incompatibles.
8. **Cada práctica declara nivel de madurez:** propuesta, documentada, implementada,
   ejecutada, validada externamente o normativa.

## 4. Plantilla obligatoria de un patrón COBRIA

Cada patrón público contendrá:

1. nombre, familia y estado;
2. explicación sencilla en una frase;
3. problema observable y fuerzas en tensión;
4. ejemplo cotidiano inspirado en naturaleza o comunidad, sin convertir la analogía en
   requisito;
5. contexto, indicios de uso y condiciones para no usarlo;
6. participantes y responsabilidades por capa;
7. estructura y secuencia;
8. contrato de entrada, resultado, fallo e invariantes;
9. ejemplo neutral completo;
10. código práctico en los lenguajes donde aporte valor;
11. caso negativo o antipatrón;
12. pruebas mínimas y evidencia esperada;
13. seguridad, privacidad y límites de ámbito;
14. rendimiento, costo y operación;
15. migración, recuperación y retiro;
16. patrones relacionados;
17. ejercicio y solución comentada;
18. fuentes y procedencia conceptual.

## 5. Fases hasta la publicación final

Las fases siguientes sustituyen la secuencia editorial abierta de “seguir agregando
fases”. Cada una tiene una salida concreta y una puerta de cierre.

### Fase 0. Congelación y limpieza del estado actual

**Objetivo:** obtener una línea base reproducible antes de seguir editando.

**Trabajo:**

- inventariar archivos modificados, eliminados, generados y no versionados;
- separar fuente, construcción, evidencia, borrador, archivo histórico y publicación;
- decidir qué versiones antiguas se conservan fuera de la distribución pública;
- regenerar desde una copia limpia y registrar huellas;
- crear una rama de cierre editorial sin modificar Core 1.0.

**Entregables:** inventario de versión, mapa de fuentes canónicas, política de archivo y
estado Git reproducible.

**Puerta:** una persona puede clonar el repositorio y producir los mismos artefactos con
los comandos documentados.

### Fase 1. Identidad, taxonomía y arquitectura editorial

**Objetivo:** establecer una sola definición pública de COBRIA.

**Trabajo:**

- fijar nombre, subtítulo, promesa, audiencia y declaración de propuesta independiente;
- aprobar las partes enumeradas en este roadmap;
- definir la relación Manifesto → manuales → Core → evidencia → publicaciones;
- unificar vocabulario: objeto, Dater, repositorio, servicio, caso de uso, catálogo,
  índice, proyección y adaptador;
- establecer versiones separadas para Core y Ecosistema.

**Entregables:** mapa del ecosistema actualizado, glosario canónico, matriz de productos
y guía de estilo.

**Puerta:** libro, web, README, artículo y maestro usan la misma identidad y no llaman
“nuevo patrón universal” a una convención local.

### Fase 2. COBRIA Fundamentos y ruta por niveles

**Objetivo:** permitir que una persona no avanzada comprenda el resto del ecosistema.

**Trabajo:** explicar problema, requisito, dominio, objeto, dato, función, módulo,
dependencia, interfaz, almacenamiento, error, prueba, despliegue y deuda técnica.

**Entregables:** manual de fundamentos, ruta “empiezo desde cero”, glosario visual y
ejercicios progresivos.

**Puerta:** lectores principiantes completan un ejemplo pequeño sin necesitar conocer
Core ni los repositorios originales.

### Fase 3. COBRIA Layers y estructura de proyectos

**Objetivo:** convertir las capas en responsabilidades comprobables.

**Trabajo:**

- dominio, aplicación, datos/infraestructura, presentación y composición;
- estructura de carpetas y reglas de importación;
- Object, Dater, Service, UseCase, Catalog, Indexer, Connector y Registry;
- servicios de dominio frente a servicios de aplicación;
- puertos, adaptadores, fachadas de compatibilidad y límites del legado;
- comentarios, nombres, manejo de errores, tiempo, unidades e internacionalización.

**Entregables:** manual Layers, árbol de proyecto comentado, matrices de responsabilidad,
ejemplos correctos e incorrectos y reglas automatizadas de dependencia.

**Puerta:** el ejemplo de referencia demuestra la dirección de dependencias y el auditor
detecta al menos las violaciones principales.

### Fase 4. COBRIA Pattern Design como catálogo central

**Objetivo:** transformar la colección en un catálogo comparable con manuales modernos
de patrones, sin copiar texto, identidad visual ni ejemplos de otras obras.

**Familias:**

- creación y configuración;
- dominio y comportamiento;
- estructura y dependencias;
- persistencia y consulta;
- concurrencia y mensajería;
- interfaz y experiencia;
- seguridad y multiinquilinato;
- observabilidad y operación;
- analítica e inteligencia artificial.

**Entregables:** inventario canónico, taxonomía, relaciones, ficha completa por patrón,
antipatrones, código, pruebas y buscador por problema.

**Puerta:** todas las fichas cumplen la plantilla obligatoria, poseen fuentes y enlazan
las partes COBRIA que las desarrollan.

### Fase 5. COBRIA Data y Core

**Objetivo:** enseñar datos desde su definición hasta los contratos avanzados NoSQL.

**Trabajo:**

- diccionario de datos desde cero;
- significado, tipo, nulabilidad, unidad, rango, sensibilidad, propietario y vigencia;
- traducción de claves físicas `a`–`h` exclusivamente en Dater/adaptadores;
- catálogos cerrados, versionados y temporales;
- documentos, agregados, subdocumentos, referencias y partición de nodos;
- índices, paginación, caché, consistencia, transacciones y migraciones;
- respaldo probado mediante restauración;
- incorporación de Core C1–C3 como nivel avanzado;
- adaptadores de referencia para al menos dos motores NoSQL.

**Entregables:** manual Data, esquemas, ejemplos, diccionario completo, adaptadores y
conjunto de conformidad.

**Puerta:** `cobria verificar --adaptador ...` genera un informe legible y JSON con el
nivel alcanzado, sin declarar certificación externa.

### Fase 6. COBRIA API & UX

**Objetivo:** enseñar la frontera visible y contractual del software.

**Trabajo:** contratos HTTP/eventos, validación, errores, idempotencia, paginación,
estados de carga/vacío/error/éxito, formularios, modales, accesibilidad, diseño adaptable,
i18n, fechas, números, unidades y degradación offline.

**Entregables:** manual, componentes accesibles de referencia, contratos y pruebas E2E.

**Puerta:** teclado, lector de pantalla, contraste, tamaños móviles y casos negativos
superan la matriz de aceptación.

### Fase 7. COBRIA Security

**Objetivo:** integrar seguridad y privacidad en el flujo, no como apéndice.

**Trabajo:** modelo de amenazas, identidad, autorización, capacidades, ámbito obligatorio,
fallo cerrado, secretos, validación, registros sanitizados, cifrado, dependencias,
Functions públicas, rate limiting, privacidad, retención e incidentes.

**Entregables:** manual Security, checklist por capa, ejemplos de abuso, SBOM, política
de divulgación y pruebas negativas.

**Puerta:** ninguna operación sensible carece de actor, capacidad, ámbito, finalidad y
evidencia; el análisis de dependencias no presenta vulnerabilidades críticas conocidas.

### Fase 8. COBRIA Quality y Performance

**Objetivo:** demostrar corrección y optimizar a partir de mediciones.

**Trabajo:** pirámide de pruebas, contratos, integración, concurrencia, mutación, E2E,
rendimiento, perfiles, p50/p95/p99, intervalos, tamaños de efecto, CPU, memoria,
almacenamiento, amplificación de escritura y costo de mantenimiento.

**Entregables:** manual Quality/Performance, gates locales, presupuestos, informes y
comparaciones contra alternativas simples.

**Puerta:** cada afirmación cuantitativa enlaza configuración, commit, resultado,
amenaza y documento; optimizar significa mejorar una métrica sin ocultar su costo.

### Fase 9. COBRIA Cloud & Operations

**Objetivo:** completar el trayecto desde desarrollo hasta operación y retiro.

**Trabajo:** ambientes local/dev/staging/producción, configuración, secretos, Firebase
staging o equivalente, Cloud Functions, CI/CD, migración, despliegue gradual, rollback,
observabilidad, SLO, alertas, colas, reintentos, dead-letter, respaldo, restauración,
incidentes, costos y retiro.

**Entregables:** manual Operations, proyecto de staging, runbooks, tableros y simulacros.

**Puerta:** un despliegue de prueba puede observarse, degradarse, recuperarse y retirarse
sin usar secretos ni datos de producción en la documentación pública.

### Fase 10. COBRIA Analytics & AI

**Objetivo:** convertir datos operativos en analítica e IA explicables.

**Trabajo:** procedencia, consentimiento, conjuntos reproducibles, tiempo válido y
conocido, particiones sin fuga, características versionadas, registro de modelos,
evaluación, deriva, RAG limitado por ámbito, citas, herramientas con capacidades mínimas,
abstención, revisión humana y auditoría narrativa.

**Entregables:** manual AI & Analytics, tubería neutral, manifiestos y evaluación con
casos de abstención.

**Puerta:** ninguna salida de IA adquiere autoridad de escritura y todo resultado puede
rastrearse hasta entradas, versión, transformación y política.

### Fase 11. COBRIA Build y aplicación de referencia

**Objetivo:** demostrar el ecosistema completo en un proyecto neutral y amigable.

**Proyecto:** sistema comunitario de observaciones ambientales inspirado en Coto Brus,
sin nombres, reglas ni datos privados de los sistemas usados como referencia.

**Recorrido:** necesidad → requisitos → dominio → capas → persistencia → interfaz →
seguridad → índices/proyecciones → pruebas → staging → operación → analítica/IA → retiro.

**Entregables:** repositorio ejecutable, capítulos guiados, commits o hitos didácticos,
ejercicios, soluciones y pruebas.

**Puerta:** una persona o agente puede construirlo desde cero siguiendo solamente la
documentación publicada y obtiene los resultados esperados.

### Fase 12. COBRIA Toolkit para humanos e IA

**Objetivo:** volver ejecutables las reglas repetibles del ecosistema.

**Trabajo:** CLI, esquemas, generadores idempotentes, plantillas, contexto para agentes,
auditor estático explicable, informes HTML/JSON, trazabilidad y modo de simulación.

**Comandos meta:**

```text
cobria iniciar
cobria contexto
cobria generar diccionario
cobria generar modulo
cobria auditar
cobria verificar
cobria explicar
cobria publicar --simular
```

**Entregables:** paquete instalable, documentación, ejemplos y pruebas de compatibilidad.

**Puerta:** ningún comando destructivo opera sin objetivo validado y los informes separan
propuesta, implementación, ejecución y validación externa.

### Fase 13. Evidencia científica y transferencia

**Objetivo:** alinear la contribución científica con lo realmente observado.

**Trabajo:** repetir P1, P2, R1, S1 y A1; comparar alternativas; ejecutar infraestructura
realista; completar análisis estadístico; revisión bibliográfica sistemática; preparar
réplica externa, doble cribado y estudio de transferencia con consentimiento.

**Entregables:** paquete de réplica, tablas generadas, matriz requisito–prueba–resultado–
amenaza, artículo actualizado y declaración de límites.

**Puerta automática:** todo resultado interno es reproducible desde configuración y
semilla. **Puerta humana:** revisión, cribado y estudio solo cambian a “ejecutados” cuando
personas reales entregan evidencia válida.

### Fase 14. Cierre editorial del libro y documentos

**Objetivo:** convertir el material acumulado en productos de lectura, no registros de
proceso.

**Trabajo:**

- separar libro principal, cuaderno de trabajo y anexo técnico;
- eliminar repetición y páginas de fase que no enseñen contenido duradero;
- unificar portada, versión, autor, sinopsis, audiencia, licencias y citas;
- ampliar bibliografía por tema;
- incorporar índice analítico y referencias cruzadas;
- corregir imágenes, proporciones, pies, tipografía, contraste y espacios;
- completar metadatos y accesibilidad del PDF;
- producir una edición web optimizada y una edición de alta resolución;
- actualizar artículo y documento maestro desde la misma fuente de afirmaciones.

**Entregables:** un libro canónico, un artículo, un documento maestro, una especificación
y un cuaderno de trabajo claramente identificados.

**Puerta:** revisión visual integral página por página, cero desbordamientos relevantes,
metadatos correctos y ausencia de versiones “finales” competidoras en la descarga pública.

### Fase 15. Reconstrucción del sitio público

**Objetivo:** ofrecer una experiencia pedagógica navegable, pública y coherente.

**Trabajo:**

- migrar las páginas estáticas útiles a una sola aplicación;
- crear entradas por nivel, problema, capa y familia de patrón;
- incorporar buscador, mapa de relaciones, fichas, código copiable y laboratorios;
- unificar tipografía, componentes, contraste, navegación y diseño móvil;
- publicar únicamente recursos canónicos y separar archivo histórico;
- completar SEO, Schema.org, Open Graph, sitemap, `robots.txt` y recursos para agentes;
- retirar marcadores de publicidad hasta tener integración y consentimiento correctos;
- alojar en una URL sin inicio de sesión obligatorio.

**Entregables:** sitio público, catálogo, buscador, laboratorio, recursos, historia,
licencias, privacidad y página de evidencia.

**Puerta:** acceso anónimo, enlaces válidos, Lighthouse y pruebas de accesibilidad dentro
de umbrales acordados, descargas correctas y verificación desde navegadores reales.

### Fase 16. Release candidata reproducible

**Objetivo:** demostrar que la entrega coincide con el repositorio.

**Trabajo:** compilación limpia, pruebas completas, inventario, SBOM, huellas, licencia
por tipo de obra, notas de versión, matriz de trazabilidad y paquete de archivo.

**Entregables:** `COBRIA Ecosistema 1.0-rc1`, artefactos firmados o con huellas verificables
y guía de reproducción.

**Puerta:** dos ejecuciones limpias generan contenido equivalente y no existen cambios
sin confirmar que afecten la publicación.

### Fase 17. Revisión de la candidata

**Objetivo:** detectar problemas antes de llamar estable a la propuesta.

**Trabajo automático:** seguridad, enlaces, accesibilidad, PDF, ortografía, consistencia,
conformidad y reproducción.

**Trabajo humano pendiente:** lectura editorial independiente, revisión técnica, prueba
de transferencia y evaluación de claridad.

**Entregables:** incidencias clasificadas, respuestas, correcciones y registro de límites.

**Puerta:** no quedan bloqueadores críticos; lo no ejecutado se identifica como pendiente
y no se sustituye por revisores inventados.

### Fase 18. Publicación estable y mantenimiento

**Objetivo:** publicar una propuesta independiente honesta, utilizable y sostenible.

**Entregables:**

- etiqueta `ecosistema-1.0.0`;
- sitio anónimo y estable;
- libro, artículo, maestro, especificación y código canónicos;
- notas de versión, licencias, citas sugeridas y archivo histórico;
- canal de incidencias y política de mantenimiento;
- roadmap 1.x basado en uso real, no en acumulación de páginas.

**Puerta final:** cada artefacto descargable declara versión, fecha, estado, autoridad y
limitaciones; el sitio enlaza exactamente los archivos de la etiqueta publicada.

## 6. Qué puede realizar un agente y qué requiere personas

### Automatizable o asistible por IA

- inventarios, matrices y documentación inicial;
- ejemplos neutrales y pruebas automatizadas;
- migración de contenido y componentes;
- construcción de sitio y documentos;
- detección de inconsistencias, enlaces y problemas de formato;
- generación reproducible de tablas, figuras e informes;
- creación del Toolkit y la aplicación de referencia;
- simulaciones y preparación de paquetes de revisión.

### Requiere autoridad o participación humana real

- aceptar cambios normativos incompatibles;
- aprobar identidad editorial y afirmaciones públicas;
- declarar revisión independiente;
- otorgar consentimiento y participar en estudios;
- doble cribado bibliográfico independiente;
- usar secretos o desplegar en producción;
- aceptar licencias, términos, dominio y publicidad;
- emitir una evaluación profesional o institucional;
- publicar la etiqueta estable.

## 7. Matriz de cierre por producto

| Producto | Fuente canónica | Prueba de cierre |
|---|---|---|
| Manifesto | `MANIFESTO.md` | lenguaje y principios coherentes |
| Core | `specification/COBRIA-CORE-1.0.md` | conformidad y protección de versión |
| Manuales | `manuales/` | cobertura, ejemplos, fuentes y enlaces |
| Patrones | catálogo estructurado | plantilla completa y pruebas |
| Toolkit | implementación y esquemas | instalación, ayuda, contratos y salida JSON |
| Evidencia | `replication/` | regeneración sin edición manual |
| Artículo | fuente LaTeX | cifras trazables y límites explícitos |
| Maestro | `main.tex` y `partes/` | integración metodológica y referencias |
| Libro | `libro-cobria/` | QA visual total y metadatos |
| Sitio | `sitio/` | acceso anónimo, build, enlaces, a11y y SEO |
| Release | etiqueta Git | huellas, licencias y árbol limpio |

## 8. Definición de finalización

COBRIA estará finalizado como **primera edición pública** cuando:

1. sus partes tengan fronteras y versiones claras;
2. Pattern Design funcione como catálogo central navegable;
3. Layers, Data, Security, Quality, Operations, AI y Build tengan ejemplos integrados;
4. Core conserve su alcance y conformidad NoSQL;
5. una aplicación neutral demuestre el recorrido completo;
6. el Toolkit verifique reglas sin confundir automatización con validación externa;
7. libro, web, artículo y maestro compartan afirmaciones y versiones;
8. el sitio sea accesible sin inicio de sesión;
9. el repositorio reproduzca exactamente los artefactos publicados;
10. las limitaciones y validaciones humanas pendientes sean visibles;
11. exista una única versión pública canónica de cada producto;
12. la publicación pueda mantenerse sin volver a acumular fases y copias divergentes.

Después de esta edición, COBRIA 1.x evolucionará mediante incidencias, ADR y evidencia.
Un cambio incompatible con Core se reservará para Core 2.0; una mejora pedagógica o una
nueva ficha de patrón no requerirá romper el núcleo.
