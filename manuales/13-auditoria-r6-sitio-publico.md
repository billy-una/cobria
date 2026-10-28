# Auditoría R6 del sitio público

**Fecha:** 22 de septiembre de 2026  
**Versión evaluada:** `ecosistema-1.0.0-rc1`  
**Naturaleza:** comprobación técnica local de una propuesta independiente; no es certificación

## Alcance

R6 elimina la publicación simultánea del prototipo HTML y la aplicación vigente. Las rutas
heredadas redirigen a sus equivalentes actuales, mientras `/archivo` queda advertido y fuera
de indexación. Las 30 fichas siguen disponibles mediante rutas limpias y una vista dinámica
con navegación, práctica y código copiable.

La página Recursos declara fecha, versión, estado, tipo de autoridad, limitaciones, tamaño y
SHA-256. `public/downloads/manifest.json` permite comprobar las seis descargas y conserva
también la huella de la fuente editorial cuando el PDF público fue optimizado.

## Comprobaciones ejecutadas

```bash
make verificar-r6
npx @axe-core/cli http://127.0.0.1:4173/<ruta> --exit
npx lighthouse http://127.0.0.1:4173/ --only-categories=accessibility,seo,best-practices
npx lighthouse http://127.0.0.1:4173/ --preset=desktop --only-categories=accessibility,seo,best-practices
```

- Construcción limpia: correcta.
- Lint: cero errores y cero advertencias.
- Auditoría de dependencias: cero vulnerabilidades informadas por `npm audit`.
- Pruebas del sitio: 7 de 7 correctas.
- Enlaces internos generados: cero rotos en la compuerta R6.
- Descargas: 6 de 6 coinciden con tamaño y SHA-256 manifestados.
- axe: cero violaciones automáticas en Inicio, Recursos, Explorar, Laboratorio y Objeto canónico.
- Lighthouse móvil: accesibilidad 100, buenas prácticas 100, SEO 100.
- Lighthouse escritorio: accesibilidad 100, buenas prácticas 100, SEO 100.
- Core 1.0: conserva SHA-256 `9db3b0fffdee83ddf6c7ec8ede7e8f5d675d1e152e0614cadecba884eae1c179`.

## Protecciones

El worker y `_headers` declaran CSP, HSTS, `nosniff`, bloqueo de marcos, política de
referencia, política de permisos y aislamiento del contexto de apertura. El archivo histórico
añade `X-Robots-Tag: noindex, nofollow` cuando lo sirve el worker.

## Límite de la auditoría

axe y Lighthouse solo detectan una parte de los problemas de accesibilidad. Sigue pendiente
una evaluación humana con navegación completa por teclado y tecnología de asistencia, así
como la observación del despliegue real. Esta actividad no se simula ni se presenta como
validación externa.
