# Guía paso a paso

## Antes de comenzar

Necesita Node.js compatible con `node:test`. No necesita una cuenta cloud ni datos reales.
Ejecute `npm test` después de cada hito. Las pruebas negativas son parte del resultado.

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

`npm test` aprueba 23 pruebas. `HITOS.json` permite relacionar cada paso con código y una
prueba. Los hitos documentales continúan requiriendo lectura; el validador no simula que
una persona comprendió el material.
