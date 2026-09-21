# Matriz de lectura, escritura y propiedad

| Nodo | Dominio/servicio que escribe | Lectores autorizados | Escritura directa cliente | Autoridad | Reconstruible |
|---|---|---|---|---|---|
| NODE-OBS-CANONICAL | RepositorioObservaciones | casos autorizados, constructores | solo mediante caso/repo autorizado | sí | desde respaldo/eventos solo si se declara |
| NODE-OBS-DETAIL | RepositorioObservaciones | junto al padre | no separada | parte del agregado | no separadamente |
| NODE-CATALOG-SPECIES | PublicadorCatalogo | validadores y constructores | no | sí para significado catalogado | desde fuente maestra declarada |
| NODE-OUTBOX | repositorio en frontera atómica | trabajador backend | no | operacional, no de dominio | no desde consumidor |
| NODE-SEARCH-PROJECTION | ConstructorProyeccionBusqueda | búsqueda autorizada | nunca | no | sí, total desde fuentes |
| NODE-ANALYTIC-SNAPSHOT | ConstructorDataset | análisis autorizado | nunca | no | sí, desde manifiesto y fuentes |

## Regla de frontera

Una aplicación no obtiene permiso de escritura solo porque puede resolver la ruta
física. La capacidad se concede al caso de uso o servicio responsable y siempre incluye
acción y ámbito. Los constructores de derivados no pueden escribir en fuentes canónicas.

## Fallos que deben probarse

1. escritura directa sobre proyección;
2. lectura de otro ámbito;
3. revisión obsoleta;
4. hijo sin padre o con ámbito distinto;
5. catálogo/versiones inexistentes;
6. entrega duplicada de outbox;
7. publicación de candidata incompleta;
8. reconstrucción desde derivado corrupto;
9. partición analítica con fuga temporal o de ámbito;
10. retiro que deja datos personales en derivados.

