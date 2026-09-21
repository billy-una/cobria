# Fase 21 — Piloto de adopción COBRIA Engineering

**Estado:** ejecutado como evaluación estructural local  
**Proyecto observado:** POS Guápiles  
**Impacto sobre Core:** ninguno

## Pregunta

¿Puede una persona aplicar los ocho contratos Engineering a un proyecto existente y
obtener una matriz trazable sin modificar el sistema ni confundir archivos con evidencia
de producción?

## Método

El evaluador `assess-engineering-adoption.mjs` recibe un checkout Git, congela remoto,
rama, commit y estado del árbol, comprueba dos fuentes y términos mínimos por contrato,
calcula huellas SHA-256 y genera JSON. Las reglas del piloto son explícitas y todavía
están adaptadas a la estructura de POS Guápiles.

El piloto quedó fijado en `303890830433f5019818a1b4fd696b9e33b45392`. Cambios locales
posteriores del proyecto observado se excluyen; el gate reconstruye ese commit en un
checkout temporal limpio para repetir la evaluación sin alterar el árbol de trabajo.

```bash
node replication/scripts/assess-engineering-adoption.mjs \
  --project ../POSGUAPILES-1 \
  --output specification/phase-21/pilot-posguapiles.json
make verificar-fase-21
```

## Interpretación

`implemented-local` significa que existen artefactos coherentes de implementación o
prueba en el commit inspeccionado. `not-assessed` significa que este piloto no ejecutó
staging, producción, respaldo, rollback, accesibilidad ni transferencia humana. No
significa incumplimiento y tampoco permite declarar validación operacional.

## Resultado esperado

La fase se cierra localmente si los ocho contratos poseen evidencia estructural con
huellas, el repositorio está limpio, el commit coincide con la procedencia de fase 19 y
el informe conserva cero contratos presentados como validados operacionalmente.
