# Ejemplos correctos y límites observables

PC1 revisa los treinta ejemplos pedagógicos sin cambiar Core 1.0 ni los resultados
experimentales históricos. La referencia completa sigue siendo TypeScript; Python,
Java y Go tienen un ejemplo seleccionado cada uno, no treinta implementaciones.

## Correcciones ejecutables

El conteo usa `Map` y produce propiedades propias mediante `Object.fromEntries`.
`constructor`, `__proto__` y `toString` son etiquetas, no entradas heredadas. Catálogos,
selección de campos y huellas exigen propiedades propias. Los validadores compartidos
no aceptan campos requeridos heredados y el despachador rechaza identificadores ajenos.
La idempotencia distingue ausencia de propiedad de una clave ya usada y no cambia
el prototipo al guardar `__proto__`. Una carga ausente o circular produce rechazo.

Cantidades positivas, sumas seguras, revisiones enteras, confianza acotada y fechas
UTC reales evitan resultados silenciosamente inválidos. El ejemplo de auditoría
valida fecha, revisión, responsable y acción antes de ordenar. La comparación de
identificadores de reparación conserva límites mediante JSON, no concatenación ambigua.

## Estados que no deben confundirse

- Reconstrucción total calcula `candidata-calculada` y declara
  `equivalenciaVerificada: false`; no se ha comparado contra un oráculo externo.
- Publicación por versión propone `activaPropuesta` y `rollbackPropuesto`, con
  `persistida: false`. TypeScript y Go no escriben un alias de almacenamiento.
- La bandeja de salida devuelve `planCommit`, con `persistido: false`.
- Retiro devuelve `retiro-propuesto`; no borra datos ni prueba recuperabilidad real.
- La herramienta valida una propuesta con aprobación declarada. No autentica a
  una persona ni ejecuta una acción del sistema.

Los casos y el generador editorial reflejan esas salidas. El texto distingue el
contrato completo del patrón de la operación parcial demostrada. Los fragmentos
usan validadores y tipos del archivo completo; no son programas autónomos.

## Revisión de las treinta implementaciones

| Patrón | Revisión y límite conservado |
|---|---|
| 01 Objeto canónico | Campos propios y revisión segura; congelación local, no autoridad distribuida |
| 02 Dato fechado | Fecha UTC real y orden; no sincronización de relojes |
| 03 Repositorio con ámbito | Ámbito propio y coincidencia; no autenticación del solicitante |
| 04 Catálogo versionado | Edición y clave propias, valor textual; no conservación histórica del catálogo |
| 05 Proyección de lectura | Map, ámbitos filtrados, cantidades y sumas seguras; no actualización automática |
| 06 Cobertura | Solo campos propios y sin duplicados; no autorización de campos sensibles |
| 07 Reconstrucción total | Candidata calculada y límites numéricos; no equivalencia ni corte consistente |
| 08 Reconstrucción incremental | Selección por cursor; no prueba de entrega completa o persistencia |
| 09 Publicación por versión | Propuesta explícita en TypeScript/Go; no intercambio atómico |
| 10 Idempotencia | Claves propias y carga serializable; registro mutable local, no exclusión concurrente |
| 11 Revisión obsoleta | Revisión positiva sin desbordamiento; no escritura condicional del motor |
| 12 Bandeja de salida | Plan declarado; la bandera no prueba una transacción |
| 13 Reparación | Comparación de conjuntos de identificadores; no equivalencia de contenidos |
| 14 Conjunto reproducible | Corte temporal validado; referencias no congelan datos ni calculan huellas |
| 15 Característica versionada | Fórmula conocida y números finitos; no calidad de un modelo predictivo |
| 16 Recuperación limitada | Filtro por ámbito propio y referencias presentes; no recuperación autorizada previa |
| 17 Herramienta gobernada | Propuesta con aprobación declarada; no consentimiento o identidad verificados |
| 18 Frontera lectura/escritura | Rechazo de operación de escritura local; no permisos del motor |
| 19 Índice antes que proyección | Mediciones no negativas; son entradas, no resultados experimentales |
| 20 Retiro | Propuesta sin persistencia; consumidores y fuente son datos declarados |
| 21 Identidad estable | Conservación del id en el ejemplo; no unicidad global |
| 22 Validación de frontera | Coordenadas y texto; especie desconocida requiere validación de catálogo aparte |
| 23 Contrato versionado | Versiones conocidas y campos propios; no migración de toda una colección |
| 24 Lectura coherente | Coincidencia de revisiones; no instantánea compartida del motor |
| 25 Frescura | Fechas UTC reales y ventana; depende de tiempos de origen confiables |
| 26 Manifiesto | Huellas propias con formato; no recalcula las fuentes |
| 27 Partición | Rechazo de entidad compartida; no toda fuga temporal o semántica |
| 28 Abstención | Confianza y umbral entre cero y uno; valores recibidos, no calibración |
| 29 Presupuesto | Costos no negativos y consumidores enteros; no facturación real |
| 30 Auditoría | Fechas y campos requeridos antes de ordenar; no autenticidad del registro |

Esta revisión cubre propiedades heredadas, acumuladores y correspondencia de estados
con acciones observables. No es una auditoría exhaustiva de seguridad ni conformidad
de los treinta patrones con todas las garantías de una base de datos distribuida.

## Evidencia local

Las primeras catorce regresiones se ejecutaron antes de la corrección: 61 pruebas
existentes pasaron y las catorce nuevas fallaron. Después se añadieron cuatro casos
complementarios y la suite TypeScript tiene 79 pruebas. Se preservan los logs antes,
intermedios y después en `output/review/pc1/`.

La prueba Java de carga nula falló antes de corregir el validador. Sus controles de
repetición, conflicto y claves reservadas se ejecutan desde el programa de prueba.
Python comprueba también claves reservadas y aislamiento de la copia devuelta;
Go conserva aceptación y rechazo de la propuesta sin persistencia.

La primera verificación general detectó un archivo nuevo sin manifestar
(`review-pc1.mjs`): PC0 lo rechazó correctamente. Ese log se conserva; el manifiesto
de trabajo se regenera explícitamente al terminar los cambios, no para ocultar el fallo.

## Reproducción desde la raíz

```sh
make verificar-pc1
node replication/scripts/review-pc1.mjs
make generar-manifiesto-paquete
make verificar COBRIA_SITE_ISOLATED=1
```

La revisión de navegador requiere instalar las dependencias fijadas del libro y su
Chromium. Registra geometría de 33 páginas de código, tamaño de fuente y muestras
visuales; no acredita accesibilidad con tecnologías de apoyo. La web comprueba sus
fichas renderizadas y los HTML estáticos se regeneran desde las mismas fuentes.
Los PDF y descargas se regeneran localmente; no se despliega ni publica el sitio.

Cierre local del 18 de octubre de 2026: `make verificar-pc1` y
`make verificar COBRIA_SITE_ISOLATED=1` terminaron con código cero. Pasaron 79 pruebas
TypeScript, cuatro Python y los programas de prueba Java/Go; la verificación general
incluyó 150 pruebas de réplica y 22 del sitio renderizado. El manifiesto vigente
verifica 488 archivos y Core/ZIP RC2 conservan sus huellas congeladas.

El libro tiene 285 páginas, el cuaderno 35 y el anexo 16. La geometría de las 33
páginas de código no presenta desbordamiento y conserva fuente mínima de 9 puntos.
Se inspeccionaron visualmente las páginas PDF 182, 189, 196, 197 y 200 del libro y
las portadas de cuaderno/anexo, sin cortes observados en esas muestras. No equivale
a inspección visual de todas las páginas. Informes, imágenes y logs están en
`output/review/pc1/`; el primer fallo del manifiesto se conserva separado del resultado final.

## Pendientes fuera de esta fase

Publicación atómica real, autorización de motor, concurrencia, recuperación y abstención
de un consumidor real requieren PC2 y fases posteriores. El mapa idempotente usa
JSON serializado, no canoniza el orden de propiedades ni ofrece persistencia. Cambiar
un resultado pedagógico no obliga a reinterpretar las corridas históricas de R7.
