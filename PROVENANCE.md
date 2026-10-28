# Procedencia y derechos del material COBRIA

**Versión del inventario:** 1.0.0  
**Corte:** COBRIA `1.0.0-rc2`  
**Autor responsable:** Billy Jak Cordero Porras  
**Naturaleza:** propuesta independiente, no certificada

Este documento permite determinar de dónde procede cada clase de material y bajo qué
condiciones se publica. El inventario verificable archivo por archivo se encuentra en
`editorial/provenance.json`; `make verificar-procedencia` comprueba rutas, tamaños y
huellas SHA-256.

## Mapa de derechos

| Clase | Procedencia | Licencia o condición |
|---|---|---|
| Código propio | Implementación escrita para COBRIA | Apache-2.0 |
| Texto y documentación | Redacción de Billy Jak Cordero Porras, con apoyo de herramientas de IA bajo revisión y responsabilidad del autor | CC-BY-4.0 |
| Ilustraciones | Generadas específicamente para COBRIA por encargo y dirección del autor mediante una herramienta generativa; seleccionadas, tituladas y maquetadas por el autor | CC-BY-4.0 sobre los derechos que correspondan al autor; no se garantiza exclusividad |
| Diagramas SVG y figuras | Generados desde datos y código propios | CC-BY-4.0 |
| Datos experimentales | Cargas sintéticas y resultados producidos por los protocolos declarados | CC-BY-4.0 |
| Dependencias | Paquetes declarados por lockfile y SBOM | Licencia original de cada dependencia |
| Tipografías del libro y web | Inter y Roboto Mono locales, obtenidas de google/fonts en revisión fijada; fuentes y avisos íntegros en ambos productos; registro `editorial/fonts.json` | SIL Open Font License 1.1; no se atribuyen a COBRIA |
| Proyectos observados | POS Guápiles, CRMHotel y BSHandball en commits congelados | Solo observación y referencia; no se copia ni relicencia su código |
| Artefactos históricos | Construcciones anteriores conservadas en `archivo/artefactos/` | No canónicos; mantienen el régimen aplicable a sus fuentes |

## Ilustraciones

Las escenas de flora, fauna, paisaje y documentos se crearon para explicar conceptos
de COBRIA. No se utilizó una imagen de referencia de terceros como fuente declarada.
Algunas copias del sitio son duplicados byte a byte de originales del libro; el JSON de
procedencia enlaza cada copia con su archivo canónico. Las imágenes no deben
interpretarse como representación científica exacta de especies o lugares.

## Repositorios de referencia

COBRIA estudia estructura, responsabilidades y tensiones de ingeniería en tres
repositorios del mismo autor. Los commits se congelan para reproducibilidad. La ausencia
de una licencia raíz en el commit observado se registra como `sin licencia pública
declarada`; por ello COBRIA no presume permiso de copia y conserva únicamente enlaces,
huellas, rutas y observaciones analíticas.

- POS Guápiles: <https://github.com/billy-una/posguapiles>, commit
  `ae8d63ce535ecff40059b49d8b8c9f050c353d96`.
- CRMHotel: <https://github.com/billy-una/CRMHOTEL>, commit
  `b7b0f8e83871df1220865931f53424d8dd39772c`.
- BSHandball: <https://github.com/billy-una/BSHandball>, commit
  `09c15acd14ab806abe436a8176ef3247c61a2df6`.

Los archivos `fontawesome-free/LICENSE.txt` encontrados dentro de dos repositorios
corresponden a una dependencia vendorizada y no conceden una licencia global sobre el
proyecto anfitrión.

## Dependencias y marcas

### Adaptación glob local del sitio

`sitio/vendor/glob-compat/` es código original COBRIA (Apache-2.0), no código
copiado de fast-glob, micromatch o braces. Su nombre de importación compatible es
`fast-glob`, versión privada `0.0.0-cobria.1`; no es una publicación oficial de ese
proyecto. El tarball local es un derivado reproducible de esas fuentes y se incluye
para la instalación determinista desde lockfile. Las pruebas comparan las fuentes
con el código y metadatos realmente instalados.

Se apoya en tinyglobby 0.2.17, proyecto de SuperchupuDev con licencia MIT,
procedencia: <https://github.com/SuperchupuDev/tinyglobby>. Esta dependencia y sus
dependencias conservan sus licencias, no se relicencian como Apache. La sustitución
debe retirarse o revisarse al cambiar consumidores; no se declara compatibilidad
general con toda la API de fast-glob. Véase `sitio/vendor/README.md`.

Los archivos `package-lock.json` y `replication/SBOM.cdx.json` son el inventario técnico
de dependencias. React, Node.js, TypeScript, MongoDB, CouchDB, OpenSearch, Cloudflare y
demás nombres pertenecen a sus titulares. Su mención describe interoperabilidad o
evaluación y no implica patrocinio.

## Límite de la declaración

### Corte bibliográfico y técnico EP7

`editorial/ep7/provenance-audit.json` contrasta las huellas del inventario anterior
y las fuentes tipográficas originales y derivadas. La declaración de origen de
una ilustración asistida por IA no acredita por sí misma recibos, herramienta,
modelo, fecha o prompt de generación; esos datos no se inventan desde el archivo.
El corpus de referencias y sus restricciones de consulta están en
`editorial/ep7/references.json` y `editorial/ep7/link-check.json`.
Las obras citadas se enlazan y parafrasean: no se relicencian ni se redistribuyen
sus textos o figuras como material propio COBRIA. El doble cribado sigue pendiente.

Este inventario es una declaración técnica y editorial del autor, no una opinión legal.
Si se detecta una atribución incorrecta, el recurso debe ponerse en cuarentena y quedar
fuera de la próxima distribución hasta corregir su procedencia.
