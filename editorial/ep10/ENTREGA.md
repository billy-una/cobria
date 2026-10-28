# EP10 — Candidata identificada y reconstrucción

Fecha: 28 de octubre de 2026. Meta: candidata educativa y preprint acotado.
Autoridad: normativa en `specification/`; no se modifica Core 1.0 ni se ejecutan
experimentos nuevos. La implementación de esta fase no autoriza publicación.

## Procedimiento

`candidate.py` inventaría el árbol de trabajo actual, incluidas adiciones y
eliminaciones, sin confirmar cambios del autor. Copia las entradas admisibles a
un repositorio nuevo **sin historia**, crea una instantánea local y construye dos
clones limpios del mismo SHA. Los clones no tienen los repositorios de referencia
como directorios vecinos; ejecutan `make construir-publico` con dependencias desde
sus lockfiles. El entorno y los registros pertenecen a un equipo local, no a CI.

Se compara cada página de los siete PDF mediante texto, caja, identidad editorial,
idioma, presencia de etiquetas y rasterización a 650 px. Se contrastan entre ambos
clones y con la edición inspeccionada de EP9. La comparación permite fechas,
identificadores internos, creador y asunto de metadatos distintos; no permite
omitir páginas o cambiar texto, geometría, título o autor. La igualdad de imágenes
a esa resolución no demuestra igualdad a cualquier resolución ni PDF/UA.

Los HTML y JSON editoriales declarados se comparan por bytes. Se verifican las
lecturas HTML y el servidor construido; se conservan SBOM y auditorías de los
cuatro lockfiles Node. El SBOM no certifica licencias ni ausencia de vulnerabilidades.

## Separación de paquetes

Las fuentes completas conservan registros históricos, respuestas de revisión y
rutas personales que requieren revisión antes de redistribuirlas. El inventario
se examina con patrones de secretos sin imprimir sus valores. Esta búsqueda
automática no se presenta como auditoría exhaustiva de privacidad o derechos.

El ZIP documental preparado, cuando pasan ambas construcciones y comparaciones,
incluye seis PDF, seis lecturas HTML, recursos locales, avisos de derechos, SBOM y
manifiesto SHA-256. **Excluye historia Git, respuestas, claves de coordinación y
copia ciega. No es un paquete de reproducción de fuentes completo.**

No se aprueba automáticamente un commit de `main`, no se hace push y no se crea
una release. La candidata local conserva su SHA propio y los bloqueos de CI,
privacidad, derechos y revisión humana. `estado.json` y `recibo.json` distinguen
preparación, ejecución y cierre. Los recibos de ejecuciones fallidas se conservan.

## Correcciones a las puertas antiguas

La auditoría del 28 de octubre encontró dos incidencias altas y siete moderadas
en el sitio, más una moderada en el arnés QA. Se actualizaron Cloudflare Vite
Plugin a 1.66.0, Wrangler a 4.155.0 y Vite a 8.3.5; se fijaron correcciones
transitivas de Satori 0.33.5, fflate 0.7.5 y fast-uri 3.1.9. Vinext conserva
su versión y el parche de desconexiones PC8, sometido de nuevo a las pruebas.
Los archivos JSON de auditoría conservan el antes y el después; no se aplica
`npm audit fix --force` ni se presenta el análisis como garantía permanente.

Dos validadores exigían todavía el libro de 370–372 páginas y una afirmación de
accesibilidad retirada en EP9. Se actualizan a la edición inspeccionada de 469
páginas, conservando la comprobación de lecciones, ejemplos y prácticas. El
validador de sitemap reconoce las rutas de EP2 y EP4. La puerta pública añade
EP4–EP9, separando la revisión de bytes aprobados de una reconstrucción nueva.

La construcción inicial sin historia detectó una dependencia del commit C0.
`export-c0.mjs` conserva las 82 entradas observadas de ese commit, incluidas sus
ausencias, y comprueba sus huellas contra `coverage.json`. El auditor y sus
regresiones pueden usar esas entradas verificadas cuando falta el objeto Git.
La línea base, sus brechas y resultados no se reescriben. Un byte alterado hace
fallar la carga; no se sustituye el material histórico por archivos actuales.

La sonda HTTP real detectó además un 503 en recursos del adaptador Node y una
combinación de directivas de caché por diferencias entre mayúsculas y minúsculas.
El Worker delega al manejador de archivos de Vinext únicamente para el contexto
Node confiable; en Workers sin ASSETS conserva el rechazo. La revisión v3 del
parche PC8 elimina la duplicidad de caché. Las regresiones comprueban bytes,
cabeceras, respuestas 200/304 y cuarenta desconexiones sobre el servidor real.

## Repetir y verificar

```sh
python3 -m pip install -r requirements-build.txt
make verificar-ep10
make generar-manifiesto-paquete
python3 editorial/ep10/candidate.py
```

Instalar además Node compatible, TeX/Biber, Poppler, Java, Go y el Chromium fijado
por Playwright. `COBRIA_BROWSER_BIN` puede indicar el navegador del exportador;
se registra el entorno realmente usado. Una ejecución nueva produce otra carpeta
en `output/review/ep10/`, sin reemplazar los recibos anteriores.

El cierre integral requiere un SHA aprobado del repositorio principal, CI remota
observada sobre ese SHA, revisión de la distribución de fuentes y las evaluaciones
humanas pendientes de EP9/EP11. Un resultado local no cierra esas puertas.

## Integración solicitada y observación de CI

La continuación de EP10 autoriza preparar e integrar el trabajo del repositorio;
no constituye una revisión independiente ni una autorización de despliegue.
`revision-distribucion.json` clasifica los once avisos: diez archivos históricos
ya coincidían con el `main` remoto observado y el restante es un fixture ficticio.
Todos están excluidos del ZIP documental. No se borran originales ni se alteran
atestaciones para resolver una puerta. La distribución completa de fuentes conserva
su revisión de privacidad y derechos pendiente.

`observe_ci.py` consulta el SHA completo y el `main` remoto. Exige los dos workflows
públicos, los cinco jobs obligatorios y sus pasos de comprobación efectivamente
superados. Una lista vacía, un SHA antiguo, un pull request, un paso omitido o un
reintento fallido no acreditan cierre. Ocho regresiones prueban esas diferencias.

```sh
python3 editorial/ep10/observe_ci.py --sha SHA_COMPLETO \
  --output output/review/ep10/ci-integracion.json
```

La consulta de anotaciones de la ejecución histórica `35589549294` mostró que el
runner no se inició por un bloqueo de facturación de la cuenta. Esto es evidencia
de esa ejecución antigua; la causa y el estado del nuevo SHA deben observarse de
nuevo. No se modifican cobros, configuración de la cuenta ni controles de GitHub.
El registro posterior de integración se conserva fuera del commit observado para
evitar la referencia circular de un archivo que pretende contener su propio SHA.
