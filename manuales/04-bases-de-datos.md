# COBRIA Data: manual de bases de datos

La fuente de referencia completa se encuentra en
`specification/phase-3/data-dictionary.yaml`. El diccionario separa concepto, nombre
lógico y clave física; ninguna clave compacta debe atravesar la frontera Dater.

## Método de diccionario

Para cada atributo documente significado, nombre lógico, clave física, tipo,
obligatoriedad, formato, unidad, ámbito, semántica temporal, procedencia, sensibilidad,
retención, versión, responsable, consumidores, índices, ejemplos y reglas. Una celda
vacía debe significar “no aplica” de forma explícita, no “nadie lo decidió”.

## Construir el diccionario desde cero

1. Nombre el hecho en lenguaje del dominio, no con su clave física.
2. Declare identidad, propietario y ámbito.
3. Escriba significado y ejemplo antes del tipo técnico.
4. Defina obligatoriedad, nulabilidad, rango, formato y unidad.
5. Distinga tiempo válido, tiempo conocido, revisión y versión de esquema.
6. Registre procedencia, sensibilidad, retención y consumidores.
7. Anote consultas e índices que realmente lo necesitan.
8. Asigne la clave física únicamente después y documente su traducción.

Ejemplo lógico:

```json
{
  "id": "obs-42",
  "ambito": "bosque-sur",
  "especie": "colibri",
  "cantidad": 2,
  "revision": 1,
  "ocurrioEn": "2026-09-21T14:00:00Z"
}
```

Ejemplo físico dentro de `n8`:

```json
{"a":"obs-42","b":"bosque-sur","c":"colibri","d":2,"e":1,"f":"2026-09-21T14:00:00Z"}
```

`a`–`h` no poseen significado global. Solo el diccionario versionado y el Dater del nodo
correspondiente pueden traducirlas. Dominio, aplicación, presentación y analítica usan
nombres lógicos. Una clave compacta fuera de infraestructura es una fuga de representación.

## Diseñar desde accesos y garantías

Antes de elegir colecciones o nodos, escriba:

- identidades y ámbitos;
- reglas de autoridad;
- consultas, filtros, orden y paginación;
- frecuencia de lectura y escritura;
- consistencia y frescura necesarias;
- volumen, crecimiento y retención;
- recuperación, respaldo y eliminación;
- privacidad, autorización y auditoría.

## Documento, índice y proyección

Un documento canónico conserva la autoridad. Un índice localiza documentos sin duplicar necesariamente su contenido. Una proyección materializa una forma distinta para una consulta. Debe probarse primero el mejor índice razonable; una copia adicional se justifica únicamente por evidencia.

## Modelado NoSQL

- Diseñe agregados que puedan mutar de forma coherente.
- Evite claves derivadas de nombres que pueden cambiar.
- Incluya ámbito en clave, consulta, caché, auditoría y trabajo de fondo.
- Use revisiones monotónicas para rechazar regresiones.
- Versione documentos y transformaciones.
- Use paginación por cursor para colecciones crecientes.
- Evite índice + N lecturas canónicas en rutas calientes; materialice el resumen mínimo si la medición lo justifica.

## Mutación múltiple

```js
const actualizaciones = {
  [`canonica/${ambito}/${id}`]: documento,
  [`indices/${ambito}/porEstado/${documento.estado}/${id}`]: true,
  [`auditoria/${ambito}/${eventoId}`]: evento
};
await base.aplicarAtomico(actualizaciones);
```

La capacidad atómica depende del motor y de la frontera elegida. Si no puede abarcar todas las salidas, use outbox e idempotencia; no simule atomicidad con promesas paralelas.

## Ciclo de una proyección COBRIA

`ausente -> construyendo -> candidata -> verificada -> publicada -> retirada`

Una candidata no se publica si cambió el corte de fuentes, falla la equivalencia, aparece otro ámbito o se interrumpe la construcción.

## Nodos y agregados

El manual completo de separación, anidamiento, referencias, índices y proyecciones está
en `specification/phase-4/NODOS-Y-AGREGADOS.md`. El manifiesto `nodes.yaml` documenta
necesidad, dueño, autoridad, ciclo de vida, consultas, índices, pruebas y costos de cada
nodo. Los alias `nX`, `snX` y `lX` solo tienen significado mediante ese manifiesto y el
diccionario de datos.

## Decidir si separar un nodo

Mantenga datos juntos cuando se leen, cambian, autorizan, respaldan y eliminan juntos.
Sepárelos cuando posean identidad, ciclo de vida, volumen, seguridad o patrón de acceso
independiente.

| Pregunta | Incrustar | Referenciar/separar |
|---|---|---|
| ¿Cambian atómicamente? | normalmente sí | normalmente no |
| ¿Se leen siempre juntos? | sí | no |
| ¿Crecen sin límite? | no | sí |
| ¿Tienen propietario distinto? | no | sí |
| ¿Poseen retención diferente? | no | sí |
| ¿Se comparten entre agregados? | rara vez | con frecuencia |

Una proyección se separa porque su ciclo de reconstrucción y retiro difiere del canónico.
Un catálogo se separa cuando su versión y vigencia deben sobrevivir independientemente.
Un outbox se separa cuando su worker, retención y observabilidad tienen otro ciclo.

## Catálogos

Un catálogo declara código estable, significado, versión, vigencia, sustitución y estado.
La interfaz puede traducir etiquetas, pero no inventar el significado. Cambiar `activo`
por `cerrado` requiere migración o regla de compatibilidad; modificar una etiqueta visible
no necesariamente cambia el contrato.

## Migraciones y lectura multiversión

- todo documento declara versión de esquema;
- el lector acepta un intervalo explícito;
- la migración es determinista e idempotente;
- primero se despliega un lector compatible, después el escritor nuevo;
- se registran cantidad, errores, duración y huella;
- el rollback no destruye documentos que la versión anterior no comprende;
- la compatibilidad se retira cuando no quedan documentos ni consumidores antiguos.

## Core como nivel avanzado

COBRIA Data enseña modelado general. Core se aplica cuando existen derivados que deben
conservar autoridad, ámbito, revisión, procedencia, equivalencia y reconstrucción. Sus
niveles son acumulativos:

- **C1:** autoridad, identidad, ámbito, revisión y frontera de escritura;
- **C2:** C1 más contrato versionado, idempotencia, equivalencia, reconstrucción y publicación;
- **C3:** C2 más procedencia, frescura/costo, observabilidad, responsable y retiro.

Usar el manual Data no declara conformidad Core. La declaración exige superar las pruebas
obligatorias con un adaptador y conservar el informe.

## Adaptadores y conformidad

El arnés incluye adaptadores documentales para LokiJS, PouchDB, MongoDB, CouchDB y
OpenSearch con alcances diferentes. LokiJS y PouchDB permiten la ejecución local; MongoDB
y CouchDB requieren servicios compatibles; OpenSearch se evalúa como índice documental,
no como autoridad canónica universal.

```sh
node replication/src/cli.mjs verificar \
  --adaptador pouchdb \
  --salida ./cobria-informe
```

El informe separa pruebas aprobadas, perfil funcional y limitaciones. No constituye
certificación independiente ni demuestra rendimiento distribuido.

## Respaldo

Un respaldo no está probado por existir. La evidencia mínima incluye archivo, huella, versión del esquema, fecha, alcance, procedimiento de restauración, tiempo observado y resultado de comparación.

## Laboratorio Data

1. Complete un diccionario de al menos ocho atributos lógicos.
2. Asigne `a`–`h` únicamente dentro de un nodo y escriba el Dater.
3. Dibuje agregado, catálogo, outbox y proyección con sus ciclos de vida.
4. Justifique cada referencia o anidamiento con la matriz anterior.
5. Diseñe consultas, índices y paginación antes de añadir una proyección.
6. Ejecute el mismo contrato sobre dos adaptadores locales.
7. Retire la proyección, reconstrúyala y compare equivalencia.
8. Restaure un respaldo y registre tiempo, huella y resultado.

**Criterio de avance:** otra persona puede explicar significado lógico, forma física,
autoridad, consultas, migración, recuperación y costo sin deducirlos del código.
