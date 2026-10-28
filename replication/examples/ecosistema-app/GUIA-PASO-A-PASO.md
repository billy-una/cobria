# Guía paso a paso

## Antes de comenzar

Necesita Node.js compatible con `node:test`. No necesita una cuenta cloud ni datos reales.
Ejecute `npm test` después de cada hito. Las pruebas negativas son parte del resultado.

Para comenzar sin experiencia, siga [Tu primer proyecto](../../../manuales/26-primer-proyecto-paso-a-paso.md).
Desde la raíz puede ejecutar `npm --prefix replication/examples/ecosistema-app test`
y `npm --prefix replication/examples/ecosistema-app start`. La demo muestra registro,
repetición y rechazos con contexto sintético autorizado, no una sesión real de usuario.

## Cómo se conecta con el libro y el sitio

La aplicación es el proyecto conductor del currículo de 17 partes. No implementa una
segunda teoría: convierte cada parte en un hito observable. Las 85 lecciones viven en
`editorial/curriculum.json` y las rutas individuales del sitio; los 30 laboratorios
practican el mismo recorrido.

| Partes | Hitos principales | Laboratorios |
|---|---|---|
| 01–02 · primeros pasos y fundamentos | B01–B02 | LAB-01–LAB-04 |
| 03–05 · arquitectura, capas y código | B02–B03 | LAB-05–LAB-10 |
| 06 · bases y diccionario de datos | B04–B05 | LAB-11–LAB-12 |
| 07–08 · Core y patrones | B07–B09 | LAB-13–LAB-16 |
| 09–10 · API y documentación | B01–B14 | LAB-17–LAB-20 |
| 11–13 · seguridad, calidad y operación | B06, B12–B13 | LAB-21–LAB-26 |
| 14 · analítica e inteligencia artificial | B10–B11 | LAB-27–LAB-28 |
| 15–17 · aplicación, herramientas y evidencia | B01–B14 | LAB-29–LAB-30 |

## B01–B04: entender y modelar

Lea el problema en `README.md`, escriba actores y límites, y recorra `Observacion`. Cambie
una invariante para observar una prueba fallida. Después siga las dependencias desde
`composition.mjs` hasta el puerto y el Dater. Compruebe que las claves físicas no llegan al
dominio.

## B05–B09: guardar, proteger y exponer

Compare los tres adaptadores. Registre la misma operación dos veces y reutilice la clave
con contenido diferente. Intente otro ámbito. Observe el problema RFC 9457 y pagine con un
cursor opaco. Retire el resumen y reconstrúyalo desde canónicos.

## B10–B11: analítica e IA

Construya un conjunto con consentimiento y tiempos válido/conocido. Introduzca la misma
entidad a ambos lados del corte. Después recupere evidencia en un ámbito autorizado,
compruebe las citas y ejecute una consulta sin evidencia. Confirme que ningún resultado
expone una operación de escritura.

## B12–B14: demostrar, operar y retirar

Desde la raíz ejecute:

```bash
make verificar-cierre-8-9
make validar-ensayo-operacional-8-9
```

Lea los límites del cierre. Sustituir memoria por infraestructura real exige repetir
contratos, seguridad, rendimiento, respaldo y restauración. Un resultado local no se
renombra como producción.

## Resultado esperado

Para conectar registro, reconstrucción, analítica y citas en una ejecución:

```sh
node src/recorrido-build.mjs
```

Ejecute desde esta carpeta. La [guía Build y Toolkit](../../../editorial/ecosistema-11-12/ENTREGA.md)
incluye ejercicios y soluciones. El recorrido utiliza memoria y consentimiento sintético;
no despliega staging ni llama a un modelo generativo.

`npm test` debe ejecutar pruebas pertinentes y terminar sin fallos. `HITOS.json` permite relacionar cada paso con código y una
prueba. Los hitos documentales continúan requiriendo lectura; el validador no simula que
una persona comprendió el material.
