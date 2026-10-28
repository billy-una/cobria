# Tu primer proyecto con COBRIA

Si nunca has programado, empieza por [De una idea a tu primera prueba](35-programar-desde-cero.md).
Allí aprenderás dato, variable, condición, función, objeto, archivo, módulo, error y
prueba mediante cambios reales antes de recorrer las capas de esta aplicación.

Vas a registrar tres colibríes en una reserva, repetir la operación sin duplicarla y
comprobar dos rechazos. No necesitas saber arquitectura, abrir una cuenta cloud,
instalar una base de datos ni utilizar datos personales. El ejemplo usa memoria: al
cerrar el programa pierde sus datos. La persistencia real se aborda después.

## Preparar las herramientas

Necesitas Node.js 22.13 o superior, npm y una copia autorizada del código de COBRIA.
Node ejecuta JavaScript; npm ejecuta las tareas declaradas en `package.json`.
Una terminal es la ventana donde escribes comandos. En macOS puedes usar Terminal;
en Windows, PowerShell; en Linux, la terminal de tu distribución.

Instala Node.js con su instalador oficial si no está disponible. Vuelve a abrir la
terminal después de instalar. Comprueba:

```sh
node --version
npm --version
```

El primer comando debe mostrar una versión compatible, por ejemplo `v24.2.0`; el
segundo, un número de versión de npm. El ejemplo de número no es una exigencia de
instalar esa versión concreta. Si el sistema no reconoce el comando, resuelve la
instalación antes de continuar.

## Encontrar la carpeta correcta

Abre la carpeta del repositorio en tu editor y su terminal integrada, o utiliza `cd`
para entrar en ella. El nombre puede ser `cobria`, `COBRIA-paper` u otro: lo importante
es su contenido. La raíz del proyecto contiene:

```text
README.md
manuales/
editorial/
replication/
  examples/ecosistema-app/package.json
```

Todos los comandos de esta guía se ejecutan desde esa raíz. No copies un símbolo
de prompt como `$` o `>` junto al comando. La opción `--prefix` indica a npm la
carpeta de la aplicación y evita que busque un `package.json` en la raíz.

La aplicación inicial no declara paquetes externos: no necesita `npm install`.
Esto no se aplica al sitio web ni al paquete experimental completo, que tienen sus
propias dependencias. Tampoco necesitas `make`, Java, Go o LaTeX para este inicio.

## Ejecutar primero las pruebas

```sh
npm --prefix replication/examples/ecosistema-app test
```

Una prueba compara una conducta con un resultado esperado. La salida enumera los
casos ejecutados y termina con `pass` y `fail`. Debe haber pruebas aprobadas y
`fail 0`. El número de pruebas puede crecer; no memorices una cifra histórica.
Una salida con cero pruebas no demuestra que el programa funcione.

Entre los casos aparecen documento válido, ámbito ajeno, repetición, cantidad
inválida, reconstrucción y el primer recorrido. Las pruebas de adaptadores que
aparecen aquí utilizan dobles controlados: no están conectándose a MongoDB o CouchDB.

## Ejecutar la primera entrega

```sh
npm --prefix replication/examples/ecosistema-app start
```

Después del encabezado de npm debe aparecer:

```text
Observación registrada: obs-001 (revisión 1)
Repetición segura: 1 observación
Cantidad cero: OBS_QUANTITY_INVALID
Otra reserva: ACCESS_DENIED
Resumen: colibri = 3
Este ejemplo usa memoria; al cerrar se pierden los datos.
```

El programa termina solo. No abre una página web ni queda escuchando un puerto.
Puedes volver a ejecutarlo: cada ejecución comienza con una aplicación en memoria
nueva. La repetición idempotente se demuestra dentro de una ejecución, no mediante
persistencia entre dos procesos.

## Entender lo que acaba de ocurrir

La entrada tiene identidad `obs-001`, ámbito `reserva-sur`, especie `colibri`,
cantidad `3`, revisión `1` y fecha de observación. El ámbito limita qué reserva
puede verse o modificarse. La revisión identifica una versión del hecho.

La cantidad debe ser un entero mayor o igual que uno. Cero, negativos y decimales
se rechazan con `OBS_QUANTITY_INVALID`. El ejemplo construye la entidad con
`new Observacion(entrada)`; no existe un método `Observacion.crear`.

El contexto declara `actorId`, `finalidad`, `ambitos`, `permisos` y
`claveIdempotencia`. La identidad de la demostración es sintética. En un sistema
real esos permisos deben derivarse de identidad confiable en el servidor, no
aceptarse del formulario de una persona. Ese flujo completo corresponde a C5.

Repetir una clave con la misma entrada devuelve el resultado anterior sin duplicar.
Otra reserva se rechaza antes de acceder a sus datos. El resumen cuenta los tres
colibríes a partir de la observación original: no es una segunda autoridad editable.

## Seguir una acción por los archivos

Empieza por `replication/examples/ecosistema-app/src/primer-recorrido.mjs`:

1. `composition.mjs` conecta los componentes en memoria.
2. `application/registrar-observacion.mjs` autoriza y coordina el registro.
3. `domain/observacion.mjs` protege identidad, cantidad, revisión y fecha.
4. El repositorio en memoria conserva el resultado durante el proceso.
5. `application/reconstruir-resumen.mjs` deriva el conteo por especie.
6. `demo.mjs` presenta una salida legible.

No necesitas comprender todos los archivos de una vez. Sigue una sola entrada y
pregunta qué decide cada componente. Un controlador aquí es una traducción de
protocolo; todavía no es un servidor HTTP ni una interfaz visual completa.

## Comprobar una sola conducta

Desde la misma raíz:

```sh
node --test --test-reporter=tap --test-name-pattern='^registra un documento canónico válido$' replication/examples/ecosistema-app/test/app.test.mjs
```

La salida debe indicar `pass 1` y `fail 0`. Si aparecen pruebas omitidas, el filtro
solo seleccionó la conducta nombrada. Si aparece `pass 0`, no aceptes el resultado
como verificación: revisa la ruta y el nombre de la prueba.

Ahora escribe, sin modificar el programa, un ejemplo permitido y uno rechazado.
Explica por qué cantidad cero y otra reserva no son casos de éxito. Compara tu
explicación con las aserciones del archivo de pruebas.

## Resolver los fallos más frecuentes

| Síntoma | Qué revisar |
|---|---|
| No se reconoce `node` o `npm` | Instalación de Node y una terminal abierta después de instalar |
| No se encuentra `package.json` o la carpeta | La raíz debe contener `replication/`; conserva la opción `--prefix` |
| Aparece `OBS_QUANTITY_INVALID` al probar una entrada | La cantidad tiene que ser un entero positivo |
| Aparece `ACCESS_DENIED` | Actor, finalidad, capacidad y reserva del contexto; no elimines autorización para conseguir éxito |
| Aparece `IDEMPOTENCY_CONFLICT` | Se reutilizó una clave con contenido diferente |
| Las pruebas dan `pass 0` | Filtro o ruta incorrectos, no una demostración de corrección |
| No aparece una web | Es una demostración de terminal; el servidor y la interfaz pertenecen a fases posteriores |

## Simular una generación de forma segura

Este paso es opcional y usa el Toolkit, no la aplicación sin dependencias. Primero
instala las dependencias de la réplica con `npm ci --prefix replication`.
Desde la raíz puedes pedir un plan:

```sh
node replication/src/cli.mjs generar --tipo entidad --nombre Observacion --directorio ejemplo-generado --simular --json
```

La respuesta debe contener `status: simulated`, `mutations: 0`, `created: []` y
cuatro rutas planificadas. No debe crearse ni siquiera `ejemplo-generado/` si no
existía. Si hay contenido divergente, se informa un conflicto sin reemplazarlo.
Una generación real escribe archivos y se explica por separado en C9.

## Terminar y continuar

Conserva versión de Node, comando, salida y cualquier diferencia. C1 queda
implementada técnicamente cuando el recorrido y sus rechazos se reproducen; no se
declara que una persona nueva lo comprendió sin observar sus tareas.
No necesitas ejecutar `make verificar` para dar este primer paso: esa orden verifica
todo COBRIA y requiere herramientas adicionales.

Continúa con C2 para diseñar diccionario y nodos desde cero. No añadas nube, IA ni
todos los patrones a esta primera entrega solo porque existan capítulos sobre ellos.
