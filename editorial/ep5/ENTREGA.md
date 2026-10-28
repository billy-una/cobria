# La web como compañera de lectura del libro

EP5 trabaja sobre la candidata educativa local. No modifica Core 1.0, no publica
el sitio y no incorpora publicidad, cuentas o servicios de seguimiento.

## Recorridos y continuidad

La portada conserva entradas por nivel y problema. La guía ofrece cuatro itinerarios
con los mismos módulos del libro, un acceso al taller inicial y otro al proyecto
integral. Cada lección individual permite abrir el caso completo de su área, el
proyecto conductor y los recursos versionados. El mapa enlaza las 17 partes con
sus ejemplos y distingue comandos ejecutables de artefactos de diseño con rúbrica.

Las marcas de lectura son voluntarias y locales. No se marca automáticamente al
visitar una página ni se interpreta una selección como comprensión, evaluación o
conformidad. El lector puede continuar por la primera lección no marcada y borrar
únicamente sus marcas COBRIA desde la guía. El bloqueo de almacenamiento no debe
impedir la lectura; las selecciones quedan en memoria durante la sesión. Los
laboratorios conservan su selección separada y toleran contenido local inválido.

## Paridad y búsqueda

El libro y la web consumen `editorial/curriculum.json`, `editorial/ep3/areas.json`
y el recorrido EP4. `node editorial/ep5/build.mjs` regenera `parity.json`: registra
17 partes, 85 rutas de lección, hitos, ejemplos y huellas de contenido. La
construcción del sitio lo regenera antes de empaquetar. No se afirma una revisión
humana de equivalencia; es trazabilidad entre fuentes compartidas y derivados.

El buscador conserva el índice anterior y añade 17 casos desarrollados, diez
unidades iniciales y el proyecto integral. Busca en explicaciones, ejercicios y
soluciones reales, sin enviar las consultas al servidor. Se admiten consultas sin
tildes y filtros por tipo. La relevancia no se ha evaluado con lectores externos.
Las relaciones entre patrones enlazan únicamente nombres presentes en el catálogo.

## Presupuestos y pruebas

Los límites se fijan en `budgets.json` antes de medir: tamaño HTML, scripts cargados,
desbordamiento horizontal y solicitudes externas. La compresión gzip calculada
sirve para comparar tamaños locales; no prueba la configuración del alojamiento
ni tiempos de carga en redes móviles. No se atribuyen puntuaciones Lighthouse o
Core Web Vitals no medidas.

Pruebas mínimas: `node --test replication/tests/ep5-learning.test.mjs`,
`npm run lint --prefix sitio`, `npm test --prefix sitio` y `make verificar`.
La auditoría del navegador debe comprobar búsqueda, navegación, marcas después
de recargar, borrado, almacenamiento bloqueado, teclado y anchuras móviles. Los
informes se conservan bajo `output/review/ep5/`.

## Límites de entrega

Los resultados locales no verifican el alojamiento público. La revisión editorial
integral, los lectores externos y la publicación siguen sus fases correspondientes.
No se regenera el PDF por cambios de interacción web: la fuente pedagógica del
libro permanece intacta en esta fase.

## Cierre local del 23 de octubre de 2026

EP5 queda completada para la candidata educativa local. Pasaron las 12 pruebas
específicas y las dos regresiones de compatibilidad. La construcción aislada del
sitio pasó lint y 32 comprobaciones de HTML construido; `make verificar
COBRIA_SITE_ISOLATED=1` terminó correctamente. La auditoría HTTP y navegador pasó
182 comprobaciones sin errores. Utilizó Chrome 155.0.8059.85 con perfil temporal,
no las sesiones ni las pestañas del usuario.

Los seis recorridos de los presupuestos no presentan desbordamiento horizontal a
320 y 390 píxeles. El HTML comprimido calculado varió entre 8308 y 20773 bytes;
los scripts públicos observados sumaron 256054 bytes gzip por recorrido frío.
Es compresión calculada sobre recursos locales, no velocidad ni compresión del
alojamiento. Se conservan las limitaciones de `budgets.json`.

Evidencias reproducibles:

- `output/review/ep5/learning-tests.log` y `regresiones.log`.
- `output/review/ep5/verificacion-cierre.log`.
- `output/review/site-check/cobria-site-check-rwZd8A/VERIFICATION.json`.
- `output/review/ep5/local-1792784107689/RESULTADO.json` y `PRESUPUESTOS.json`.
- `output/review/ep5/SOURCE-CHECK.json`: igualdad de fuentes de aplicación y del
  generador con la copia construida. La última regla de color de progreso se
  incorporó a esa copia antes de compilar; no se presenta como clon Git limpio.

Se conservan los intentos anteriores: navegador de pruebas ausente, lectura
incorrecta de cuerpos de redirección y los dos desbordamientos móviles corregidos.
El medidor final abre un contexto frío por ruta y recupera los scripts observados
por HTTP para evitar medir cero bytes por la caché del navegador. Los abortos de
precarga RSC al abandonar una página se registran por separado; otros fallos no
se ocultan. Las capturas finales fueron inspeccionadas, sin certificación de
accesibilidad ni revisión integral de todas las páginas por una persona externa.

Para repetir el navegador local, después de construir una copia:
`node replication/scripts/audit-ep1-local.mjs /ruta/a/la/copia/sitio --ep5`.
Si se utiliza un navegador instalado en lugar del que fija Playwright, declarar
su ruta mediante `COBRIA_BROWSER_BIN`; el informe registra versión y sustitución.
La especificación congelada conserva su huella. No hubo publicación, commit ni
despliegue. La siguiente fase es EP6, reconciliación del artículo y el maestro.
