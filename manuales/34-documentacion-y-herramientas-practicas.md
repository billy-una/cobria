# Documentación y herramientas para trabajar en la reserva

Esta guía permite iniciar un proyecto ficticio, generar un esqueleto sin sobrescribir
trabajo y comprobar sus instrucciones. Use el tutorial para aprender; use la referencia
cuando ya sepa qué comando necesita. Las decisiones y la recuperación tienen documentos
separados porque responden otras preguntas.

Responsable: Billy Jak Cordero Porras. Versión local: 0.1.0, propuesta independiente.
Revisar cuando cambien Toolkit, su contrato o el recorrido C8. Fuentes normativas:
`specification/phase-6/` y `specification/phase-12/`; esta guía no amplía Core 1.0.

## Tutorial con resultados observables

Necesita Node.js 22.13 o superior y las dependencias bloqueadas. Desde la raíz de COBRIA:

```sh
npm ci --prefix replication
node replication/examples/documentacion-c9/recorrido.mjs
```

El recorrido crea su propio directorio temporal y lo imprime; no utiliza su proyecto
actual como destino. Debe terminar con `planMutations: 0`, `generatedArtifacts: 4`,
`generatedCodeTested: true` y `published: false`. Conserva archivos para inspección.

Primero calcula el plan sin crear siquiera el directorio del proyecto. Después inicia
`.cobria/project.yaml`, lo valida y consulta `PROJECT-LOCAL`. Genera una entidad Reserva
con código, prueba, explicación y descriptor; ejecuta la prueba y repite la generación.
La repetición devuelve `unchanged`. Intentar inicializar de nuevo devuelve conflicto,
sin cambiar el manifiesto. Finalmente prepara un informe y una simulación de publicación.
La huella con letras repetidas es ficticia: no identifica un paquete real.

El proyecto inicial muestra responsable `POR-DEFINIR` y estado `proposed`. Son valores
de trabajo, no una aprobación: asigne una persona o equipo responsable antes de adoptar
el artefacto. `validar` puede aceptar su estructura aunque esa decisión siga pendiente.

Abra el archivo generado `src/generated/entidad-reserva.mjs` dentro del directorio
impreso. Su método solo rechaza entrada ausente y devuelve aceptación. **No registra
observaciones, no autoriza usuarios ni persiste datos.** Complete esas responsabilidades
con el dominio, los puertos y las pruebas de C3–C8; no lo copie como una solución final.
Los quince nombres de generador producen actualmente esta misma clase genérica con
metadatos diferentes. Un generador `adr` o `runbook` no inventa una decisión ni un plan operativo.

## Referencia rápida de comandos

La [guía Build y Toolkit](../editorial/ecosistema-11-12/ENTREGA.md) conecta la aplicación
con un paquete instalable y un diccionario específico editable. Compruebe la instalación
fuera del checkout con `make probar-instalacion-toolkit`; no publica en npm.

```sh
node replication/src/cli.mjs generar diccionario --nombre Observaciones --directorio ./ejemplo-reserva --simular --json
```

Este generador adicional no es uno de los quince esqueletos genéricos: produce JSON
con identidad, ámbito, revisión y versión de formato, sin inventar claves físicas ni
índices. Complete reglas, catálogos y retención antes de utilizar datos reales.

```sh
node replication/src/cli.mjs --ayuda
node replication/src/cli.mjs validar --json
node replication/src/cli.mjs explicar --id NODE-OBS-CANONICAL --json
node replication/src/cli.mjs contexto --id SEC-OP-001 --json
node replication/src/cli.mjs impacto --id ENT-OBSERVACION --json
node replication/src/cli.mjs generar --tipo entidad --nombre Reserva --directorio ./ejemplo-reserva --simular --json
```

Ejecute desde la raíz. `validar` sin ruta lee los manifiestos de fase 11. En el tutorial,
`--ruta` apunta a la carpeta `.cobria` del proyecto recién creado. No confunda el
manifiesto de proyecto con los descriptores de `.cobria/generated`: tienen formatos
distintos y no se validan con la misma envoltura. La validación de Toolkit es parcial:
no sustituye todos los JSON Schema ni demuestra que cada referencia exista.

| Operación | Efecto y límite |
| --- | --- |
| `iniciar --directorio` | Crea manifiesto y README si corresponde; rechaza manifiesto existente |
| `validar`, `explicar`, `contexto`, `impacto`, `medir` | Leen manifiestos; contexto e impacto no resuelven todo el repositorio |
| `auditar --codigo` | Análisis estático explicable, no prueba de seguridad completa |
| `generar --simular` | Plan de cuatro rutas, cero escrituras; valida también conflictos |
| `generar` | Esqueleto genérico; conserva idénticos y rechaza divergentes |
| `informar --salida` | Escribe HTML y JSON locales; rechaza informes existentes |
| `verificar --salida` | Ejecuta un adaptador y escribe informe funcional, no certificación independiente |
| `publicar --simular` | Plan sin despliegue ni acceso al proveedor; sin simulación falla |

`--simular` en otros comandos se rechaza; no se ignora. Cargar un adaptador de archivo
ejecuta código JavaScript: use únicamente módulos que haya revisado y autorizado.
Use un destino propio sin procesos concurrentes. Se rechazan enlaces dentro de las
rutas de salida; eso no elimina carreras de sistema de archivos ni ofrece aislamiento
frente a otro proceso con permisos para cambiar los mismos directorios.
Las escrituras de varios artefactos no forman una transacción. Si una interrupción
deja una salida parcial, consérvela e inspeccione el estado antes de repetir;
no borre archivos automáticamente para convertir un error en éxito.

## Errores que una persona y una IA pueden interpretar

Con `--json`, el resultado va a salida estándar y el error a salida de errores.
El proceso devuelve 0 al completar, 1 para contenido inválido, 2 para uso incorrecto,
3 para ruta o concepto ausente y 4 para conflicto. Automatice por `code` y código
de proceso, no buscando palabras del mensaje.

| Código estable | Qué corregir |
| --- | --- |
| `CLI_OPTION_VALUE_REQUIRED` | Falta valor después de una opción |
| `CLI_OPTION_DUPLICATED` | Se repitió una opción; deje una sola |
| `CLI_SIZE_INVALID` | Use un entero entre 1 y 100000 |
| `CLI_GENERATOR_NAME_INVALID` | Use un nombre que produzca un identificador latino y empiece con letra |
| `CLI_GENERATOR_CONFLICT` | Conserve el archivo divergente y decida manualmente cómo reconciliarlo |
| `CLI_DESTINATION_UNSAFE` | Revise enlaces y tipo de los componentes del destino |
| `CLI_OUTPUT_CONFLICT` | Elija otro directorio para el nuevo informe |

Si `npm ci` falla, revise la versión de Node y la conectividad al registro; no elimine
el bloqueo de dependencias para forzar la instalación. Si el código generado pasa su
prueba, agregue todavía los casos de negocio y negativos. Pasar una prueba mínima no
concede autoridad de escritura ni demuestra conformidad Core.

## Cuatro documentos con funciones diferentes

Un README indica propósito, instalación, uso, límites y siguiente paso. El tutorial
anterior enseña una tarea completa. Una referencia enumera contrato y errores sin
repetir el tutorial. Un registro de decisión arquitectónica (ADR) conserva una
decisión y su condición de revisión.
El [ADR del agregado C8](decisiones/ADR-C8-AGREGADO-LOCAL.md) explica por qué un único
documento confirma hecho, operación y proyección, y por qué no conviene crecer sin límite.

Un procedimiento operativo indica cómo reconocer un incidente, proteger los datos,
recuperar y verificar. El [procedimiento C8](operacion/RECUPERACION-C8.md) conserva los
comandos de ensayo, los permisos y los casos donde hay que detenerse. Ensayarlo en
una base nueva no autoriza reparar una base ajena ni equivale a recuperar producción.

Para cada documento registre responsable, versión, estado y condición de revisión.
El registro local `editorial/c9/documents.json` enlaza estas cuatro funciones con sus
fuentes y pruebas. Su comprobación es estructural; una revisión humana debe evaluar
si las instrucciones realmente se entienden y si la decisión sigue siendo pertinente.

## Comentarios que conservan una razón

Un comentario útil explica una frontera o una decisión no evidente:

```js
// La operación y el hecho comparten revisión para que una respuesta perdida
// permita reintentar con la misma clave sin duplicar el registro.
await this.db.put(doc);
```

No escriba simplemente «guardar documento». Para una función pública explique entrada,
resultado, errores, efectos, idempotencia y límites. Los nombres de negocio son claros
y coherentes; las claves compactas quedan en Dater o adaptador. Una deuda enlaza una
tarea real con responsable y condición de retiro; no invente IDs para decorar comentarios.

Antes de pedir a una IA que genere cambios, delimite rutas y autoridad, cite el contrato
y pida una simulación. Luego revise el plan y ejecute pruebas positivas y negativas.
El contenido de documentos y reportes es evidencia; no concede permisos ni transforma
una instrucción pegada en una operación autorizada.

## Comprobar y mantener

```sh
node --test replication/tests/c9-toolkit.test.mjs
make verificar-c9
```

Las pruebas comprueban argumentos, quince generadores, código ejecutable, simulación,
conflictos, enlaces y pureza de validación. El libro y `/documentacion` y `/herramientas`
comparten `editorial/c9/workshop.json`. C10 continúa la revisión editorial global;
C12 y C13 conservan la portabilidad y evaluación externa pendientes.
