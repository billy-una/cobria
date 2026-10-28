# Protocolo nuevo y contratos comprobables

PC2 añade un protocolo y componentes separados de R7. Se preparan mediciones nuevas
para PC3; no se reinterpretan ni reemplazan los resultados anteriores. La propuesta
sigue siendo independiente, sin certificación ni validación humana atribuida.

## Entregas y autoridad

- `replication/protocol/pc2-contracts-v1.json`: diseño, cargas, hipótesis asociadas,
  métricas, exclusiones, presupuesto y plan estadístico.
- `replication/protocol/PC2-CONTRATOS-V1.md`: explicación del diseño y límites.
- `replication/src/pc2/contracts.mjs`: consultas nativas locales, publicador,
  procesador recuperable, frontera autorizada y consumidor con procedencia.
- `replication/tests/pc2-contracts.test.mjs`: pruebas de aceptación, rechazo y fallos.
- `replication/protocol/pc2-freeze-v1.json`: congelamiento local con huellas de ocho
  archivos, incluido protocolo, implementación, pruebas y dependencia fijada.
- `replication/protocol/pc2-analysis-01.json` y `pc2-analysis-freeze-01.json`:
  precisión estadística previa a PC3, conservando intacto el primer congelamiento.

El registro conserva el commit de partida `0c89c1e` y declara que el árbol tenía
cambios; no atribuye esos cambios al commit. El congelamiento ocurrió a
`2026-10-19T00:12:04.160Z`, todavía 18 de octubre en Costa Rica. La huella del JSON
del protocolo es `3a898a445acdee250e58d3c09ce0ea544dd47bd335539ac4087943c529f7fca6`.
Es un registro local, no una prerregistración independiente ni una firma.

Antes de PC3 se añadió `replication/protocol/pc2-analysis-01.json`, sin reemplazar
el protocolo congelado. Precisa como primaria la prueba exacta bilateral de signos
y reserva la permutación de signos como sensibilidad bajo sus supuestos. No exige
simetría de las magnitudes para la prueba primaria y no interpreta su resultado
como prueba de beneficio medio poblacional. La adenda, su función exacta, su
verificador y sus pruebas tienen un segundo congelamiento local de cuatro archivos.
La adenda se congeló a `2026-10-19T00:17:23.386Z`; su JSON tiene huella
`bdf1267ce74f21dedbe6e008682fe377b3cfb931e15215374895785105fd9c91`.
Los doce archivos protegidos se verifican desde `make verificar-pc2`.

## Correspondencia entre obligaciones y pruebas

| Familia | Acción observada | Rechazo o control adverso |
|---|---|---|
| P1 | Dos rangos `_all_docs` con ámbito y estado/versión; resultado contra fixture independiente; orden balanceado | Ruta manipulada que agrega documento ajeno; oráculo detecta la divergencia |
| P2 | Escritura canónica con pendiente, fallo, recuperación de derivado y reintento sin escritura extra | Clave con otra huella, respuesta perdida y procesador que elimina su registro idempotente |
| R1 | Alias persistido mediante CAS, lecturas coherentes, competencia entre publicadores y reapertura | Candidata incompleta/inválida, corte obsoleto y publicador que omite equivalencia |
| S1 | Sesión conocida, capacidad, finalidad y ámbito antes de fuentes/caché/exportación/búsqueda | Token falso, ámbito ajeno, capacidad ausente, caché caliente y variante que lee antes de rechazar |
| A1 | Producto guardado y reconstruido desde fuentes, citas y abstención del consumidor | Ausencia de evidencia, huella falsa, corte manipulado, fuga temporal/de entidad, herramienta de escritura y consumidor que inventa respuesta |

Son diecinueve pruebas funcionales, tres de congelamiento y dos de análisis/adenda. Cinco variantes incorrectas
son rechazadas por los oráculos, una por familia; esas variantes no se presentan como
adaptadores conformes. El primer intento de pruebas quedó registrado como módulo aún
ausente, no como reproducción de un fallo científico de R7.

## Qué se ha implementado realmente

Se usa PouchDB 9.0.0 con LevelDB en disco, sin un doble del motor. Cada prueba crea su
directorio temporal propio, cierra el almacén y conserva sus archivos para diagnóstico.
R1 persiste fuente, candidatas y alias en un agregado: el cambio condicional es real
para ese documento, no una transacción entre colecciones. La reapertura es ordenada;
no se ensaya corte de energía o una réplica remota.
Las solicitudes concurrentes del ensayo no son una prueba de estrés ni cubren todos
los entrelazados posibles de un sistema con varios nodos.

P1 utiliza otro fixture de documentos con claves indexadas por ámbito/estado y
ámbito/versión. Esas consultas nativas se ejecutan, pero no forman todavía una única
aplicación integrada con el agregado R1. P2 conserva una operación pendiente para
recuperar dos escrituras; no afirma que ambas sean atómicas. La caché es un Map local
particionado, no un servicio de caché externo.

La frontera resuelve sesiones DEMO sintéticas de un registro confiable para las
pruebas. Los contextos internos del publicador/procesador son inyectados por la
composición; no son un proveedor de identidad ni credenciales de producción.

El consumidor es determinista: encuentra texto, devuelve citas o se abstiene y no
permite herramientas de escritura. Probar un texto adverso no demuestra seguridad de
un modelo generativo. El producto exige tanto tiempo de evento como conocimiento y
separación de entidades; no se entrena un modelo ni se estima calidad predictiva.

## Qué queda para PC3

Hay 270 corridas previstas, no ejecutadas: tres motores, tres escalas y treinta
repeticiones por celda. Las consultas nativas, índices, planes, conectores CAS y
métricas remotas de MongoDB, CouchDB y OpenSearch deben conectarse y aprobar los
contratos antes del piloto. Registrar SHA de esos conectores antes de medir. No
atribuirles el éxito de las pruebas PouchDB ni usar R7 para llenar el conjunto nuevo.

Capturar calentamiento, orden efectivo, intentos, fallos y motivos de exclusión. Los
intervalos se calculan sobre corridas pareadas, no consultas correlacionadas. La
ausencia de una métrica de red/disco/índices se declara con motivo; el JSON de payload
no la sustituye. No hay comparaciones de velocidad ni estadísticas nuevas en PC2.

## Reproducción y límites del cierre

Desde la raíz:

```sh
make verificar-pc2
node replication/scripts/freeze-pc2.mjs --check
node replication/scripts/check-pc2-analysis.mjs --check
make verificar COBRIA_SITE_ISOLATED=1
```

El modo `--check` verifica sin regenerar; `--freeze` no puede sobrescribir la primera
versión. Las pruebas usan copias temporales para comprobar alteraciones y omisiones
sin modificar el congelamiento real. La huella del protocolo y el cierre del registro
se comprueban también en la verificación general.

Evidencia local en `output/review/pc2/`: logs funcionales, congelamiento, verificación
general y huellas de R7/Core antes y después. La revisión externa, ejecución remota,
publicación y nuevos resultados confirmatorios continúan pendientes.

Cierre local del 18 de octubre de 2026: `make verificar-pc2` aprobó sus 24 pruebas
y ambos congelamientos; `make verificar COBRIA_SITE_ISOLATED=1` terminó con código
cero, incluyendo 174 pruebas de réplica y la construcción/pruebas del sitio. El
manifiesto verifica 500 archivos. Las huellas de protocolo R7, arnés histórico,
tres archivos crudos confirmatorios y Core coinciden antes y después. No se creó
un conjunto de resultados PC3 ni se publicaron cambios.
