# Manual de ambientes

Los ambientes son cuentas y datos aislados, no sufijos de una misma colección. `local` y `test` son desechables; `preview` demuestra cada cambio; `staging` ensaya promoción y rollback; `production` sirve tráfico real; `recovery` restaura continuidad. El inventario canónico está en `environments.json`.

Cada despliegue fija destino, cuenta de carga, rama, digest del artefacto, variables esperadas, reglas probadas, resultado de pruebas, plan de humo y artefacto de rollback. El artefacto se construye una vez y se promueve sin recompilar. Ningún archivo contiene credenciales.

`staging` jamás recibe una copia de producción con datos personales. Solo admite datos sintéticos o una transformación anonimizada cuya irreversibilidad y utilidad hayan sido verificadas. Enmascarar visualmente o cambiar identificadores no equivale a anonimizar.

Los alias Firebase de ejemplo expresan separación, pero no obligan a usar Firebase: otro proveedor debe conservar la misma semántica. App Check complementa, pero no sustituye, identidad y autorización del servidor.
