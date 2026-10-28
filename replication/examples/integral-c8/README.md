# Aplicación integral C8

Recorrido unificado EP4 y responsabilidades:
[proyecto conductor](../../../editorial/ep4/ENTREGA.md).
Desde la raíz: `node replication/examples/integral-c8/recorrido-ep4.mjs`.

Recorrido y límites: [guía del taller](../../../manuales/33-aplicacion-integral-neutral.md).
Ejecute desde la raíz `npm ci --prefix replication`, después
`npm start --prefix replication/examples/integral-c8`.

PouchDB 9.0.0/LevelDB real, datos ficticios locales que permanecen en disco.
`npm test --prefix replication/examples/integral-c8` ejecuta integración real;
`npm run verificar --prefix replication/examples/integral-c8` conserva copia y
comprueba reapertura, restauración y reconstrucción. No es producción ni un benchmark.
