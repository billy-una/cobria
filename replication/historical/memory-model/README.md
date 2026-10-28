# Modelo documental histórico en memoria

Este módulo conserva exactamente el contenido de `replication/src/cobria.mjs`
del commit `7b5293db626aa71ed04fe552610260224a410518`. Su ruta anterior estaba
eliminada en el árbol de trabajo; las cinco pruebas históricas seguían importándola.
Se conserva aquí, sin restaurar la ruta eliminada ni sustituir el núcleo actual.

La recuperación se hizo leyendo el objeto Git y cambiando el import de
`replication/tests/core.test.mjs`. El 16 de octubre también se recuperaron los
ejecutores históricos `run-experiments.mjs` y `run-ai-evaluation.mjs`, que ahora
importan este modelo segregado. No se eliminaron pruebas ni aserciones.

Este modelo síncrono usa revisión inicial cero y reconstrucción sobre el almacén
activo. Por ello no demuestra publicación segura C2 ni conformidad completa Core.
El código vigente por adaptadores está en `replication/src/core/cobria.mjs`;
las pruebas de ese código están en `replication/tests/core11.test.mjs` y las suites
de conformidad correspondientes. No se deben mezclar sus interfaces o resultados.

Ejecute desde la raíz:

```sh
node --test replication/tests/core.test.mjs
```

El material SQL histórico conserva sus referencias originales y queda fuera de
este cierre: no se ejecutó ni se utilizó para producir evidencia NoSQL.
