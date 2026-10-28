# Compatibilidad glob acotada

Código original COBRIA, Apache-2.0, que delega en `tinyglobby` 0.2.17 (MIT).
No contiene código de `fast-glob`, `micromatch` ni `braces`. Mantener la licencia
MIT de la dependencia en cualquier redistribución que la incluya.

Se usa mediante overrides explícitos para ESLint Next, vite-plugin-commonjs y
vite-plugin-dynamic-import. Sustituye la dependencia vulnerable, no la renombra
para excluir una alerta. Su nombre y procedencia aparecen en el lockfile.

API admitida: función asíncrona, `.sync`, `.globSync`, `.glob` y `.async`.
Opciones: cwd, onlyDirectories, onlyFiles, ignore, dot, absolute, deep y
followSymbolicLinks. Se rechazan las demás; no hay streams, objectMode,
generateTasks ni promesa de compatibilidad completa. Se desactiva
expandDirectories para conservar el comportamiento de fast-glob.

Límites locales: 64 patrones, 2048 caracteres por patrón y 16 niveles de llaves
o paréntesis, también para ignore. Son barreras de entrada, no una demostración
de seguridad exhaustiva ni un límite global de costo de recorrer el disco.
No aceptar globs enviados por visitantes ni exponer esta herramienta como API.

Cambios en los consumidores requieren revisar esta superficie y ejecutar las
pruebas del adaptador, lint, construcción, pruebas del sitio y auditoría completa.
Retirar esta sustitución cuando las cadenas oficiales eliminen la dependencia
vulnerable y hayan superado esas mismas comprobaciones. No publicar este paquete
como un reemplazo general de fast-glob.
