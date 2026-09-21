# COBRIA como ecosistema para construir software

**Estado:** propuesta de reorganización; no modifica COBRIA Core 1.0.  
**Base empírica:** análisis comparativo de un sistema deportivo, un sistema hotelero y un punto de venta desarrollados por el autor. Los ejemplos públicos deben permanecer neutrales y no revelar nombres, datos ni reglas privadas de esos proyectos.

## 1. Cambio de enfoque recomendado

COBRIA no debería definirse únicamente como una arquitectura NoSQL. El material existente permite convertirlo en un **ecosistema pedagógico y verificable para diseñar, construir, probar y operar aplicaciones por capas**, conservando COBRIA Core como su especialización científica sobre datos canónicos y proyecciones reconstruibles.

La promesa no debe ser “garantizar un programa exitoso”, porque el éxito también depende de producto, usuarios, equipo y contexto. Una formulación defendible es:

> COBRIA enseña a convertir una necesidad en software mantenible mediante fundamentos, capas, patrones, contratos, datos, seguridad, pruebas y operación verificable.

## 2. Arquitectura de la marca

### COBRIA Fundamentos

Ruta inicial para personas con poca experiencia. Explica problema, requisito, regla de negocio, dato, objeto, función, módulo, dependencia, error, prueba, interfaz, almacenamiento y despliegue. No presupone conocimiento de patrones.

### COBRIA Layers

Manual de organización de aplicaciones. Define cuatro capas pedagógicas:

1. **Dominio:** conceptos, objetos, valores, reglas e invariantes.
2. **Aplicación o lógica:** casos de uso, servicios, coordinación y decisiones.
3. **Datos e infraestructura:** repositorios, mapeadores, conectores, serialización, caché y proveedores.
4. **Presentación:** páginas, componentes, interacción, accesibilidad y estados de interfaz.

La regla de dependencia es `presentación → aplicación → datos → dominio`, con el dominio independiente de las capas externas. En sistemas más exigentes, infraestructura implementa puertos definidos hacia adentro.

### COBRIA Pattern Design

Catálogo de patrones de diseño y de aplicación. Cada ficha debe contener: intención, problema, contexto, estructura, participantes, secuencia, código, consecuencias, antipatrones, pruebas y relación con otros patrones. El catálogo se divide en:

- creación y configuración;
- estructura y dependencias;
- comportamiento y reglas;
- persistencia y consulta;
- concurrencia y mensajería;
- interfaz y experiencia;
- seguridad y multiinquilinato;
- observabilidad y operación;
- analítica e inteligencia artificial.

### COBRIA Data

Manual de bases de datos orientado a decisiones: identidad, esquemas, catálogos, relaciones, índices, consultas, paginación, caché, consistencia, transacciones, migraciones, respaldo, recuperación, modelado documental y cuándo no duplicar datos. Core se integra aquí como nivel avanzado, no como toda la introducción.

### COBRIA Core

Permanece estable y estrecho: autoridad canónica, ámbito, revisión, procedencia, proyecciones, equivalencia, reconstrucción, publicación y retiro. Es la especificación normativa y la contribución científica; no debe absorber reglas generales de UI, capas o gestión de proyectos.

### COBRIA Quality

Manual del ciclo de calidad: pruebas unitarias, integración, reglas de base de datos, concurrencia, mutaciones, E2E, rendimiento, seguridad, presupuestos de tamaño, evidencia de versión, staging, rollback y decisión de salida. Enseña que “compila” no significa “está listo”.

### COBRIA Operations

Guía de producción: configuración por ambiente, secretos, observabilidad, trazas, colas, reintentos, dead-letter, respaldo, recuperación, incidentes, despliegues y retiro. Distingue métricas reales de estimaciones.

### COBRIA AI & Analytics

Datos reproducibles, particiones sin fuga, características versionadas, registro de modelos, consentimiento, recuperación limitada por ámbito, citas, abstención, monitoreo de deriva, retroalimentación y auditoría. La IA se presenta como consumidora gobernada, no como autoridad de datos.

### COBRIA Build

Proyecto guiado de principio a fin. El lector crea una aplicación neutral y pequeña, por ejemplo un sistema comunitario de observaciones ambientales, y evoluciona desde un CRUD hasta capas, reglas, búsqueda, operación offline, auditoría, analítica e IA. Cada etapa termina con una lista de aceptación ejecutable.

## 3. Taxonomía extraída de los proyectos

| Nombre observado | Función real | Nombre general recomendado | Patrón o concepto relacionado |
|---|---|---|---|
| `Object` / objetos | representar una entidad o valor del dominio | objeto de dominio | Entity, Value Object, Aggregate |
| `Dater` | convertir objetos y operaciones a persistencia | mapeador/repositorio documental | Data Mapper + Repository + Serializer |
| `Service` | ofrecer operaciones y coordinar colaboradores | servicio de aplicación o dominio | Application Service / Domain Service |
| `UseCase` | exponer una intención concreta del usuario | caso de uso | Command Handler / Interactor |
| `Catalog` / `thingsData` | vocabulario cerrado o versionado | catálogo de dominio | Enumeration, Registry, Reference Data |
| `Indexer` | mantener listas, resúmenes o accesos derivados | proyector o read-model builder | Materialized View / CQRS Projection |
| `Connect` / connector | ocultar Firebase, HTTP o Storage | adaptador de infraestructura | Adapter / Gateway |
| `ModelSingleCatalog` | consultar un catálogo en memoria | modelo de catálogo | Registry / Lookup Table |
| `ServiceTemplate` | comportamiento común de servicios | servicio base | Template Method, con riesgo de herencia excesiva |
| `ServiceRegistry` | localizar servicios registrados | registro explícito | Registry; evitar Service Locator oculto |
| `applyMulti` / transacción | cambiar canónico y derivados juntos | unidad de mutación | Unit of Work / Transaction Script |
| outbox | conservar trabajo posterior al commit | salida transaccional | Transactional Outbox |
| claim/fence | impedir que un worker obsoleto complete | procesamiento cercado | Competing Consumers + Fencing Token |
| cache/dedupe | compartir lecturas simultáneas y limitar tráfico | caché de consulta acotada | Request Coalescing / Cache-Aside |
| offline policy | decidir qué puede diferirse | frontera offline | Queue + Policy / Fail Closed |
| page state | carga, vacío, error, retry y éxito | estado de interfaz | State / Result / Async State Machine |

`Dater` es un nombre propio útil dentro de tus proyectos, pero no es un patrón reconocido universalmente. COBRIA puede conservarlo como término didáctico si siempre presenta su equivalencia: **Dater = mapeador y repositorio documental**, y separa ambas responsabilidades cuando el módulo crece.

## 4. Patrones que COBRIA puede añadir

### Fundamentos y dominio

- Identidad estable.
- Entidad y objeto de valor.
- Invariante de dominio.
- Agregado y propietario de mutación.
- Catálogo cerrado y catálogo versionado.
- Resultado explícito y error de dominio.
- Política y especificación de reglas.

### Aplicación y capas

- Caso de uso pequeño.
- Servicio de aplicación.
- Servicio de dominio.
- Puerto y adaptador.
- Repositorio y mapeador de datos.
- Composición raíz.
- Inyección de dependencias.
- Registro explícito de módulos.
- Fachada de compatibilidad para legado.
- Presupuesto de deuda y archivo no-growth.

### Datos

- Fuente canónica.
- Índice antes que proyección.
- Read model resumido.
- Paginación por cursor.
- Caché por invocación.
- Deduplificación de solicitudes simultáneas.
- Escritura múltiple atómica.
- Migración compatible y lectura multiversión.
- Reconstrucción total e incremental.
- Respaldo probado mediante restauración.

### Concurrencia y procesos

- Clave de idempotencia con huella de payload.
- Revisión monotónica.
- Outbox transaccional.
- Worker con claim y fencing.
- Reintento acotado y dead-letter.
- Compensación segura.
- Máquina de estados explícita.
- Publicación de candidata verificada.

### Interfaz

- Estado asíncrono completo: carga, vacío, error, éxito y reintento.
- Acción protegida contra doble envío.
- Shell progresivo y carga diferida por ruta.
- Tokens como autoridad visual.
- Modal accesible con foco restaurado.
- Presupuesto de recursos frontend.
- Degradación y recuperación offline explícitas.

### Seguridad

- Contexto autorizado en servidor.
- Ámbito obligatorio de extremo a extremo.
- Fallo cerrado.
- Validación en frontera.
- Redacción estructurada de secretos.
- Función pública con rate limit y dependencia mínima.
- Separación entre identidad, autorización y datos solicitados.

### Calidad y operación

- Definición de terminado ejecutable.
- Gate local único.
- Evidencia ligada a commit.
- Matriz requisito-prueba-documento.
- Observabilidad que no bloquea negocio.
- Telemetría sanitizada y acotada.
- Staging antes de producción.
- Go/no-go con criterios no compensables.
- Documentación como parte del cambio.

## 5. Lo que no debe mezclarse

- Core normativo y consejos pedagógicos generales.
- Patrón universal y convención local del repositorio.
- Objeto de dominio y documento persistido.
- Servicio de dominio, servicio de aplicación y adaptador remoto.
- Catálogo y tabla de configuración mutable.
- Índice, proyección y copia canónica.
- auditoría técnica y analítica de negocio;
- prueba local y evidencia de producción;
- compatibilidad legacy y arquitectura objetivo.

## 6. Ruta para principiantes

1. Entender el problema y escribir una historia de usuario.
2. Dibujar datos y reglas sin elegir tecnología.
3. Crear un objeto de dominio con una invariante.
4. Crear un caso de uso con entrada y resultado explícitos.
5. Guardar mediante un repositorio en memoria.
6. Sustituirlo por un adaptador documental.
7. Crear una interfaz con estados de carga, vacío, error y éxito.
8. Añadir autenticación y contexto autorizado.
9. Medir una consulta antes de optimizarla.
10. Crear una proyección solo si el índice no basta.
11. Añadir idempotencia, auditoría y una prueba de concurrencia.
12. Preparar configuración, observabilidad, respaldo, staging y rollback.
13. Añadir analítica o IA únicamente sobre datos trazables.

Cada paso debe incluir tres cajas: **qué problema resuelve**, **código mínimo** y **prueba que demuestra que funciona**.

## 7. Estructura editorial propuesta

```text
COBRIA
├── Empieza aquí
├── Fundamentos
├── Layers
├── Pattern Design
├── Data
│   └── Core
├── Quality
├── Operations
├── AI & Analytics
├── Build: proyecto completo
├── Laboratorios
└── Referencia y glosario
```

El libro puede organizarse en volúmenes o partes con la misma estructura. El sitio debe permitir entrar por nivel (“estoy comenzando”, “ya programo”, “diseño sistemas”, “opero producción”) y por problema (“mi código está mezclado”, “mi consulta es lenta”, “tengo datos duplicados”, “necesito IA segura”).

## 8. Plantilla única para cada patrón

1. Nombre y clasificación.
2. Explicación en una frase.
3. Problema observable.
4. Ejemplo cotidiano.
5. Cuándo usarlo y cuándo no.
6. Estructura y participantes.
7. Secuencia paso a paso.
8. Ejemplo neutral completo.
9. Implementación en TypeScript, Python, Java y Go cuando aporte valor.
10. Caso negativo.
11. Pruebas mínimas.
12. Costos y consecuencias.
13. Seguridad y privacidad.
14. Operación y observabilidad.
15. Patrones relacionados.
16. Ejercicio con solución.

## 9. Estrategia de versiones

- **COBRIA Core 1.x:** contrato NoSQL científico, compatible y estable.
- **COBRIA Ecosistema 2.0:** organización editorial amplia, sin implicar ruptura de Core.
- Cada manual posee su propia versión y estado: borrador, candidato o estable.
- Un patrón nuevo no modifica Core salvo que introduzca una obligación normativa incompatible.
- Las afirmaciones científicas permanecen en artículo/tesis; el manual puede enseñar evidencia sin presentarla como universal.

## 10. Primer incremento recomendado

No conviene reescribir todo de una vez. El primer incremento debe producir:

1. una página “Empieza aquí” por nivel;
2. COBRIA Layers con un módulo completo;
3. doce patrones fundamentales basados en prácticas repetidas de los tres sistemas;
4. un proyecto guiado neutral;
5. un glosario que traduzca `Object`, `Dater`, `Service`, `UseCase`, `Catalog` e `Indexer` a terminología estándar;
6. pruebas pequeñas ejecutables por capítulo;
7. enlaces desde cada tema hacia Core cuando aparezcan autoridad, proyecciones o reconstrucción.

Ese incremento vuelve COBRIA útil para principiantes sin diluir su contribución científica.
