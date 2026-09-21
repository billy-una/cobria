# Auditoría de cierre — fase 7

**Fecha:** 2026-09-19  
**Alcance:** seguridad, privacidad y cadena de suministro del ecosistema y de la aplicación neutral.

## Resultado

El gate se cierra para el alcance verificable del repositorio: las operaciones sensibles implementadas declaran actor, capacidad, ámbito, finalidad, campos de auditoría y prueba negativa. La autorización ocurre antes del repositorio, niega comodines y valida la gramática del ámbito. La evidencia usa lista positiva y no conserva documentos, secretos ni claves de idempotencia.

Se documentaron amenazas y fronteras, reglas para seis nodos, privacidad y retención, secretos, webhooks, abuso, suministro e incidentes. El SBOM CycloneDX forma parte del gate.

La revisión de dependencias del 2026-09-19 informó dos entradas moderadas en la cadena
PouchDB–UUID y ninguna alta o crítica. La aceptación temporal, alcance y condición de
cierre se conservan en `REGISTRO-RIESGOS-DEPENDENCIAS.md`; CI bloquea desde severidad alta.

## Evidencia

- Contrato: `specification/phase-7/security.json`.
- Decisión: `specification/ADR-0007-CAPACIDADES-MINIMAS-Y-AMBITO.md`.
- Implementación: `application/security/autorizar-capacidad.mjs` y `infrastructure/security/auditoria-memoria.mjs`.
- Pruebas: identidad/finalidad ausentes, ámbito ajeno, ámbito manipulado, permiso comodín, repetición alterada y minimización de auditoría.
- Validador: `replication/scripts/validate-phase7.py`.

## Límites

No se declara seguro un despliegue productivo. Quedan identidad real, controles del proveedor, firma de webhooks, límites distribuidos, cifrado y rotación administrados, restauración, carga adversaria, procedencia firmada y ejercicio humano de incidentes. La revisión legal corresponde al contexto de uso.
