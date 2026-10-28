# Portabilidad y ejecución continua

C12 separa las pruebas neutrales públicas de la construcción editorial completa.
Su estado es parcial: una configuración preparada no acredita una ejecución remota.
Core 1.0 y el ZIP RC2 congelado no cambian.

## Instalación pública

Desde la raíz de un clon limpio, con Node 22 o 24 y npm:

```sh
npm ci --prefix replication --no-audit --no-fund
npm test --prefix replication
node replication/examples/integral-c8/verificar.mjs
```

El workflow `portable.yml` ejecuta esta secuencia en Linux para ambas versiones,
sin secretos ni repositorios privados. No instala navegadores ni construye PDF.
Los revisores de navegador resuelven ahora Playwright desde la dependencia fijada
de `libro-cobria`, no desde la carpeta personal del autor. Para usarlos:

```sh
npm ci --prefix libro-cobria
cd libro-cobria
npx playwright install chromium
```

En Linux pueden requerirse bibliotecas de sistema y `--with-deps`. La matriz
configurada no demuestra todavía compatibilidad observada en esos sistemas.

## Comprobación local observada

El 18 de octubre de 2026 se creó un clon local Git sin enlaces duros en
`/tmp/cobria-c12-clone-C8JKaJ/repo`, del commit
`f6842b22210d062b52d4a32afc93d5fd950fda2b`, inicialmente sin cambios.
`npm ci` instaló 81 paquetes desde el lockfile; las 150 pruebas pasaron y el
recorrido C8 comprobó reapertura, restauración y reconstrucción con PouchDB/LevelDB.
La compilación de dependencias nativas necesitó las herramientas C++ de macOS.
Es un clon local en la misma computadora con Node 24.2.0, no una réplica externa,
ni prueba de Linux o de Node 22. No se construyeron todos los PDF en ese clon.

La verificación general `make verificar COBRIA_SITE_ISOLATED=1` terminó con código
cero en el árbol de trabajo, incluida la construcción aislada del sitio.
Los logs locales se conservan en `output/review/c12/`; no sustituyen un artefacto
remoto. Las adiciones posteriores de la sonda y del historial completo en CI no
forman parte del commit clonado indicado arriba.

## Requisitos de la construcción integral

El workflow histórico `ci.yml` necesita TeX, Python, Java, Go, Chromium y acceso
autorizado de lectura mediante `COBRIA_REFERENCE_TOKEN` a estas referencias:

- https://github.com/billy-una/posguapiles
- https://github.com/billy-una/CRMHOTEL
- https://github.com/billy-una/BSHandball

Ese acceso no se concede con la licencia de COBRIA. El workflow histórico obtiene
las ramas por defecto: falta fijar las revisiones exactas compatibles antes de
afirmar reproducibilidad integral. No se omiten sus validadores para simular éxito.
La construcción doble histórica de R9 no acredita los cambios posteriores de C12.

## Criterios pendientes

La sonda `node replication/scripts/probe-stream-c12.mjs`, tras instalar `sitio`,
reproduce `ERR_STREAM_UNABLE_TO_PIPE` en Node 24.2.0 al pasar un destino destruido
a `sendWebResponse` del proveedor instalado. Esto identifica una condición
suficiente para la firma observada, no demuestra la causa de todas las solicitudes
de C10 ni constituye una corrección. No se modifica `node_modules` para ocultarla.

1. Registrar URL, SHA, sistema, versiones y resultado de una ejecución remota real
   de la nueva matriz; no se ha enviado ni desplegado este cambio.
2. Construir el estado actual completo desde un clon Git limpio y conservar logs;
   una copia aislada de archivos no basta.
3. Fijar y comprobar las revisiones de las referencias autorizadas.
4. Aislar el error `ERR_STREAM_UNABLE_TO_PIPE` registrado en C10, con regresión
   para desconexión del cliente y prueba del servidor de producción.
5. Eliminar las demás rutas personales de herramientas históricas antes del cierre.

C11 continúa pendiente de reconciliar maestro, especificación y artículo. C12 no
autoriza publicación ni sustituye revisión humana o réplica externa.
