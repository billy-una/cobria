# Inventario e integridad del árbol candidato

PC0 corrige la verificación del manifiesto de `replication/`. La línea base es
`0c89c1ee27923dfdf612d5d9bec0ed3bd8698c1d`; el árbol de trabajo incorpora las
modificaciones registradas en el inventario generado. No se crea ni publica una release.

## Alcance y autoridad

El inventario general enumera rutas versionadas y nuevas no ignoradas mediante Git;
su clasificación por ubicación es orientativa. Las fuentes normativas están en
`specification/`; el maestro en `main.tex` y `partes/`; artículo, manuales y fuentes
editoriales conservan sus respectivas responsabilidades. `editorial/generated/`,
el currículo, HTML construidos y PDF son derivados según su generador. Los recursos
públicos requieren comprobar procedencia: estar en `public/` no prueba ser un derivado.
Los resultados experimentales conservan sus protocolos y no se editan en PC0.

El manifiesto exacto tiene alcance **exclusivo de `replication/`**, no del repositorio
completo ni del ZIP RC2. Su campo `scope` distingue el árbol de trabajo de una entrega
inmutable. La identidad canónica RC2 se conserva como contexto, no como afirmación de
que ese ZIP histórico contiene las modificaciones actuales.

## Política de inventario

`replication-tree-v2`, implementada en `replication/scripts/release_manifest.py`:

- Incluye todos los archivos regulares del árbol de réplica no excluidos, incluidos
  archivos nuevos no versionados. No basta con recorrer entradas del manifiesto.
- Excluye directorios completos `node_modules`, `tmp`, `dist`, `__pycache__` y `.git`;
  son dependencias, temporales o salidas regenerables. Sus contenidos no se inspeccionan.
- Excluye `.DS_Store` y el propio `RELEASE-MANIFEST.json` en la raíz. No hay huella autorreferente.
- Rechaza enlaces simbólicos encontrados, incluso rotos o dirigidos a directorios;
  no los sigue. Rechaza también archivos especiales fuera de las exclusiones.
- Rechaza nombres `.env*`, `.npmrc`, `.netrc` y extensiones `.pem`, `.key`, `.p12`, `.pfx`
  fuera de directorios excluidos. No es detección de secretos por contenido.
- Solo admite rutas relativas canónicas sin segmentos vacíos, `.` o `..`, barras
  invertidas ni duplicados. Comprueba conjunto completo, tamaño y SHA-256.

El generador y el validador comparten la política; sus pruebas adversas comprueban
independientemente los comportamientos. Modificar la política exige revisar pruebas,
documentación y diferencias del manifiesto; no debe usarse para ocultar un archivo.

## Órdenes desde la raíz

```sh
# Escritura explícita: solo después de revisar cambios empaquetables.
make generar-manifiesto-paquete

# Solo lectura del árbol y manifiesto; no lo repara.
make verificar-integridad-paquete

# Regresiones y comprobación de integridad.
make verificar-pc0

# Registro local del SHA, rutas y huellas; no publicación.
python3 replication/scripts/capture-pc0-inventory.py
```

La CI de integridad ejecuta `make verificar-pc0` sobre el manifiesto conservado, sin
regenerarlo. La ejecución remota sigue pendiente de C12/PC8; cambiar el YAML no la acredita.
Las regresiones Python entran en las pruebas del currículo y `make verificar` incluye
también `verificar-pc0`, de modo que no puede pasar con el manifiesto desactualizado.

## Evidencia y cierre

Las regresiones cubren inventario válido, omisión, modificación, archivo inesperado,
archivo borrado, duplicado, rutas inseguras, enlaces de archivo/directorio/rotos,
nombres sensibles, exclusiones, metadatos, autorreferencia y órdenes sin regeneración.
El inventario local se genera en `output/review/pc0/inventory.json`, con SHA de fuentes,
estado Git, huella del manifiesto, Core y ZIP histórico si está disponible. Los logs de
verificación se conservan en ese mismo directorio. El registro identifica el árbol
con cambios, no finge que el commit de partida contiene ya la corrección.

Antes de entregar: ejecutar pruebas, verificación general, validar nuevamente el
manifiesto después de cualquier generación y comprobar que Core/RC2 conservan sus huellas.
El roadmap registra el cierre local; publicación, reproducción externa y revisión
independiente permanecen fuera del alcance de PC0.

Comprobación local del 18 de octubre de 2026: 16 pruebas específicas aprobadas,
486 archivos en el manifiesto y 33 pruebas Python aprobadas. Las huellas congeladas
comprobadas son `9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179`
para Core y `be7c9fa805710db222780358917d2322d5d67f8a39d826dee45328f2d3a655e7`
para el ZIP RC2. El inventario registra 1153 rutas en este árbol; es un conteo, no
una medida de calidad. El SHA del manifiesto está en el inventario generado.

## Límites de seguridad

SHA-256 detecta diferencias respecto al manifiesto, no autentica al autor. Quien pueda
cambiar código y manifiesto también puede recalcularlos. La revisión Git y la firma
de una entrega, si se decide usarla, son controles distintos. No hay protección frente
a modificaciones concurrentes del sistema de archivos durante la lectura; generar y
validar sobre un árbol sin escritores concurrentes. Tampoco se analizan secretos en
contenidos arbitrarios ni se certifican licencias. El empaquetador final debe aplicar
y comprobar esta política o su política declarada propia en PC10.
