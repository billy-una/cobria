# Nodos, agregados y almacenamiento NoSQL

## Propósito

Un nodo no se crea porque exista un sustantivo ni porque la base permita otra ruta. Debe
resolver una necesidad, tener dueño, autoridad de escritura, identidad, ámbito, ciclo de
vida, consultas, índices, pruebas y costo. La fuente validable de este caso neutral es
`nodes.yaml`.

## Vocabulario físico

- `nX`: alias histórico de nodo o colección principal.
- `snX`: alias de subnodo o agrupación física.
- `lX`: alias de lista, catálogo o índice auxiliar según el diccionario local.

El prefijo **no garantiza** autoridad, anidamiento ni reconstruibilidad. `n11` puede ser
una proyección y `sn1` un valor embebido; el manifiesto, no el nombre, determina su papel.

## Agregado

Un agregado es una frontera de invariantes y cambio coherente. No equivale de manera
automática a colección, documento ni pantalla. La observación y su detalle pequeño pueden
formar un agregado porque comparten identidad, ciclo de vida y escritura. El catálogo,
la outbox y las proyecciones tienen responsables y ciclos distintos, por lo que se
separan.

## Cuándo anidar

Anide cuando se cumplan conjuntamente estas condiciones:

1. el dato no tiene identidad útil fuera del padre;
2. comparte propietario, ámbito, retención y ciclo de vida;
3. se lee y modifica principalmente con el padre;
4. su cardinalidad y tamaño tienen un límite defendible;
5. la operación debe preservar una invariante atómica del agregado.

No anide historiales, listas sin límite, archivos grandes, objetos compartidos o datos
con permisos y retención diferentes.

## Cuándo separar

Separe cuando exista identidad independiente, crecimiento no acotado, escrituras
concurrentes, permisos distintos, ciclo de vida propio, retención diferente, acceso sin
el padre o necesidad de reconstrucción/publicación aislada.

Separar no significa copiar todo el padre. Conserve referencias estables y los mínimos
datos necesarios para la garantía declarada.

## Cuándo referenciar

Use una referencia cuando el objeto relacionado tenga autoridad y evolución propias.
Incluya versión si su significado histórico puede cambiar. Defina comportamiento ante
ausencia, eliminación, falta de permiso y versión desconocida. Evite cadenas profundas
que conviertan cada lectura en una cascada de consultas.

## Cuándo indexar

Un índice corresponde a una consulta concreta: filtros, orden, paginación, cardinalidad
y selectividad. Mida antes y después. Un índice no posee autoridad ni sustituye una
proyección cuando la lectura necesita combinar, transformar o resumir contenido.

## Cuándo proyectar

Considere una proyección después de probar un índice razonable y medir que la consulta
no cumple el objetivo. La proyección debe declarar fuente, transformación, versión,
ámbito, frescura, equivalencia, reconstrucción, publicación, dueño y retiro.

## Matriz de decisión rápida

| Pregunta | Anidar | Separar/referenciar | Proyectar |
|---|---|---|---|
| ¿Tiene identidad independiente? | no | sí | conserva identidad de fuente |
| ¿Comparte ciclo de vida y retención? | sí | no o parcialmente | no; es derivado |
| ¿Crecimiento acotado? | sí | no | depende del contrato y presupuesto |
| ¿Se escribe junto al padre? | normalmente | no necesariamente | solo constructor |
| ¿Se consulta sin el padre? | rara vez | sí | sí, para lectura especializada |
| ¿Puede eliminarse y rehacerse? | no por separado | depende | debe poder si reclama Core C2/C3 |
| ¿Posee autoridad de dominio? | parte del agregado | puede poseerla | no |

## Reglas de diseño

- La identidad incluye el ámbito cuando este sea frontera de seguridad.
- Una lista creciente usa cursor; no descarga todo el nodo.
- Un resumen mutable no vive embebido si tiene escritores o frecuencia distintos.
- Una relación muchos-a-muchos suele requerir una entidad relacional con identidad,
  vigencia y dueño, no dos listas duplicadas.
- Los bloqueos e idempotencia son nodos operativos con expiración y acceso de servidor.
- Una vista o índice derivado documenta origen y retiro; nunca recibe cambios de dominio.
- Borrado, anonimización y retención se propagan mediante una política explícita.

## Anti-patrones

- nodo nuevo para cada pantalla;
- índices manuales que se convierten en autoridad;
- `nX` o `snX` usados directamente desde UI y dominio;
- duplicación bidireccional sin reconciliación;
- arrays crecientes dentro de un documento caliente;
- consulta global seguida de filtro de ámbito en memoria;
- proyección publicada sobre sí misma después de corrupción;
- retención indefinida “por si acaso”.

