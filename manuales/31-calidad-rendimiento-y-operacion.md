# Detectar medir y recuperar sin improvisar

Un programa útil también debe permitir encontrar errores, medir sus costos y recuperar
información. El taller sigue una reserva digital: primero reproduce un defecto, después
comprueba la corrección y por último ensaya una recuperación y una entrega local.
No necesita cuentas de nube, credenciales ni paquetes externos; requiere Node.js 22.13
o superior y Git para registrar el commit de base de la demostración.

## Ejecutar desde la raíz

```sh
npm test --prefix replication/examples/operacion-c6
npm start --prefix replication/examples/operacion-c6
npm run medir --prefix replication/examples/operacion-c6
```

Las quince pruebas no dependen de un umbral de velocidad. La demostración crea una
carpeta temporal nueva, escribe un respaldo con creación exclusiva y conserva su ruta.
La medición conserva otro informe JSON en una carpeta nueva. No borra, sobrescribe
ni recupera documentos sobre una base activa. Son archivos con datos ficticios, no
un servicio NoSQL en disco. `make verificar-c6` añade la coherencia del libro y la web.

## Del reporte a una regresión

El síntoma es concreto: al pedir `obs-1` de `reserva-norte`, se recibe `reserva-sur`.
El fixture `reproducirDefectoCache` omite deliberadamente el ámbito de la clave y nunca
se usa como caché de la aplicación. La causa es el contexto incompleto de lectura.

La solución reutiliza `CacheLecturas` de `operacion-documental`: clave por ámbito,
política y recurso, capacidad limitada y vencimiento. `crearLecturaSegura` autoriza
antes de cada consulta, incluso si la entrada ya está en caché. Invalide después de
escribir y revise qué lectores pueden compartir exactamente la misma respuesta.
Este ejemplo no implementa restricciones de campos diferentes por persona.

La regresión exige ámbitos separados, rechazo de permisos revocados sin otra carga,
invalidación y vencimiento con reloj controlado. Un reloj inyectado hace la prueba
determinista; no representa latencia observada del sistema.

## Medir una pregunta precisa

La pregunta del microensayo es cuánto tarda resolver cien búsquedas exactas por
ámbito e identificador sobre 5000 registros ficticios, mediante barrido o un `Map`.
No compara arquitecturas, clústeres, adaptadores ni productos comerciales.

El protocolo está en `replication/examples/operacion-c6/protocolo.json`, escrito antes
de medir. Su huella acompaña cada informe junto a semilla y ambiente. Se excluyen
cinco pares de calentamiento y se conservan treinta pares observados; cada par usa
las mismas consultas y baraja el orden de las dos variantes con generador determinista.
Los resultados se comparan contra los valores de la generación, fuera del cronómetro.

El informe conserva tiempos crudos, p50, p95, p99, mínimo y máximo en milisegundos
por lote de cien consultas. Usa rango más próximo `ceil(p*n)`. Con treinta pares,
p99 es el máximo observado, no una estimación fiable de eventos raros. No se calculan
significancia, intervalos ni tamaños de efecto para sostener una conclusión científica.
El proceso comparte CPU, memoria y JIT: no está aislado como un ensayo distribuido.

Para N documentos y Q consultas, el barrido cuesta O(QN) en el peor caso. Construir
el índice del ejemplo cuesta O(N), y sus búsquedas cuestan O(Q) esperado con claves
de longitud acotada, más O(N) de espacio adicional. Si crece la longitud L de la clave,
formarla y procesarla también tiene costo. Estas expresiones no describen todo índice
nativo ni garantizan el peor caso de `Map`. Como el conjunto permanece inmutable,
el ensayo no mide mantenimiento o invalidación tras escrituras.

La construcción del índice se mide aparte. Los bytes del índice serializado son un
indicador de representación adicional, no consumo real del heap ni costo mensual.
Para una decisión de producción faltan escrituras, actualizaciones, concurrencia,
frescura, motor real, fallos, almacenamiento y esfuerzo de mantenimiento. Nunca haga
pasar este microensayo por P1, P2, R1, S1 o A1 del programa científico existente.

## Respaldar no basta hay que restaurar

El respaldo requiere lectura autorizada del ámbito. Conserva formato, ámbito y
documentos canónicos normalizados, ordenados por identidad. El archivo se escribe
una sola vez en una carpeta nueva y con permisos locales restringidos. El límite del
taller es 10000 documentos y 1 MiB; no es una exportación escalable de un motor.

La restauración exige lectura y escritura autorizadas, verifica bytes y SHA-256,
formato, campos, tipos, ámbito y ausencia de identidades duplicadas. Después crea un
repositorio nuevo y reexporta para comprobar equivalencia de contenido. Una huella
detecta alteración respecto al valor esperado, pero no prueba autenticidad: un atacante
que cambie archivo y huella puede eludir esa comprobación. No exponga este importador
como endpoint ni lo use para material no confiable sin controles adicionales.

No se incluyen sesiones, auditoría, catálogos externos, índices ni registro de
idempotencia. Recuperar documentos no recupera todas las garantías del servicio: una
entrega repetida después de restaurar todavía necesita reconciliación de operaciones.
El ensayo mide duración local de lectura y restauración, no un RTO comprometido ni el
RPO de escrituras posteriores al corte. No se simula una caída real del sistema completo.

## Functions staging y entrega por identidad

`crearHandlerResumen` ilustra una Function autoritativa: contexto del servidor separado
de la entrada, capacidad y ámbito comprobados antes del repositorio y resumen sin
autoridad de escritura. Se ejecuta en Node; no importa el SDK ni despliega Firebase.
En una Function real deben integrarse identidad verificada, reglas del proveedor,
cuotas, tiempo máximo, secretos, observación y pruebas de reentrega del disparador.

`EntregaLocal` conserva bytes y huella de una candidata. La demostración registra el
SHA de base y `sourceDirty`; si hay cambios locales, el SHA no representa por sí solo
los bytes actuales. La huella identifica el artefacto usado. Su staging es un ensayo
en memoria: la prueba smoke verifica el artefacto y el resumen restaurado. No es un
hosting de staging ni una autorización para publicar.

Si smoke falla o lanza un error, la activa permanece intacta. La promoción exitosa
retiene una versión anterior y la reversión vuelve a sus bytes comprobados. Se
rechazan promociones simultáneas en el mismo objeto. No hay consenso distribuido,
registro durable ni reversión automática de esquema, datos o funciones remotas.

Una entrega real debe añadir ambiente destino verificado, artefactos inmutables,
separación staging/producción, resultados auténticos de pruebas, restauración medida,
compatibilidad hacia atrás y aprobación humana cuando corresponda. Las cinco
evidencias exigidas por `verificarEntrega` en `operacion-documental` continúan siendo
un contrato distinto: este taller no inventa una aprobación para satisfacerlo.

## Responsabilidades y cierre

| Archivo del taller | Responsabilidad |
|---|---|
| `operacion.mjs` | Mecanismos locales de caché autorizada, respaldo, handler y candidata |
| `protocolo.json` | Configuración previa de la microcomparación |
| `medir.mjs` | Consultas equivalentes, tiempos, percentiles e informe generado |
| `demo.mjs` | Archivo real de respaldo, restauración y ensayo de entrega |
| `test/operacion.test.mjs` | Casos positivos, negativos y fallos controlados |

La documentación de cierre debe conservar síntoma, causa, corrección, pruebas,
configuración, huellas, límites y riesgos residuales. C8 integra persistencia y
operación de la aplicación completa; C12 comprueba portabilidad y CI; C13 requiere
revisión y transferencia externas auténticas. Nada de este taller cambia Core 1.0.
