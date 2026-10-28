# Diseñar datos desde cero con una reserva natural

La reserva quiere saber cuántos colibríes se observaron y cuándo. Diseñaremos ese
registro, su diccionario, un catálogo y una consulta. Después cambiaremos el formato
sin cambiar el hecho observado. Continúa [Tu primer proyecto](26-primer-proyecto-paso-a-paso.md):
necesitas Node.js 22.13 o superior y una terminal en la raíz de COBRIA. No hace falta
instalar paquetes, abrir una cuenta de nube ni conectar una base de datos.

## Del relato a los campos

Escribe primero una frase: «En reserva-sur se observaron tres colibríes el 17 de
octubre de 2026 a las 12:00 UTC». Pregunta qué necesitas para distinguir ese registro
de otro, quién puede consultarlo y qué decisiones se tomarán con él.

Un dato es un valor, como `3`. Un atributo explica qué significa: `cantidad` de
individuos. Un documento reúne atributos de un hecho. Una colección o nodo agrupa
documentos con una responsabilidad común. El diccionario es el acuerdo que explica
cómo interpretar esos campos; no es la base de datos ni el catálogo de especies.

El documento lógico que acepta la aplicación inicial es:

```js
const entrada = {
  id: 'obs-001', ambito: 'reserva-sur', revision: 1,
  especie: 'colibri', cantidad: 3,
  observadaEn: '2026-10-17T12:00:00Z'
};
```

`id` no es un número de fila ni una posición de lista. La identidad es el par
`ambito` e `id`: otra reserva podría usar `obs-001` sin ser el mismo registro.
El ámbito recibido de un formulario no demuestra que el usuario tenga permiso.
La aplicación inicial comprueba actor, finalidad, capacidad y ámbitos autorizados.
El taller de datos que sigue trabaja con documentos sintéticos ya seleccionados;
su función de consulta no reemplaza esa autorización.

## Escribir el diccionario antes de abreviar

La fuente ejecutable de este taller está en
`replication/examples/ecosistema-app/data/diccionario-observaciones.json`.

| Nombre lógico | Clave física | Significado y regla |
|---|---|---|
| `id` | `a` | Identidad estable; texto no vacío |
| `ambito` | `b` | Reserva autorizada; texto no vacío |
| `revision` | `c` | Versión del hecho; entero desde 1 |
| `versionEsquema` | `d` | Formato físico; 1 en la aplicación inicial, 2 en el taller migrado |
| `observadaEn` | `e` | Instante observado; el Dater devuelve ISO UTC |
| `especie` | `f` | Código de clasificación, no etiqueta traducida |
| `cantidad` | `g` | Individuos; entero desde 1 |
| `catalogoVersion` | `h` | Edición del catálogo; obligatoria solo desde el formato 2 |

Para cada campo registra significado, tipo, obligatoriedad, nulabilidad, rango,
unidad, origen y sensibilidad. Añade responsable, retención, consumidores, consultas
y versión del contrato. «No aplica» es una decisión explícita; una celda vacía no
explica si alguien olvidó decidir. Cantidad no es dinero ni texto: `3` es válido;
`0`, `-1`, `1.5`, `null` y `"3"` no representan un conteo válido en este contrato.

El tiempo de observación no es la hora de escritura. La aplicación normaliza a UTC
y no conserva el offset original. Si necesitas conservar zona, fuente del sensor o
consentimiento, define esos campos y sus pruebas antes de afirmar que ya existen.
El contrato inicial tampoco contiene procedencia científica completa: registra actor
y finalidad mediante auditoría, que tiene un propósito diferente.

Comprueba la tabla contra el Dater real:

```sh
node --test --test-reporter=tap --test-name-pattern='^diccionario C2 coincide con las claves y valores del Dater v1$' replication/examples/ecosistema-app/test/datos-c2.test.mjs
```

Debe terminar con `pass 1` y `fail 0`. `pass 0` no acredita la tabla.

### No confundir los dos diccionarios

`specification/phase-3/data-dictionary.yaml` es una referencia de gobernanza más
amplia: usa, por ejemplo, `observacionId`, `ambitoId`, `ocurrioEn` y un esquema 3.
No es el serializador de esta aplicación. En esa referencia `g` significa versión
de catálogo; en este taller `g` significa cantidad. Compartir letras no hace
compatibles los contratos. Identifica siempre nodo, diccionario y versión antes de
leer datos compactos. No mezcles el esquema 3 de referencia con los formatos 1 y 2
del taller ni cambies el número para aparentar compatibilidad.

## Separar nodos por responsabilidad

| Nodo del caso | Responsabilidad | Por qué se separa |
|---|---|---|
| `observaciones` | Un hecho canónico por documento | Las observaciones crecen; no se incrustan todas dentro de una reserva |
| `catalogos/especies/{version}` | Interpretar códigos de una edición | La edición debe sobrevivir a cambios de etiquetas |
| `resumenPorEspecie/{ambito}` | Responder conteos derivados | Puede reconstruirse y retirarse sin modificar los hechos |

Estos nombres describen responsabilidades, no tres colecciones desplegadas. El
taller usa arreglos en memoria y un catálogo JSON. La aplicación inicial tiene un
repositorio y un almacén de proyecciones en memoria. No crea rutas RTDB ni índices.

Una cantidad pertenece al hecho y se guarda con él. Un catálogo compartido tiene
ciclo de vida propio y se referencia con código y edición. Una ubicación capturada
podría incrustarse si es pequeña y debe permanecer como fue observada, pero todavía
no es un campo de esta aplicación. No programes contra un atributo hipotético.

Los alias `n8`, `n9` o `a` no son una norma universal ni un requisito de rendimiento.
Puedes empezar con nombres legibles. Si decides abreviarlos, documenta cada nodo
y mide el beneficio frente al costo de comprensión y migración.

## Traducir el documento sin perder significado

`src/infrastructure/data/observacion-dater.mjs` es la frontera de traducción de la
aplicación. La ida produce este formato 1:

```json
{"a":"obs-001","b":"reserva-sur","c":1,"d":1,"e":"2026-10-17T12:00:00.000Z","f":"colibri","g":3}
```

La vuelta crea una `Observacion`. Dominio y casos de uso siguen leyendo `cantidad`,
no `g`. `revision` cambia cuando cambia el hecho; `versionEsquema` cambia cuando
cambia su representación. No deben incrementarse juntas por costumbre.

El Dater original solo admite formato 1. El módulo adicional
`src/infrastructure/data/taller-datos.mjs` gobierna el formato 2 del taller. No cambia
la composición de la aplicación ni hace que los adaptadores existentes lo escriban.

## Crear un catálogo sin inventar taxonomía

`data/catalogos-especies.json` contiene dos ediciones educativas. `colibri` conserva
el código, mientras la etiqueta cambia de «Colibrí» en `2026.1` a «Colibrí observado»
en `2026.2`. `tucan` existe solo en la segunda. Los grupos son simplificaciones para
enseñar contratos, no identificaciones taxonómicas científicas.

Consultar un código o una edición desconocidos produce `CAT_CODE_UNKNOWN` o
`CAT_VERSION_UNKNOWN`. No se sustituyen por la primera opción de un selector ni
por la edición más reciente. Una aplicación podría poner una entrada en cuarentena,
pero este taller la rechaza y deja la decisión pendiente para el responsable.

## Diseñar una consulta antes de crear una copia

La consulta concreta es: «Hasta diez observaciones de colibríes de reserva-sur,
más recientes primero y, si coinciden en tiempo, ordenadas por identidad».
El diccionario declara filtros, orden, límite e índice documental candidato:

```text
Lógico: ambito, especie, observadaEn descendente, id ascendente
Físico: b, f, e descendente, a ascendente
```

No copies esta lista en otro motor sin traducirla. El motor, su plan de ejecución
y el volumen determinan si el índice sirve. El taller filtra antes de ordenar y
limita la respuesta, pero recorre N documentos: cuesta aproximadamente O(N + M log M)
para M candidatos y usa memoria proporcional a M. Limitar la respuesta no limita
el trabajo del escaneo. No hay una medición distribuida ni una comparación de índices.
Para colecciones crecientes, diseña paginación y límites de trabajo en el adaptador;
no presentes este arreglo como consulta de producción.

## Migrar con copia y decisión explícita

El formato 2 añade `h` para recordar la edición del catálogo. No se conoce la edición
de un documento antiguo mirando solo `colibri`. El responsable debe proporcionar una
edición justificada; el taller usa `2026.1` porque su muestra sintética la declara.

La migración valida todos los campos, conserva identidad, ámbito, revisión, instante
y cantidad, y devuelve un documento nuevo. No cambia la entrada. Repetirla con la
misma edición produce el mismo resultado; intentar reclasificar un formato 2 con
otra edición devuelve `CAT_VERSION_CONFLICT`. También rechaza nulos, campos ausentes,
campos adicionales, códigos desconocidos y formatos futuros para no perder datos.

Antes de migrar datos reales: inventaría versiones, respalda, ensaya una muestra,
define lectores compatibles, migra por lotes con punto de control, cuenta rechazos
y verifica antes de promover. Conserva la copia anterior para restaurar. Este taller
demuestra la transformación y lectura de la copia v1, no un despliegue sin interrupciones
ni un rollback de una base de datos real. No elimina campos nuevos para fingir reversión.

## Ejecutar la práctica completa

Desde la raíz de COBRIA:

```sh
node replication/examples/ecosistema-app/src/demo-datos.mjs
node --test --test-reporter=tap replication/examples/ecosistema-app/test/datos-c2.test.mjs
```

La demostración imprime:

```text
Diccionario: c = revisión (1); d = formato (2); g = cantidad (3)
Catálogo: Colibrí, edición 2026.1
Segunda migración idéntica: true
Consulta reserva-sur/colibri: 1 resultado
Taller local en memoria: sin escrituras en disco, sin índice ni motor remoto.
```

Las nueve pruebas deben aprobar. Modifica una copia del ejemplo: cambia el código
a `tucan` con edición `2026.1`, omite el ámbito o intenta migrar cantidad cero.
Relaciona cada rechazo con la regla del diccionario y luego restaura la muestra válida.

Si aparece `ERR_MODULE_NOT_FOUND`, comprueba la raíz y la ruta del archivo. Si aparece
un error al importar JSON, comprueba la versión de Node. Si falta una edición, no la
inventes para obtener verde: revisa la clasificación declarada. Estas prácticas se
comparten con las cinco lecciones de Datos del libro y de la web.
