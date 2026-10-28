# Protocolo de contratos PC2

Esta revisión prepara una evaluación nueva. No reemplaza las corridas R7 ni atribuye
sus cifras a los componentes actuales. El diseño legible por herramientas está en
`pc2-contracts-v1.json`; el congelamiento local conserva huellas en `pc2-freeze-v1.json`.
El desempeño confirmatorio corresponde a PC3 y no se ha ejecutado en esta fase.

## Preguntas y resultados posibles

- H1: una proyección puede cambiar el costo de lectura frente a una consulta canónica
  filtrada e indexada; una diferencia nula o desfavorable es un resultado admisible.
- H2: un registro idempotente y recuperación de pendientes evitan duplicar el efecto
  del cambio ensayado, incluso con una respuesta perdida.
- H3: la publicación con equivalencia y CAS conserva una versión íntegra bajo los
  conflictos y fallos definidos. No se generaliza a todos los fallos distribuidos.
- H4: una frontera autorizada rechaza antes del acceso o caché las solicitudes fuera
  de identidad, capacidad, ámbito o finalidad. No afirma aislamiento de tiempos.
- H5: un consumidor con procedencia responde con citas o se abstiene; rechaza datos
  manipulados y no convierte instrucciones del contenido en permisos de herramienta.

Los requisitos funcionales se prueban con aceptación y rechazo. Una corrida que rompe
un contrato queda fallida, aunque su latencia sea buena. No se exige superioridad para
dar por concluida la medición.

## Componentes y oráculos

`src/pc2/contracts.mjs` usa PouchDB/LevelDB real en directorios temporales exclusivos.
No reemplaza el motor por un doble durante los ensayos de persistencia. Las pruebas
de variantes deliberadamente incorrectas alteran la ruta que se quiere refutar, no
se presentan como integraciones correctas ni como experimentos de rendimiento.

P1 prepara documentos con claves indexadas de ámbito/estado y proyecciones estrechas;
ambas rutas ejecutan `_all_docs` por rango. El oráculo declara la respuesta esperada
desde el fixture, sin deducirla de las dos consultas. El registro de argumentos del
adaptador local no es un `explain` de MongoDB, CouchDB u OpenSearch. PC3 debe capturar
planes y consultas reales de esos motores y usar selección nativa de campos si existe.

P2 guarda canónico y operación pendiente en una primera escritura y confirma el
derivado en una segunda. La interrupción entre ellas es intencional y recuperable;
no se describe como transacción de dos escrituras. Reintentar una operación confirmada
no añade escrituras; otra entrada con la misma clave se rechaza. La huella usa JSON
serializado, sin normalización de orden; el protocolo fija el esquema y orden de entrada.

R1 guarda fuente, candidatas y alias en un único agregado. `_rev` condiciona el cambio
persistente de alias. Una candidata parcial, inválida o de fuente obsoleta no se publica;
dos publicadores con la misma expectativa no ganan ambos. Los lectores reciben una
versión completa de ese agregado. Reabrir la base prueba reapertura ordenada, no corte
de energía ni proceso remoto. No prueba una transacción entre agregados o motores.

S1 resuelve sesiones DEMO desde un registro del servidor, no desde el cuerpo recibido.
La caché local está particionada por ámbito y la autorización ocurre antes de leerla.
Exportación y búsqueda son rutas sobre las fuentes del taller, no servicios externos.
Los contadores observan acceso al almacenamiento; se ensaya también una caché caliente.
No es un proveedor de identidad de producción ni prueba consentimiento de personas.

A1 construye entrenamiento con corte de evento y conocimiento, y entidades separadas.
Guarda el producto, lo reconstruye desde fuentes leídas del motor y compara contenidos.
El consumidor revisa procedencia y devuelve citas de fragmentos o abstención real. Una
herramienta separada solo permite lectura. El texto adverso se cita como dato; no hay
modelo generativo ni estimación de resistencia a todas las inyecciones de instrucciones.

## Diseño para PC3

Tres motores, tres tamaños y treinta corridas por celda producen 270 corridas previstas,
no observaciones realizadas. Cada corrida usa corpus sintético equivalente entre rutas,
cinco parejas de calentamiento y diez consultas por ruta. Por celda se alternan quince
órdenes canónica/proyección y quince proyección/canónica con mezcla determinista.
Registrar el orden efectivo y no mezclar calentamientos con las observaciones.

Los adaptadores de PC3 deben proporcionar consulta filtrada/indexada y sus planes,
almacenamiento condicional, lectura de estado y métricas con método y disponibilidad.
PouchDB es validación funcional adicional, no uno de los tres motores confirmatorios.
Los adaptadores remotos aún deben implementarse y pasar estos contratos antes de medir.
Ese trabajo de conexión no autoriza cambiar hipótesis o umbrales después de ver tiempos.
Registrar SHA de cada adaptador y ambiente antes del primer piloto y del confirmatorio.

La unidad inferencial es la corrida pareada; diez consultas internas no son diez
réplicas independientes. Remuestrear parejas completas, informar dispersión, tamaños
de efecto e intervalos, y aplicar Holm en las nueve comparaciones primarias P1.
No combinar CPU/RSS del cliente con métricas del servidor. Tamaño BSON, payload JSON,
bytes de red y espacio físico son medidas distintas. Una medida no disponible es
`null` con explicación, no cero ni una estimación rebautizada.

## Seguridad y registro

Usar solo datos sintéticos, recursos identificados como propios y espacio libre
suficiente. No ejecutar reset o borrado contra bases ajenas. Las bases de pruebas PC2
se cierran y conservan temporalmente para diagnóstico; no hay limpieza recursiva del
directorio del usuario. No se usan credenciales reales en este protocolo.

Registrar todos los intentos, versiones, semillas, calentamientos, orden y fallos.
Un incumplimiento del contrato es resultado, no una exclusión por instrumentación.
Los límites de tiempo y criterios de exclusión están fijados en JSON. Un cambio de
protocolo exige nueva revisión y justificación, sin sobrescribir este congelamiento.

## Verificación

Desde la raíz, con las dependencias fijadas de `replication/` instaladas:

```sh
node --test replication/tests/pc2-contracts.test.mjs
node replication/scripts/freeze-pc2.mjs --check
make verificar-pc2
```

Crear un congelamiento solo una vez mediante `--freeze`; el comando usa creación
exclusiva y rechaza reemplazar un registro existente. La verificación ordinaria es de
solo lectura. Huellas locales no son una firma, revisión independiente ni registro
externo de prioridad científica. PC3 debe comprobarlas antes de nuevas mediciones.
