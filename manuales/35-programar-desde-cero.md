# De una idea a tu primera prueba

Vas a contar colibríes en una reserva ficticia. Primero aprenderás a expresar la tarea; después cambiarás datos y escribirás una prueba. No necesitas conocer arquitectura. Los primeros ocho ejemplos calculan o leen valores: no autorizan ni guardan registros. El noveno conecta con la aplicación existente y mantiene sus controles.

## Preparar tu copia de trabajo

Necesitas una copia autorizada de COBRIA, un editor de texto y Node.js 22.13 o superior. Node ejecuta el lenguaje JavaScript. Un editor modifica texto sin convertirlo en un documento de Word.

La terminal es una ventana para dar órdenes. Ábrela en la carpeta raíz de COBRIA: contiene README.md y replication/. Comprueba node --version y npm --version. Si no se reconocen, instala Node desde nodejs.org y vuelve a abrir la terminal. No necesitas una cuenta de nube ni instalar una base de datos.

Crea una carpeta nueva fuera de tu copia original, por ejemplo cobria-mi-inicio. Copia dentro TODO replication/examples/ecosistema-app, no solo taller-inicial. Abre esa copia en el editor y abre allí una terminal. Debes ver package.json, src/, test/, data/ y taller-inicial/. Conserva intacto el original para comparar y recuperar cambios.

En esa carpeta nueva no hace falta npm install: la aplicación inicial no tiene paquetes externos. Todos los comandos de las diez unidades parten de esa carpeta. Escribe solo el comando, sin copiar un símbolo $ o >. Guarda el archivo antes de ejecutarlo. El nombre .mjs identifica un archivo de JavaScript que puede compartir piezas con otros archivos.

Si aparece MODULE_NOT_FOUND o no se encuentra un archivo, comprueba la carpeta actual y el nombre completo, incluida su extensión. Si el comando no termina, puedes detenerlo con Ctrl+C. Ningún paso necesita datos personales, contraseñas o acceso a producción.

## 01 Problema y primera salida

Un problema es una necesidad que puedes describir antes de elegir tecnología. Aquí queremos saber cuántos colibríes vimos en una reserva. Todavía no pedimos inteligencia artificial, una pantalla ni una base de datos: primero necesitamos una tarea concreta.

Un programa es una secuencia de instrucciones que la computadora ejecuta. console.log muestra un valor en la terminal; no crea un registro. El texto entre comillas es literal: se muestra tal como lo escribes. Los paréntesis delimitan lo que pasas a la instrucción. La línea que empieza con // es un comentario para quien lee y no se ejecuta.

### Ejemplo resuelto

Abre `taller-inicial/01-problema.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
// Todavía describimos una tarea; no estamos guardando observaciones.
console.log('Quiero contar colibríes en la reserva sur.');
```

Desde la carpeta de la aplicación:

```sh
node taller-inicial/01-problema.mjs
```

Resultado esperado:

```text
Quiero contar colibríes en la reserva sur.
```

### Tu cambio

Cambia solo la frase para contar tucanes. Conserva console.log, los paréntesis y las comillas. Antes de ejecutar, escribe qué esperas leer.

Resultado del cambio:

```text
Quiero contar tucanes en la reserva sur.
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Quita la comilla de cierre. Node no puede interpretar la instrucción: informa SyntaxError antes de mostrar la frase.

Texto que debes encontrar en la salida:

```text
SyntaxError
```

**Recuperación:** Recoloca la comilla simple antes del paréntesis: sur.');. Guarda y vuelve a ejecutar. No reinstales Node por un error de escritura.

### Solución razonada

La frase nueva queda entre las mismas comillas: console.log('Quiero contar tucanes en la reserva sur.');. El cambio está en la necesidad expresada, no en la instrucción que muestra el texto.

## 02 Dato y tipo de valor

Un dato es un valor que representa algo del problema. El número 3 representa una cantidad observada. JavaScript distingue números, textos y otros tipos: el tipo explica qué clase de valor tienes. typeof permite consultar ese tipo y aquí imprime number, la palabra que JavaScript usa para número.

El número 3 no es el texto '3'. Las comillas convierten el contenido en texto. Aunque ambos puedan verse como 3 en la pantalla, calcular con ellos puede producir resultados distintos. Por eso conviene mirar tanto el valor como su tipo antes de procesar datos.

### Ejemplo resuelto

Abre `taller-inicial/02-dato.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
console.log(3);
console.log(typeof 3);
```

Desde la carpeta de la aplicación:

```sh
node taller-inicial/02-dato.mjs
```

Resultado esperado:

```text
3
number
```

### Tu cambio

Sustituye los dos números 3 por 5. Predice las dos líneas: cambia el valor, pero no su tipo.

Resultado del cambio:

```text
5
number
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Añade comillas al 3 de typeof. El proceso termina sin error, pero ahora muestra string: has cambiado el significado del dato.

Texto que debes encontrar en la salida:

```text
3
string
```

**Recuperación:** Quita las comillas en typeof y recupera number. Un programa que termina sin error también puede entregar un resultado equivocado.

### Solución razonada

console.log(5) muestra 5 y console.log(typeof 5) muestra number. El ejercicio no registra una observación: solo distingue una cantidad numérica de un texto.

## 03 Variable y cambio de estado

Una variable es un nombre para un valor. let cantidad = 3 crea el nombre cantidad y le asigna el valor 3. El signo = asigna; no pregunta si dos valores son iguales. La segunda línea lee el valor anterior, le suma 1 y guarda el resultado en el mismo nombre.

El estado es el valor que existe en un momento de la ejecución. Después de la asignación, cantidad vale 4. El orden importa: mostrarla antes del cambio daría 3. Esta variable vive solo durante el proceso; cerrar y abrir el programa comienza de nuevo con 3.

### Ejemplo resuelto

Abre `taller-inicial/03-variable.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
let cantidad = 3;
cantidad = cantidad + 1;
console.log(cantidad);
```

Desde la carpeta de la aplicación:

```sh
node taller-inicial/03-variable.mjs
```

Resultado esperado:

```text
4
```

### Tu cambio

Cambia el incremento de 1 a 2 sin cambiar el valor inicial. Explica por qué la salida será 5.

Resultado del cambio:

```text
5
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Escribe el incremento entre comillas. Al combinar número y texto con +, obtienes 31, no 4.

Texto que debes encontrar en la salida:

```text
31
```

**Recuperación:** Devuelve el incremento a 1 sin comillas y observa 4. No cambies el resultado esperado para aceptar una suma incorrecta.

### Solución razonada

cantidad = cantidad + 2 toma el 3 anterior y calcula 5. No escribas cantidad = 2: eso reemplazaría el valor en vez de sumarlo.

## 04 Condición y entrada permitida

Una condición decide qué camino ejecutar. if significa si; else indica el camino alternativo. Entre llaves están las instrucciones de cada camino. const crea un nombre que no reasignaremos. Number.isInteger pregunta si un valor es entero; >= compara si es mayor o igual; && exige que se cumplan ambas comprobaciones.

Una comparación devuelve true si se cumple y false si no. La regla es una cantidad entera de al menos uno. No basta con que sea positiva: 2.5 no representa nuestro conteo. Mostrar Corrige la cantidad no guarda nada ni sustituye la validación del dominio. Solo empezamos a explicar una decisión que la aplicación también tendrá que proteger.

### Ejemplo resuelto

Abre `taller-inicial/04-condicion.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
const cantidad = 3;
if (Number.isInteger(cantidad) && cantidad >= 1) {
  console.log('Cantidad permitida');
} else {
  console.log('Corrige la cantidad');
}
```

Desde la carpeta de la aplicación:

```sh
node taller-inicial/04-condicion.mjs
```

Resultado esperado:

```text
Cantidad permitida
```

### Tu cambio

Sustituye 3 por 4. Luego explica por qué sigue apareciendo Cantidad permitida: el resultado de una condición no tiene que mostrar el número.

Resultado del cambio:

```text
Cantidad permitida
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Prueba cantidad cero. Aparece el camino de corrección; no es un fallo de Node, sino un rechazo válido de la regla.

Texto que debes encontrar en la salida:

```text
Corrige la cantidad
```

**Recuperación:** Vuelve a una cantidad entera positiva. No borres la condición ni aceptes cero para obtener el mensaje de éxito.

### Solución razonada

Con 4, Number.isInteger devuelve true y 4 >= 1 también. Con 0, la segunda comparación devuelve false y se ejecuta else. true y false representan sí y no.

## 05 Función y resultado reutilizable

Una función reúne instrucciones bajo un nombre. function describirCantidad(cantidad) declara un parámetro: el nombre local que recibirá el valor de cada llamada. return entrega un resultado a quien llamó. Declarar la función no la ejecuta; describirCantidad(3) sí la llama.

Las comillas invertidas permiten insertar un valor con ${cantidad}. Primero la función produce el texto y luego console.log lo muestra. Separar producir un resultado de mostrarlo permite reutilizar la misma función desde una terminal, una pantalla o una prueba. Aquí solo formatea texto: no valida ni autoriza registros.

### Ejemplo resuelto

Abre `taller-inicial/05-funcion.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
function describirCantidad(cantidad) {
  return `Colibríes observados: ${cantidad}`;
}
console.log(describirCantidad(3));
```

Desde la carpeta de la aplicación:

```sh
node taller-inicial/05-funcion.mjs
```

Resultado esperado:

```text
Colibríes observados: 3
```

### Tu cambio

Llama a la misma función con 5 en vez de 3. No cambies el cuerpo de la función para resolver cada cantidad.

Resultado del cambio:

```text
Colibríes observados: 5
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Quita return de la segunda línea. La función calcula un texto, pero no lo entrega: console.log recibe undefined, es decir, un resultado no definido.

Texto que debes encontrar en la salida:

```text
undefined
```

**Recuperación:** Recoloca return antes del texto. El resultado debe volver a ser Colibríes observados: 3.

### Solución razonada

describirCantidad(5) entrega el parámetro 5 a la misma plantilla. El nombre cantidad dentro de la función no es una variable global ni conserva el valor de la llamada anterior.

## 06 Objeto e identidad del registro

Un objeto agrupa propiedades con nombre. En observacion, id identifica cuál observación es; ambito indica a qué reserva pertenece; especie y cantidad describen lo visto. revision identifica la versión del hecho y observadaEn conserva el instante en texto con zona UTC. La notación observacion.cantidad lee una propiedad.

No confundas identidad con cantidad: cambiar 3 a 4 describe otro contenido, no otro identificador. El ámbito tampoco es una etiqueta decorativa: más adelante limitará el acceso. Este literal todavía no es una entidad validada ni está guardado; la construcción del dominio, en las últimas unidades, hará obligatorias sus reglas.

### Ejemplo resuelto

Abre `taller-inicial/06-objeto.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
const observacion = {
  id: 'obs-taller-001', ambito: 'reserva-sur', especie: 'colibri',
  cantidad: 3, revision: 1, observadaEn: '2026-10-19T12:00:00Z'
};
console.log(`${observacion.id}: ${observacion.cantidad} en ${observacion.ambito}`);
```

Desde la carpeta de la aplicación:

```sh
node taller-inicial/06-objeto.mjs
```

Resultado esperado:

```text
obs-taller-001: 3 en reserva-sur
```

### Tu cambio

Cambia únicamente cantidad a 4. Conserva id, ámbito, revisión y fecha para reconocer la misma forma de documento.

Resultado del cambio:

```text
obs-taller-001: 4 en reserva-sur
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Quita la d final al leer cantidad. JavaScript permite pedir una propiedad que no existe y devuelve undefined.

Texto que debes encontrar en la salida:

```text
obs-taller-001: undefined en reserva-sur
```

**Recuperación:** Corrige la lectura a observacion.cantidad. No crees dos propiedades casi iguales para ocultar un error de nombre.

### Solución razonada

El objeto queda con cantidad: 4 y la lectura sigue siendo observacion.cantidad. La salida conserva obs-taller-001 y reserva-sur, porque no modificaste esas propiedades.

## 07 Archivo y lectura de un documento

Un archivo conserva bytes fuera del programa. observacion.json contiene un documento de datos: JSON usa llaves, nombres entre comillas dobles y no admite comentarios ni comas finales. El archivo ya existe; esta unidad lo lee, no escribe una base de datos. Reiniciar el proceso no cambia su contenido.

import incorpora una función existente. node:fs es el módulo de archivos que viene con Node y readFileSync lee texto de forma síncrona: espera hasta terminar. new URL localiza observacion.json junto al programa mediante import.meta.url, independientemente de la terminal. JSON.parse convierte el texto en un objeto. Son herramientas de infraestructura, no reglas del dominio.

### Ejemplo resuelto

Abre `taller-inicial/07-archivo.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
import { readFileSync } from 'node:fs';
const texto = readFileSync(new URL('./observacion.json', import.meta.url), 'utf8');
const observacion = JSON.parse(texto);
console.log(`Archivo leído: ${observacion.cantidad} colibríes`);
```

Archivo de apoyo: `taller-inicial/observacion.json`.

```json
{
  "id": "obs-taller-001",
  "ambito": "reserva-sur",
  "especie": "colibri",
  "cantidad": 3,
  "revision": 1,
  "observadaEn": "2026-10-19T12:00:00Z"
}
```
Desde la carpeta de la aplicación:

```sh
node taller-inicial/07-archivo.mjs
```

Resultado esperado:

```text
Archivo leído: 3 colibríes
```

### Tu cambio

Abre taller-inicial/observacion.json y cambia solo "cantidad": 3 por "cantidad": 4. Guarda ese archivo, no el programa lector.

Resultado del cambio:

```text
Archivo leído: 4 colibríes
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Añade una segunda coma después de la cantidad. JSON.parse informa SyntaxError: el documento no tiene una sintaxis válida.

Texto que debes encontrar en la salida:

```text
SyntaxError
```

**Recuperación:** Deja una sola coma y vuelve a ejecutar el lector. No borres el documento ni reemplaces la lectura por un valor fijo.

### Solución razonada

El lector no cambia: lee la nueva cantidad del archivo. JSON.parse no valida la cantidad positiva, la autorización o la revisión; esas reglas siguen perteneciendo a la aplicación y al dominio.

## 08 Módulo y responsabilidad compartida

Un módulo es un archivo que ofrece piezas a otros archivos. reglas.mjs usa export para ofrecer cantidadPermitida; 08-modulo.mjs la recibe con import. La ruta ./reglas.mjs significa el archivo vecino, con ese nombre y extensión. No requiere descargar un paquete.

Abre reglas.mjs antes de ejecutar. La función contiene la condición que ya conoces y devuelve true o false. Compartir esta regla evita copiarla en dos pantallas y olvidar actualizar una. No concede acceso ni guarda datos: cada pieza tiene una responsabilidad. La aplicación de referencia conserva su validación propia; este archivo es una pieza didáctica, no una nueva autoridad paralela.

### Ejemplo resuelto

Abre `taller-inicial/08-modulo.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
import { cantidadPermitida } from './reglas.mjs';
console.log(`¿Cantidad permitida? ${cantidadPermitida(3)}`);
```

Archivo de apoyo: `taller-inicial/reglas.mjs`.

```js
// Una regla pura devuelve un valor: no guarda datos ni concede permisos.
export function cantidadPermitida(cantidad) {
  return Number.isInteger(cantidad) && cantidad >= 1;
}
```
Desde la carpeta de la aplicación:

```sh
node taller-inicial/08-modulo.mjs
```

Resultado esperado:

```text
¿Cantidad permitida? true
```

### Tu cambio

Cambia la llamada a cantidadPermitida(0). Explica por qué false es ahora el resultado correcto y no debes cambiar la regla para obtener true.

Resultado del cambio:

```text
¿Cantidad permitida? false
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Cambia la ruta de import por un archivo inexistente. Node informa ERR_MODULE_NOT_FOUND y no ejecuta el cuerpo del módulo.

Texto que debes encontrar en la salida:

```text
ERR_MODULE_NOT_FOUND
```

**Recuperación:** Restaura ./reglas.mjs. Distingue esta ruta de archivo de un permiso o de una dependencia externa: aquí no hace falta npm install.

### Solución razonada

cantidadPermitida(0) devuelve false porque 0 no cumple >= 1. El archivo consumidor no necesita conocer cómo está escrita la comparación para usar su resultado.

## 09 Error y registro con controles

Un error interrumpe una operación que no puede cumplir su contrato. try intenta ejecutar un bloque; catch recibe el error y permite explicarlo. await espera el resultado de una operación asíncrona antes de seguir. crearAplicacion conecta piezas ya escritas: todavía no necesitas reconstruir cada capa para usar esta entrada.

Ahora sí registramos un objeto en memoria. El contexto indica actor, finalidad, reservas permitidas, capacidades y claveIdempotencia. Los corchetes [] forman una lista de valores; lista.items.length cuenta los elementos devueltos. Autorizar significa comprobar si ese actor puede realizar esa acción en esa reserva. La identidad es sintética para aprender: en un servidor los permisos deben proceder de una sesión confiable, nunca de un formulario editable.

Idempotencia significa que repetir la misma intención con la misma clave y contenido no crea un segundo efecto. Aquí se llama dos veces y se lista una observación. La clave no sirve para enviar contenido distinto: eso se rechaza como IDEMPOTENCY_CONFLICT. El ejemplo es secuencial y en memoria: no demuestra atomicidad, autenticación real ni seguridad frente a solicitudes simultáneas.

### Ejemplo resuelto

Abre `taller-inicial/09-error.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
import { crearAplicacion } from '../src/composition.mjs';
const app = crearAplicacion();
const entrada = {
  id: 'obs-taller-001', ambito: 'reserva-sur', especie: 'colibri',
  cantidad: 3, revision: 1, observadaEn: '2026-10-19T12:00:00Z'
};
// Identidad de aprendizaje; no representa una sesión autenticada.
const contexto = {
  actorId: 'aprendiz', finalidad: 'aprendizaje', ambitos: ['reserva-sur'],
  permisos: ['observaciones:escribir', 'observaciones:leer'],
  claveIdempotencia: 'visita-taller-001'
};
try {
  const guardada = await app.registrar.ejecutar(entrada, contexto);
  await app.registrar.ejecutar(entrada, contexto);
  const lista = await app.listar.ejecutar({ambito: 'reserva-sur', limite: 10}, contexto);
  console.log(`Registrada: ${guardada.id}; cantidad: ${guardada.cantidad}`);
  console.log(`Tras repetir: ${lista.items.length} observación`);
} catch (error) {
  console.log(`Registro rechazado: ${error.codigo}`);
  process.exitCode = 1;
}
```

Desde la carpeta de la aplicación:

```sh
node taller-inicial/09-error.mjs
```

Resultado esperado:

```text
Registrada: obs-taller-001; cantidad: 3
Tras repetir: 1 observación
```

### Tu cambio

Cambia cantidad a 4 y ejecuta en un proceso nuevo. Debes conservar un único registro tras la repetición. No cambies permisos ni elimines la segunda llamada.

Resultado del cambio:

```text
Registrada: obs-taller-001; cantidad: 4
Tras repetir: 1 observación
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Prueba una cantidad cero. El dominio rechaza el registro y catch muestra su código; process.exitCode = 1 comunica a otras herramientas que no fue exitoso.

Texto que debes encontrar en la salida:

```text
Registro rechazado: OBS_QUANTITY_INVALID
```

**Recuperación:** Restaura cantidad: 3. Si aparece ACCESS_DENIED, revisa el ámbito y la capacidad del contexto; nunca retires el autorizador para forzar éxito.

### Solución razonada

Con cantidad: 4 y el mismo contenido en ambas llamadas aparecen cantidad: 4 y Tras repetir: 1 observación. Cada ejecución crea una memoria nueva: repetir el proceso no demuestra persistencia entre reinicios.

## 10 Prueba propia y recuperación de una regresión

Una prueba ejecuta una conducta y compara lo obtenido con lo esperado. node:test ofrece test para nombrar el caso. assert.equal compara dos valores y falla cuando son distintos. new Observacion construye la entidad que valida el registro; no llama al servicio ni guarda nada. () => { ... } escribe una función sin nombre que test ejecutará; entre sus llaves están los pasos del caso.

El caso prepara una entrada de cantidad 3, construye el objeto y comprueba que la cantidad sigue siendo 3. Si cambias una entrada válida a 4 y mantienes la expectativa 3, la prueba falla: has observado una discrepancia real. Revisa primero cuál de las dos representa el requisito antes de cambiar código o expectativa. No cambies una prueba de seguridad para permitir una operación prohibida.

### Ejemplo resuelto

Abre `taller-inicial/10-prueba.test.mjs` en tu copia. Lee cada línea antes de ejecutar.

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { Observacion } from '../src/domain/observacion.mjs';

test('conserva la cantidad observada', () => {
  const observacion = new Observacion({
    id: 'obs-taller-001', ambito: 'reserva-sur', especie: 'colibri',
    cantidad: 3, revision: 1, observadaEn: '2026-10-19T12:00:00Z'
  });
  assert.equal(observacion.cantidad, 3);
});
```

Desde la carpeta de la aplicación:

```sh
node --test --test-reporter=tap taller-inicial/10-prueba.test.mjs
```

Resultado esperado (el informe también incluye nombres y duración):

```text
# pass 1
# fail 0
```

### Tu cambio

Primero cambia solo cantidad: 3 a cantidad: 4 y observa fail 1. Después ajusta la expectativa a 4 porque tu nuevo caso pide conservar cuatro. Vuelve a ejecutar y conserva ambas salidas.

Resultado del cambio:

```text
# pass 1
# fail 0
```

### Provocar y reparar un fallo

Antes de esta parte restaura el ejemplo original desde la copia conservada, para no mezclar dos cambios.

Cambia únicamente la cantidad de entrada a 4. Debe haber una prueba fallida, no cero pruebas. El informe muestra que 4 no coincide con 3.

Texto que debes encontrar en la salida:

```text
ERR_ASSERTION
```

**Recuperación:** Para completar el ejercicio de cuatro, conserva cantidad: 4 y cambia assert.equal(observacion.cantidad, 3) a assert.equal(observacion.cantidad, 4). Para volver al caso original, restaura ambos valores a 3.

### Solución razonada

La solución tiene cantidad: 4 en la entrada y assert.equal(observacion.cantidad, 4) en la comprobación. Una prueba aprobada no demuestra todo el sistema: este caso solo comprueba conservación de una cantidad válida. La suite general añade rechazos y otros controles.

## Tu tarea final

Ejecuta npm test desde la copia de ecosistema-app. Deben ejecutarse pruebas y terminar con fail 0. No memorices una cifra total histórica: el proyecto sigue creciendo. El comando de la unidad 10 selecciona una sola prueba; npm test comprueba la aplicación y el taller.

Realiza una tarea sin mirar la solución: registra cinco colibríes, conserva una sola observación al repetir y escribe una prueba que espere cinco. Explica cuál es el dato, cuál es su identidad, qué reserva lo limita y por qué cero debe rechazarse. Entrega el archivo cambiado, comando y salida, no solo una captura de un mensaje de éxito.

Si te atascas, registra unidad, paso, mensaje literal y qué entendías antes del fallo; no incluyas información personal. Compara con la recuperación de esa unidad. Puedes restaurar un archivo desde tu copia original sin borrar la carpeta de trabajo.

Continúa con Tu primer proyecto con COBRIA y Datos desde cero. Este taller no demuestra que una persona principiante haya comprendido el material: esa comprobación requiere observar una tarea real con consentimiento apropiado.

## Continuar

[Tu primer proyecto con COBRIA](26-primer-proyecto-paso-a-paso.md) · [Datos desde cero](27-datos-desde-cero.md).

Fuente editorial: editorial/ep2/recorrido.mjs. Código: replication/examples/ecosistema-app/taller-inicial/. Este capítulo se genera; no se edita la copia derivada.
