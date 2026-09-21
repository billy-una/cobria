# Pipeline de promoción

```text
cambio → pruebas → artefacto inmutable → preview → humo
       → aprobación staging → staging → humo + rollback ensayado
       → aprobación producción → producción → humo → observación
```

Una promoción reutiliza el mismo digest. `preview` admite ramas; `staging` solo `main` o `release/*`; producción y recuperación solo `main`. La identidad del pipeline es distinta en cada ambiente y recibe permisos mínimos.

El gate falla cerrado si el destino, cuenta o rama no coincide; faltan variables o reglas; las pruebas fallan; no existe plan de humo; el digest no tiene forma verificable; o falta rollback. El workflow `delivery-gates.yml` modela estas dependencias sin desplegar en un proveedor no configurado.

Después de desplegar se ejecuta humo de salud, escritura idempotente, lectura por ámbito, denegación cruzada y reconstrucción verificable. Si falla un criterio, no se promueve. En producción se inicia rollback y luego se investiga; no se “corrige directamente” el artefacto publicado.
