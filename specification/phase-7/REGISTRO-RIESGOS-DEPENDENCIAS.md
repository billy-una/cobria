# Registro de riesgos de dependencias

**Última observación del sitio:** 2026-10-16 mediante `npm audit --json` en `sitio/`.
La observación de réplica del 21 de septiembre se conserva abajo como histórica.

| ID | Componente | Severidad informada | Exposición en COBRIA | Decisión temporal | Condición de cierre |
|---|---|---:|---|---|---|
| SUP-001 | `pouchdb` → `uuid` | moderada en observación del 19 de septiembre | adaptador de experimentación y pruebas | mitigada mediante resolución controlada a `uuid 11.1.1`; conservar pruebas | reabrir si cambia lockfile, exposición o asesoría |
| SUP-002 | Cloudflare, Miniflare, `undici`, `sharp` y `source-map-js` | alta en auditoría inicial del 16 de octubre | herramientas locales de construcción y desarrollo del sitio | actualizar `@cloudflare/vite-plugin` a 1.64.0, Wrangler a 4.151.1; lockfile resuelve `undici` 7.29.1, `sharp` 0.35.5 y `source-map-js` 1.2.2 | auditoría posterior no informa esas cadenas; conservar verificación de construcción |
| SUP-003 | `braces` → `micromatch` → `fast-glob`, cadena retirada del árbol instalado | siete entradas altas antes; cero avisos conocidos tras sustitución local del 16 de octubre | herramientas de desarrollo/construcción, no API de visitantes | mitigada mediante adaptador acotado y tarball local verificable, sin excluir alertas; conservar mantenimiento | reabrir al cambiar consumidores, el lockfile o las asesorías; retirar la sustitución cuando exista cadena oficial compatible y verificada |

## Sitio: cierre parcial del 16 de octubre de 2026

La auditoría inicial reportó 13 entradas altas y cero críticas. Tras actualizar las
dependencias directas Cloudflare/Wrangler y resolver la actualización compatible de
`source-map-js`, reportó siete altas y cero críticas. El conteo incluye paquetes padres
afectados transitivamente; no equivale a siete vulnerabilidades independientes.

La raíz restante es [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm),
agotamiento de pila con patrones de llaves profundamente anidados. El aviso oficial
consultado indica versiones afectadas <=3.0.3 y ninguna versión corregida publicada;
`npm view braces version` devolvió 3.0.3. Se conservó Vinext y el plugin ESLint:
las degradaciones automáticas propuestas por `npm audit fix --force` no son una
corrección de compatibilidad demostrada. No se aplicaron overrides a una versión
inexistente, forks sin revisión ni exclusiones de auditoría.

La actualización de `source-map-js` corresponde al aviso
[GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q).
Los resultados de auditoría se refieren al lockfile y registro consultados en esta
fecha; cero entradas para una cadena no garantiza ausencia de vulnerabilidades.

**Responsable SUP-002/003:** mantenimiento del sitio. **Próxima revisión:** antes de
preparar RC2 o el 23 de octubre de 2026, lo que ocurra primero. La fecha es una
condición documental; no configura un recordatorio automático. La compuerta R6
mantiene `npm audit --audit-level=high` sin modificaciones.

### Verificación y bloqueo del entorno

`npm run lint --prefix sitio` y `npm ci --dry-run --ignore-scripts --prefix sitio`
aprobaron. El segundo solo valida el plan del lockfile, no equivale a instalar y
construir desde un clon limpio. `npm audit --omit=dev` informó cero entradas; la
clasificación npm no demuestra qué componentes terminan en el artefacto desplegado.
Por ello no sustituye la auditoría completa que sigue informando siete altas.

La construcción quedó detenida durante la preparación de la salida `sitio/dist`.
Se observaron directorios duplicados `client 2`, `client 4` y `.openai 2` con
metadatos anómalos. No se atribuye la causa definitivamente a iCloud ni al nuevo
plugin sin más diagnóstico. Se solicitaron terminaciones SIGTERM a las construcciones.
Un intento de conservar `dist` en `/tmp/cobria-dist-retenido.928G5D/dist` también
quedó esperando y se canceló; no se afirma que el traslado se completara. No se
intentaron borrados recursivos ni cambios de permisos. Los dos procesos de construcción
propios que no terminaron con SIGTERM se cancelaron con SIGKILL tras comprobar sus
comandos exactos; no se terminaron servicios del proyecto ni procesos ajenos.

Los logs de esta ejecución están en `/tmp/cobria-deps-lint.log`,
`/tmp/cobria-deps-ci-dry-run.log`, `/tmp/cobria-deps-sitio.log` y
`/tmp/cobria-deps-verificar.log`. Las pruebas finales del sitio y el gate general
no se consideran aprobados tras este cambio. Hay que resolver el bloqueo de la
salida local antes de validar la actualización y preparar un commit candidato.
No se generó RC2 ni se hizo commit, push o despliegue.

### Continuación: compatibilidad en una copia temporal

El diagnóstico `node replication/scripts/verify-site-isolated.mjs` instaló realmente
el lockfile mediante `npm ci` en una copia nueva, ejecutó lint, construyó el sitio y
aprobó sus 10 pruebas. El informe se conserva en
`/var/folders/_h/hbt4nbf50vxbfsbz9xc5l5cw0000gn/T/cobria-site-check-75C8Aj/VERIFICATION.json`.
El SHA-256 del lockfile evaluado es
`2395b8ab83bf7152173b62f0efccdfbcc0e6d9af8a73271574c1ce0f66d818c7`.

La copia contiene fuentes editoriales, sitio, los PDF requeridos y el normalizador
de metadatos; excluye `dist`, dependencias, cachés y archivos `.env*`, y rechaza enlaces
simbólicos. No usa las dependencias ya instaladas del checkout para fingir instalación
limpia. Se conserva para diagnóstico y no contiene metadatos de un clon Git; no es
una réplica externa ni la doble construcción RC2. No se borró el `dist` original.

`make verificar COBRIA_SITE_ISOLATED=1` permite repetir los gates generales y ejecutar
las mismas pruebas del sitio en esa modalidad. No modifica la auditoría de R6 ni sus
umbrales. La nueva auditoría completa sigue informando siete altas: publicación
bloqueada, aunque las pruebas de compatibilidad locales aprueben. No se sustituyó
`braces` por un alias/fork no evaluado ni se eliminaron reglas ESLint para ocultarlo.

La ejecución general `make verificar COBRIA_SITE_ISOLATED=1` terminó con código 0:
90 pruebas de réplica, 23 de aplicación neutral, 19 del ejemplo operativo y 10 del
sitio, además de validadores y lint. Log: `/tmp/cobria-verificar-aislado.log`.
Este resultado posterior sustituye el estado funcional inconcluso del intento sobre
`dist`, pero no cierra SUP-003 ni la puerta de publicación. El modo aislado excluye
también `.dev.vars`, `.npmrc`, `.netrc` y extensiones de claves habituales.

La asesoría observada fue `GHSA-w5hq-g745-h8pq` (“missing buffer bounds check” en UUID).
La sugerencia automática de cambiar PouchDB a `6.3.2` constituía un retroceso mayor y no
se aplicó. El lockfile actual resuelve `uuid 11.1.1`; la suite de réplica conserva pruebas
para PouchDB. La auditoría del 21 de septiembre informó cero vulnerabilidades conocidas.
Esto describe únicamente ese lockfile, registro y momento; no demuestra ausencia total.

**Responsable:** mantenimiento de réplica. **Próxima revisión:** al cambiar dependencias o,
como máximo, 2026-10-21. Cualquier cambio de exposición, prueba de explotación o aumento
de severidad reabre la decisión inmediatamente.

## Evaluación posterior: sustitución acotada y auditada del glob

Esta sección actualiza el estado del sitio en esta misma fecha y sustituye el
bloqueo por siete alertas descrito en las observaciones anteriores. El aviso
original de braces sigue sin parche oficial; COBRIA retiró esa dependencia de su
cadena de construcción, no la declaró corregida por sus autores.

Se añadió un adaptador original de superficie limitada sobre tinyglobby 0.2.17,
instalado bajo la importación `fast-glob` con versión privada `0.0.0-cobria.1`.
No copia código de braces, micromatch o fast-glob. Su tarball local tiene integridad
registrada y la procedencia/licencias se documentan en `sitio/vendor/README.md`
y `PROVENANCE.md`. No se publicó un paquete ni se falsificó una versión upstream.

La instalación desde cero aprobó `npm ci` y `npm ls fast-glob`. Se rechazaron los
primeros intentos basados en enlaces de directorio que producían un árbol npm
inválido, aunque audit informara cero. Se generó un lockfile limpio desde el
tarball local, con SHA-256
`7b76d27c0a0f1902bade74499eb3d5fd2efdd436bc6eab77c54b6090752c1d63`.
`npm audit --audit-level=high` y la auditoría JSON completa informaron cero
vulnerabilidades conocidas para ese árbol y momento; no implica seguridad total.

Las 13 pruebas del adaptador cubren los consumidores efectivos ESLint e importación
dinámica, resultados esperados, exclusiones, rutas, duplicados, sincronía y entradas
adversas. También comparan código/metadatos instalados con sus fuentes para evitar
un tarball obsoleto. La lista de opciones es explícita y las desconocidas fallan.
Los patrones tienen límites de longitud, cantidad, anidamiento y expansión estimada;
no se exponen a visitantes ni se promete un límite global de recorrido del disco.

El modo CommonJS tiene dos imports permitidos por la regla ESLint en ese único
archivo; no se desactiva la regla global ni las comprobaciones de Next. El validador
R6 se actualizó de su conteo histórico de 51 rutas a comparar el conjunto exacto
actual de módulos, lecciones, patrones y utilidades. Rechaza duplicados y orígenes
inesperados; no se redujo el control a aceptar cualquier número de rutas.

**Estado SUP-003:** mitigado por sustitución local, sujeto a pruebas completas y
revisión al actualizar consumidores. **Riesgo residual:** mantenimiento de la capa,
cobertura limitada a la API declarada y futuras vulnerabilidades de dependencias.
No es validación externa de seguridad. La candidata requiere todavía todos sus
gates y la doble construcción desde un commit limpio.

### Cierre de la verificación local posterior

`make -k verificar-publicacion COBRIA_SITE_ISOLATED=1` terminó con código 0,
sin relajar la auditoría `--audit-level=high`, tras corregir enlaces de los
validadores al currículo vigente y sincronizar el manifiesto de descargas antes
de R6. El log está en `/tmp/cobria-publicacion-curriculo-final.log`.

Se preservan las pruebas de API, seguridad, rendimiento, operación, analítica,
conformidad y ciencia. Las comprobaciones antiguas de títulos dentro de la
plantilla se sustituyeron por comprobaciones de fuente compartida, rutas,
contenido completo de lección e indexación; cuatro pruebas positivas/negativas
comprueban esos enlaces. También se verifica el HTML real del caso conductor,
los roles de apoyo y la migración. La explicación de roles faltante se completó
en la lección 4.3, compartida por libro y web, y se revisó su PDF renderizado.

El cierre editorial valida seis PDF, 139 rutas y seis descargas con huellas. El
manifiesto de réplica generado describe 398 archivos. Son artefactos locales:
no equivalen a un nuevo commit candidato, un árbol Git limpio, una doble
construcción, publicación o revisión independiente. El checkout sigue basado en
`7b5293db626aa71ed04fe552610260224a410518` y conserva 23 eliminaciones previas que
no se confirmaron ni restauraron en este trabajo.
