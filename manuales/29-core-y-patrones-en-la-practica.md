# Core y patrones en la práctica

Un patrón ayuda a resolver un problema repetido. No hace falta aplicar los treinta
para empezar un programa. Comience con una colección documental, una entrada validada
y una consulta. Añada una proyección cuando una medición y un requisito de lectura
justifiquen mantener otra representación.

## Enseñanza y conformidad no son lo mismo

El catálogo enseña treinta mecanismos. Sus funciones TypeScript trabajan en memoria:
aceptan entradas y devuelven resultados o errores. Core 1.0, en cambio, exige garantías
del sistema completo. Su única fuente normativa es
[la especificación congelada](../specification/COBRIA-CORE-1.0.md).
Una función que recibe `mismaTransaccion: true` no implementa una transacción.
Un ámbito coincidente no autentica a la persona que lo envía.

## Ejecutar los ejemplos

Requiere Node.js 22.13 o superior y npm. Desde la raíz del repositorio:

```sh
npm ci --prefix replication
npm test --prefix replication/examples/patterns-r4
```

La instalación necesita acceso al registro de paquetes. El segundo paso compila
TypeScript y ejecuta 61 pruebas: una de inventario y dos por patrón. No inicia un
motor NoSQL ni escribe en producción. Un resultado de cero pruebas no es aceptación.
Los fragmentos requieren los tipos y ayudantes de `src/patrones.ts`; use el proyecto
completo, no pegue una función aislada esperando un programa autónomo.

Para regenerar catálogo, fragmentos, HTML del libro y páginas estáticas y comprobar su vinculación,
ejecute `make verificar-c4` con las dependencias anteriores instaladas. Esta puerta
local no construye ni publica el sitio completo.

Para concentrarse en ámbito, después de compilar:

```sh
node --test --test-name-pattern='^patrón 3:' replication/examples/patterns-r4/dist/test/patrones.test.js
```

Se esperan dos pruebas aprobadas. El documento ajeno provoca `SCOPE_DENIED`.
El ámbito del ejemplo se considera previamente autorizado: en una aplicación debe
derivarse de identidad, capacidad y finalidad verificadas, no de un formulario libre.

## Del árbol observado a un derivado

1. Registre el árbol `roble-42` dentro de `reserva-sur` con revisión 1 (patrón 1).
2. Lea solo documentos del ámbito autorizado (3); interprete códigos con su edición (4).
3. Si necesita conteos frecuentes, compare consulta e índice nativo antes de otra copia (19).
4. Si la proyección se justifica, reconstruya una candidata y verifique su significado (7).
5. Publíquela solo después de verificarla (9). En producción, pruebe el cambio atómico
   y una interrupción durante publicación con el adaptador real.

Estas funciones ilustran decisiones relacionadas; no constituyen una aplicación
integrada ni una prueba de rendimiento distribuido. La integración corresponde a C8.

## Elegir y descartar un patrón

Cada ficha debe leerse con cinco preguntas: qué resultado muestra, qué entrada rechaza,
qué alternativa más simple existe, qué costo añade y qué garantía todavía no demuestra.
`editorial/pattern-decisions.mjs` conserva las alternativas y límites por patrón;
`replication/examples/patterns-r4/cases.json` contiene las entradas y resultados.
El catálogo generado vincula ambas fuentes al código del libro y del sitio.

Mida latencia con la misma consulta y frescura, almacenamiento, escrituras añadidas,
recuperación y esfuerzo de mantenimiento. Los costos narrativos no son cifras medidas.
Retire una proyección cuando no tenga consumidores y pueda conservar su fuente.

## Comprobar Core por separado

Complete fuente, transformación, parámetros, ámbito, versión, frescura, equivalencia,
reconstrucción y responsable de cada proyección. Luego ejecute las pruebas del perfil
con el adaptador elegido y conserve el informe y sus límites. Las pruebas de patrones
no otorgan C1, C2 ni C3 ni reemplazan concurrencia, reinicios o fallos de red.

La comprensión por lectores y la implementación sin ayuda del autor requieren
participantes externos en C13; no se infieren de estos tests locales.
