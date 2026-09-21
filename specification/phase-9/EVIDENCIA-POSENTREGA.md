# Evidencia posterior a una entrega

Cada entrega debe producir un paquete con revisión Git, digest del artefacto, ambiente, identidad del pipeline, tiempos, gate previo, migraciones, pruebas, humo, métricas iniciales, alertas, rollback y resultado. El esquema está en `deployment-evidence.schema.json`.

Los estados permitidos distinguen `gate-only`, `deployed`, `rolled-back` y `failed`. La fase 8 solo produjo evidencia `gate-only`; no se transforma en un despliegue ficticio. Una evidencia `deployed` exige endpoint y humo real.

La evidencia no incluye secretos ni salidas completas con datos. Se conserva como artefacto inmutable con el periodo definido por operación y auditoría.
