# Manual de sincronización editorial

## Fuentes y derivados

La especificación conserva obligaciones; la implementación demuestra mecanismos; los
resultados conservan evidencia; artículo y documento maestro argumentan; libro y sitio
enseñan. Un producto posterior puede resumir una fuente anterior, pero no cambiar su
autoridad ni promover evidencia pendiente a ejecutada.

`editorial/canonical.json` centraliza identidad, nombres de productos, versiones, módulos
y afirmaciones cuantitativas compartidas. `editorial/products.json` registra fuente,
construcción y salida de cada producto. Los archivos bajo `generated/` no se editan.

## Flujo

1. cambie la fuente autorizada;
2. actualice una afirmación solamente cuando exista su evidencia;
3. ejecute `make sincronizar-editorial`;
4. revise el diff generado;
5. construya el producto afectado;
6. ejecute `make verificar`;
7. haga revisión visual de los PDF y del sitio.

## Estados de evidencia

Las expresiones `planificado`, `ejecutado`, `histórico-no-confirmatorio` y
`validado-externamente` no son intercambiables. El artículo puede analizar evidencia
histórica con su límite. El libro y el sitio no convierten esa evidencia en certificación.
