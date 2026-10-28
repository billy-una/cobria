# Construir un registro por capas

Vas a seguir el mismo hecho de C1 y C2: registrar tres colibríes en reserva-sur.
Primero comprobarás la regla de cantidad; después, el caso de uso y el controlador;
al final cambiarás la representación de almacenamiento sin cambiar esa intención.
No necesitas comenzar con un servidor ni con cinco proyectos separados.

Necesitas Node.js 22.13 o superior y una terminal en la raíz de COBRIA. Las prácticas
de la aplicación no requieren paquetes externos. El análisis sintáctico avanzado
utiliza TypeScript de la réplica; sus requisitos se indican al final.

## Antes de crear carpetas

Una capa separa responsabilidades, no necesariamente máquinas. Un archivo necesita
una razón para cambiar y una forma de comprobarla. La regla «cantidad positiva»
cambia por el significado de una observación; el formato de una respuesta cambia
por el protocolo; la traducción de `cantidad` a `g` cambia por el almacenamiento.
Reunir esas decisiones en una pantalla obliga a cambiar cosas no relacionadas.

Una aplicación pequeña puede reunir varias clases en pocos archivos si conserva
fronteras claras. No necesita un Service, Connector o Registry vacío para cumplir
una lista. El costo de cada separación incluye nombres, contratos, pruebas y lectura.

## Primer paso comprobar la regla

Abre `replication/examples/ecosistema-app/src/domain/observacion.mjs`. La entidad
recibe identidad, ámbito, especie, cantidad, revisión e instante. Valida el hecho
y lo deja inmutable. No recibe un repositorio, un objeto HTTP ni variables de entorno.

Desde la raíz:

```sh
node --test --test-reporter=tap --test-name-pattern='^la entidad aplica su regla sin recibir un repositorio$' replication/examples/ecosistema-app/test/capas-c3.test.mjs
```

Debe terminar con `pass 1` y `fail 0`. La prueba acepta tres individuos y rechaza
cero con `OBS_QUANTITY_INVALID`. Así se puede comprobar la regla sin arrancar una web.

## Segundo paso expresar la intención

Abre `src/application/registrar-observacion.mjs`, dentro de la aplicación de referencia.
`RegistrarObservacion` no es un contenedor genérico de servicios: coordina una intención
concreta. Su constructor real recibe `{ repositorio, autorizar, calcularHuella }`.

El orden real importa:

1. Exige una clave de idempotencia.
2. Autoriza actor, finalidad, capacidad `observaciones:escribir` y ámbito.
3. Calcula una firma de la entrada.
4. Busca una operación anterior: si es una repetición equivalente, devuelve su resultado;
   si la firma difiere, rechaza el conflicto.
5. Si es nueva, construye `Observacion` y valida sus invariantes.
6. Guarda la observación.
7. Registra el resultado de idempotencia y devuelve la entidad.

No digas que la entidad se valida antes de toda lectura: la consulta de idempotencia
ocurre antes. Lo que sí se comprueba es autorización antes del acceso y ausencia de
escrituras cuando la cantidad es inválida.

Guardar el hecho y registrar idempotencia son dos efectos separados. Un error o una
caída entre ellos y las solicitudes concurrentes necesitan garantías adicionales del
adaptador. Las pruebas secuenciales no demuestran atomicidad ni «exactamente una vez».

## Tercer paso declarar las capacidades

El contrato `src/application/ports/repositorio-observaciones.mjs` describe cuatro métodos:

| Método | Entrada y resultado | Responsabilidad |
|---|---|---|
| `guardar(documento)` | Entidad lógica; termina o rechaza | Conservar identidad, ámbito y revisión |
| `listar(ambito)` | Ámbito; lista de entidades | No mezclar reservas |
| `buscarOperacion(ambito, clave)` | Ámbito y clave; registro previo o ausencia | Distinguir repetición de operación nueva |
| `registrarOperacion(ambito, clave, firma, resultado)` | Resultado registrado | Conservar lo necesario para la repetición |

El puerto es una descripción de capacidades, no otro salto de red. Aquí se expresa
en JSDoc y métodos de objetos; no hay una interfaz que JavaScript haga cumplir por
tipado nominal. La composición comprueba que esos cuatro métodos existan y las pruebas
comprueban conductas. Ninguna de las dos cosas certifica un adaptador arbitrario.
No uses `obtenerPorId` como si ya fuera parte de este contrato: todavía no lo es.

## Cuarto paso traducir la solicitud

`src/presentation/registrar-observacion-controller.mjs` recibe un objeto con `cuerpo`
y `contexto`; llama al caso de uso y traduce la salida. Su constructor recibe dos
argumentos posicionales: `registrarObservacion` y `traducirError`, no un objeto de opciones.

El éxito se representa con `estado: 201` y una entidad lógica. Un ámbito ajeno produce
403; cantidad cero produce 400 y un código estable. La localización está en
`presentation/i18n/mensajes-es.mjs`; la regla de cantidad no se copia allí.

Esta clase simula la adaptación a un protocolo. No abre un puerto HTTP, no verifica
tokens y no convierte el contexto sintético en una identidad autenticada. Para una
API real falta esa frontera, tratada en C5 y C8.

## Quinto paso elegir el repositorio

La composición inicial continúa usando `RepositorioMemoria`, que guarda objetos
lógicos. Ahora también admite inyección explícita. El ejemplo ejecutable utiliza:

```js
const documentos = new Map();
const repositorio = new RepositorioDocumentalMemoria({ documentos });
const app = crearAplicacion({ repositorio });
```

Encontrarás ese código completo, con importaciones, entrada y contexto en
`src/demo-capas.mjs`. `RepositorioDocumentalMemoria` guarda documentos físicos v1 y
usa `ObservacionDater` para recuperarlos. Solo ese adaptador conoce `a`–`g`.
El resultado del caso de uso conserva `cantidad`, `ambito` y `revision`.

Los dos repositorios son variantes locales en memoria. No son dos motores evaluados,
no sobreviven al cierre y no prueban integración MongoDB o CouchDB. Los adaptadores
de esos nombres reciben colaboradores inyectados; sus pruebas actuales usan dobles.
Tampoco se selecciona un motor leyendo `COBRIA_ADAPTER` dentro de esta composición.

Ejecuta desde la raíz:

```sh
node replication/examples/ecosistema-app/src/demo-capas.mjs
```

Debe imprimir:

```text
Controlador: estado 201, cantidad 3
Repositorio documental local: 1 documento
Regla de dominio: OBS_QUANTITY_INVALID, estado 400
Tras el rechazo: 1 documento
Misma aplicación, otra representación. Sin HTTP real, motor remoto ni garantía transaccional.
```

El Map inyectado permite inspeccionar datos en una prueba. No es un recurso que se
deba entregar a una vista de producción: exponerlo permitiría saltarse el caso de uso.

## Distinguir ejecución de dependencias

Durante la ejecución, el caso de uso llama al repositorio. Durante el diseño, el
caso de uso no importa la clase concreta del repositorio. La composición le entrega
un objeto que satisface el puerto. Esa diferencia permite sustituir una implementación.

| Capa | Importa | No debe asumir |
|---|---|---|
| Dominio | Dominio | HTTP, SDK, claves físicas o entorno |
| Aplicación | Aplicación y dominio | Proveedor concreto o rutas de almacenamiento |
| Presentación | Presentación, aplicación y dominio | Guardado directo o reglas duplicadas |
| Infraestructura | Infraestructura, aplicación y dominio | Navegación ni decisiones visuales |
| Composición | Las piezas necesarias para conectarlas | Reglas de negocio ocultas |

El controlador puede conocer un error de dominio sin poder acceder al almacenamiento.
El Dater puede construir una entidad sin convertirse en su caso de uso. Una dependencia
permitida no autoriza a mezclar todas las responsabilidades de ambas capas.

## Ubicar cada archivo

La fuente del mapa es `replication/examples/ecosistema-app/data/arquitectura.json`.
Incluye todos los archivos `.mjs` de `src`, con capa, responsabilidad, lo que no les
corresponde y una prueba relacionada. La prueba de inventario falla si se añade un
archivo sin describirlo. Que una prueba esté relacionada no acredita por sí sola
todas las propiedades del archivo: lee el alcance del caso y el control estático.

```text
src/
  domain/          reglas del hecho y errores
  application/     intenciones, puertos, autorización y derivados
  presentation/    controladores, problemas y mensajes
  infrastructure/  repositorios, Dater, huella y auditoría
  composition.mjs  construcción e inyección
  demo-capas.mjs   punto de entrada sintético
```

Catalog, Indexer y Connector nombran responsabilidades, no capas extra obligatorias.
En este caso, la resolución de ediciones está en el taller de datos de C2; la
reconstrucción del resumen es un caso de uso; no existe un `MongoConnector` instanciado
por la composición inicial. Tampoco hay un Registry global que todos puedan consultar.

## Conservar una decisión con alternativas

Decisión local C3: admitir un repositorio inyectado y conservar memoria como valor
predeterminado. Alternativas: mantener la dependencia fija, leer un motor desde el
entorno en cada archivo o introducir un contenedor global. Se elige inyección explícita
para mostrar el cambio sin introducir configuración oculta.

El costo incluye mantener el puerto, traducir y probar otro adaptador. No se midió una
mejora de latencia ni ahorro de almacenamiento. Revisar esta decisión al necesitar
persistencia real, concurrencia, límites de carga o promoción de ambiente. Un índice o
una proyección requieren otra decisión basada en consultas y mediciones, no este ensayo.

## Comprobar también los atajos prohibidos

Las diez prácticas de Arquitectura y Capas ejecutan pruebas de la aplicación sin
paquetes externos. El control completo añade un analizador sintáctico de importaciones:
si no tienes las dependencias de réplica, instálalas desde la raíz con
`npm ci --prefix replication`. Después ejecuta:

```sh
make verificar-c3
```

Este control analiza el grafo real y prueba fuentes virtuales con imports prohibidos,
reexportaciones, ciclos y dependencias calculadas. No ejecuta esas fuentes inválidas
ni las introduce en la aplicación. Reconoce sintaxis mediante TypeScript, en vez de
interpretar un comentario como un import. Las lecturas directas de `process.env` desde
dominio o aplicación se rechazan; dependencias calculadas requieren revisión explícita.

Es un control acotado: no demuestra semántica de negocio ni seguridad completa, y no
resuelve reflexión, globals o todas las formas indirectas de leer el entorno. Sigue
siendo necesario revisar decisiones y probar conductas. No arregles un ciclo moviendo
todo a `utils` o `common`: identifica qué responsabilidad está en el lugar equivocado.

## Resolver un fallo sin cambiar la regla

Si sale `pass 0`, verifica el filtro y la ruta de la prueba. Si aparece
`ERR_MODULE_NOT_FOUND` para TypeScript, faltan las dependencias del control avanzado,
no las de la aplicación inicial. Si la composición rechaza un método ausente, compara
el adaptador con el puerto; no añadas un método vacío para silenciar el error.

Un import prohibido se corrige invirtiendo la dependencia o moviendo la responsabilidad,
no ampliando todos los permisos de capa. Un fallo de dominio se corrige en su regla o
en la entrada según corresponda; no lo ocultes con un mensaje de éxito.

La entrega se completa cuando puedes seguir el registro, explicar cada frontera,
sustituir el repositorio y demostrar rechazos sin escritura. Comprobar que lectores
reales pueden hacerlo sin ayuda corresponde a C13.
