# Fase 22 — Evaluación Engineering dirigida por manifiesto

**Estado:** implementada y ejecutada localmente  
**Impacto sobre Core:** ninguno

## Propósito

Eliminar del evaluador el conocimiento de carpetas y nombres de POS Guápiles. Cada
proyecto declara su repositorio, revisión, alcance, responsables, fuentes y términos en
un manifiesto validable. El motor inspecciona objetos del commit mediante Git, no el árbol
de trabajo, por lo que cambios locales posteriores no contaminan la evidencia.

## Uso

```bash
node replication/scripts/assess-engineering-manifest.mjs \
  --project ../POSGUAPILES-1 \
  --manifest specification/phase-22/adoption-manifest.posguapiles.json \
  --output specification/phase-22/report.posguapiles.json
make verificar-fase-22
```

## Seguridad y límites

- rechaza rutas absolutas, `..`, barras inversas e IDs duplicados;
- exige exactamente `ENG-001..ENG-008`;
- verifica remoto y commit cuando el manifiesto los fija;
- solo lee objetos Git y no ejecuta código del proyecto evaluado;
- presencia textual es evidencia estructural, no prueba semántica ni operacional;
- toda salida conserva `operationallyValidated: 0` mientras no exista otro protocolo.

## Gate

El gate valida esquema, manifiesto, casos negativos, ejecución reproducible y equivalencia
con el piloto de fase 21. La generalización se demuestra cuando el motor no contiene rutas
de POS Guápiles y puede evaluar un fixture Git cuya copia de trabajo está modificada.
