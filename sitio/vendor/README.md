# Sustitución local de la cadena glob

`glob-compat/` contiene código original COBRIA bajo Apache-2.0. Por compatibilidad
de resolución npm se instala bajo el nombre de importación `fast-glob`, pero su
versión es `0.0.0-cobria.1`, es privado y no es una distribución oficial de fast-glob.
No contiene su código ni el de micromatch o braces. La implementación delega en
tinyglobby 0.2.17 (MIT); su licencia debe conservarse al redistribuir dependencias.

El archivo `fast-glob-0.0.0-cobria.1.tgz` es un derivado generado con:

```sh
npm pack ./sitio/vendor/glob-compat --pack-destination ./sitio/vendor --json
```

Se conserva en Git porque `npm ci` necesita el mismo artefacto local, con su
integridad en el lockfile. No se usa una URL absoluta de la computadora ni se
publica un paquete. Se eligió tarball porque los overrides de directorios locales
produjeron enlaces inválidos; se rechazó esa instalación aunque audit diera cero.

La sustitución se controla con el override `fast-glob: $fast-glob` y con pruebas que
comprueban resolución efectiva en los consumidores actuales. Antes de actualizar
dependencias hay que inventariar consumidores nuevos y ampliar o retirar el adaptador;
una API no soportada debe fallar, no devolver resultados incompletos silenciosamente.

Se evalúan extensiones, globstar, exclusiones, directorios, rutas absolutas, ocultos,
deduplicación, interfaces síncrona/asíncrona y entradas adversas. Se limita además la
expansión estimada de llaves a 256 combinaciones por patrón. Estos límites no garantizan
un costo global de recorrido: no se aceptan patrones de visitantes del sitio.

Para modificar el adaptador: editar fuentes, generar el tarball, actualizar lockfile,
ejecutar pruebas, `npm ci` desde una copia nueva, `npm ls fast-glob`, lint, construcción,
pruebas del sitio y `npm audit --audit-level=high`. El test de congruencia detecta
un tarball instalado que no corresponde al código o metadatos de sus fuentes.

Retirar esta capa cuando la cadena oficial elimine el problema y supere las mismas
pruebas. No eliminar reglas de ESLint, excluir paquetes de auditoría ni afirmar que
cero avisos equivale a ausencia total de vulnerabilidades.
