# Construir la aplicación y usar el Toolkit

Las fases 11 y 12 del roadmap del ecosistema conectan el proyecto ambiental con una
herramienta instalable. No son PC11 y PC12 del plan correctivo. Core 1.0 permanece
congelado y esta entrega no publica una nueva versión.

## Recorrido de construcción

Imagine que una brigada cuenta tres colibríes en una reserva. El mismo registro
alimenta el resumen y la búsqueda, pero ninguna de esas copias puede cambiar el hecho.
Desde la raíz de COBRIA:

```sh
node replication/examples/ecosistema-app/src/recorrido-build.mjs
make verificar-ecosistema-11-12
```

El recorrido usa los casos de uso existentes: registra y reintenta la operación,
retira únicamente el resumen, lo reconstruye, prepara un conjunto analítico con
procedencia y consulta evidencia. Debe mostrar un documento, reconstrucción equivalente,
una cita de `obs-build` y abstención para una especie ausente. La misma entrada produce
el mismo resultado y huella. La composición declara explícitamente consentimiento
sintético para el conjunto; no lo infiere de la entidad v1 ni modifica el canónico.

La carpeta `src` conserva dominio, aplicación, presentación, infraestructura y
composición. `data/arquitectura.json` asigna responsabilidad, límite y prueba a cada
archivo; una prueba falla si se agrega código sin actualizar ese mapa.
`HITOS.json` y `GUIA-PASO-A-PASO.md` conservan el recorrido largo por responsabilidades.

## Ejercicios y soluciones comprobables

1. Cambie la cantidad a cero en una copia del ejemplo. ¿Debe el resumen decidir si
   es válido? No: `Observacion` rechaza la cantidad; la prueba negativa está en
   `test/app.test.mjs` y el primer recorrido muestra `OBS_QUANTITY_INVALID`.
2. Repita la misma clave con otro conteo. No cambie el resumen para compensarlo:
   el caso de uso rechaza `IDEMPOTENCY_CONFLICT`; una clave no puede ocultar otra entrada.
3. Retire el resumen y vuelva a crearlo. La solución usa `app.proyecciones.retirar`
   y `app.reconstruir.ejecutar`; `test/build.test.mjs` comprueba equivalencia.
4. Busque una orquídea donde solo hay colibríes. La respuesta correcta es abstenerse,
   no inventar una cita. La búsqueda léxica de este taller no es un modelo generativo.
5. Quite el consentimiento sintético antes de construir el conjunto. La fuente deja
   de ser elegible; no debe agregarse consentimiento real para hacer pasar la prueba.

Las pruebas en una copia nueva comprueban portabilidad de la aplicación sin dependencias
externas, no comprensión humana. La interfaz HTTP, persistencia documental y recuperación
extendida se enseñan en los talleres C5–C8; este recorrido no los presenta como un staging
remoto ni como un único sistema listo para producción. Autenticación real, ensayo de
despliegue, transferencia con principiantes y operación remota siguen requiriendo su
propia evidencia.

## Toolkit fuera del repositorio

```sh
make probar-instalacion-toolkit
```

La prueba crea un paquete local mediante `npm pack`, instala el archivo en un consumidor
nuevo y ejecuta `validar`, `medir`, `contexto` y la generación simulada de un diccionario.
También ejecuta conformidad funcional de LokiJS con veinte documentos, no un benchmark.
Conserva cada intento, incluidos los fallidos, en `output/review/ecosistema-11-12/`.
La instalación necesita acceso al registro npm o sus dependencias en caché. No publica
el paquete en un registro ni modifica un proyecto existente del usuario.
La instalación de prueba desactiva scripts de dependencias y registra esa limitación;
no acredita la compatibilidad de PouchDB nativo con todas las versiones de Node.
Los adaptadores se cargan solo al solicitar conformidad, no para comandos documentales.

El paquete incluye una copia de manifiestos y esquemas con inventario de huellas.
Dentro del checkout, la CLI utiliza las fuentes; instalada, usa esos recursos incluidos.
`--raiz` o `--ruta` permiten elegir fuentes explícitas. Los recursos describen la versión
empaquetada, no consultan en vivo la documentación más reciente.

```sh
cobria iniciar --directorio ./reserva
cobria generar diccionario --nombre Observaciones --directorio ./reserva --simular
cobria generar diccionario --nombre Observaciones --directorio ./reserva
cobria generar modulo --nombre Avistamientos --directorio ./reserva --simular
cobria validar --ruta ./reserva/.cobria --json
```

El diccionario generado diferencia identidad, ámbito, revisión y versión del formato.
Sus claves físicas quedan sin decidir: solo el Dater debe traducirlas. Consultas,
catálogos, retención y reglas necesitan completar el análisis del dominio. El archivo
no es un manifiesto de fase 11 y no se valida pasando su ruta a `cobria validar`.
Repetir la generación conserva bytes idénticos; una edición humana provoca conflicto,
no sobrescritura. La simulación inspecciona el destino sin crearlo.

Los quince generadores genéricos continúan siendo esqueletos, no implementaciones
de negocio. El generador específico de diccionario es un complemento separado.
Los informes y perfiles funcionales no constituyen certificación. `publicar` sigue
limitado a simulación y no adquiere autoridad de despliegue.
