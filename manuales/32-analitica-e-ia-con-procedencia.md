# Analizar sin mezclar y responder con procedencia

Antes de conectar un modelo, organice la evidencia. Una brigada puede contar aves,
preparar variables y buscar observaciones sin convertir una predicción o un resumen
en una fuente autoritativa. El taller muestra esos límites con datos ficticios y un
recuperador léxico determinista. No entrena ni llama a una inteligencia artificial.

## Ejecutar el recorrido

Requiere Node.js 22.13 o superior; no instala paquetes, motores ni credenciales:

```sh
npm test --prefix replication/examples/analitica-c7
npm start --prefix replication/examples/analitica-c7
npm run evaluar --prefix replication/examples/analitica-c7
```

La demostración produce un manifiesto con una observación para entrenamiento y otra
para evaluación, tres exclusiones con causas diferentes, una cita autorizada, una
abstención y el rechazo de una herramienta de escritura. La evaluación conserva un
informe JSON en una carpeta temporal nueva; su ruta se imprime al terminar. No
sobrescribe resultados anteriores. `make verificar-c7` añade coherencia libro/web.

## Separar observación y conocimiento

Una observación ocurrió el 12 de enero, pero se registró el 25. No estaba disponible
el 15 aunque describa algo anterior. Usarla como entrenamiento al día 15 introduce
información que entonces no se conocía.

El protocolo fija dos cortes UTC: entrenamiento al 15 de enero de 2026 y evaluación
al 31. Para entrenamiento se exige observación y conocimiento anteriores o iguales
al primer corte. Evaluación admite observaciones posteriores al primero, conocidas
antes o al segundo. Las observaciones antiguas conocidas tarde quedan excluidas del
entrenamiento, no se trasladan artificialmente a evaluación.

En estos datos `observadaEn` significa observación ya ocurrida: se rechaza que
`conocidaEn` sea anterior. Los ejemplos históricos que separan futuro válido de
conocimiento anterior no deben reutilizarse para esta semántica; una reserva o una
planificación futura requiere otro contrato temporal. Este taller no reinterpreta
los experimentos históricos ni reemplaza su protocolo.

## Evitar fuga entre entidades

Dos observaciones de una misma parcela pueden estar relacionadas. Si una aparece a
cada lado de la partición, la evaluación deja de representar una parcela independiente.
El taller rechaza esa intersección, en lugar de ocultarla moviendo filas al azar.
El identificador de entidad debe elegirse según el problema: parcela, persona, equipo
o dispositivo. Comprobar IDs no detecta entidades duplicadas con nombres distintos.

Se distinguen tres causas de exclusión: sin habilitación didáctica, conocimiento tardío
para entrenamiento y fuera del segundo corte. La bandera `habilitadoAnalitica` es un
campo ficticio del ejercicio, no consentimiento, fundamento legal ni autorización
para procesar datos reales. La aplicación real necesita su propia política y revisión.

## Versionar características y fuentes

La característica `cantidad-v1` conserva la cantidad observada como entero positivo.
No es una etiqueta predictiva ni un modelo. Una versión desconocida se rechaza; una
fórmula nueva necesita definición, compatibilidad y pruebas propias. Si incorpora
normalización o imputación, ajuste sus parámetros solo con entrenamiento y congele
esa transformación antes de evaluar.

El manifiesto conserva ámbito, cortes, versión, particiones, fuentes usadas con revisión
y huella, y conteos de exclusión. Se ordena por identidad para que barajar la entrada
no cambie su huella. Las huellas corresponden a una vista normalizada de campos
explícitos, no al documento físico completo ni a una firma del autor. El manifiesto
no archiva por sí solo todos los registros excluidos: conserve también la instantánea
autorizada para auditar la selección. El fixture completo tiene huella en el informe.

## Recuperar evidencia antes de responder

El asistente recibe un repositorio por ámbito. Primero autoriza actor, capacidad,
ámbito y finalidad; después solicita únicamente el ámbito permitido. Si el adaptador
mezcla documentos de otro ámbito, se rechaza todo el resultado antes de puntuarlo.
No se busca en un corpus global para filtrar después.

Se reutiliza `RecuperarEvidencia`, con coincidencia de palabras en especie y cantidad,
normalización de acentos y umbral 0,5 fijado en `protocolo.json`. Una puntuación de 1
no significa probabilidad del 100 % ni certeza. La salida es una indicación fija de
consultar las citas; no genera una explicación biológica ni un diagnóstico.

Cada cita conserva identidad, ámbito, revisión, huella de la vista consultada y versión
del recuperador. Si no hay coincidencias suficientes, devuelve `abstencion` con causa.
Estas referencias deben resolverse contra la fuente autorizada si se presentan como
enlaces reales. El taller conserva identificadores, no publica un servicio de enlaces.

## Evaluar sin esconder fallos

El archivo `fixtures.json` fija diez consultas y resultados esperados escritos para
enseñar, no anotados por expertos independientes. El protocolo, fixture e implementaciones
tienen huellas en el informe. El umbral no se ajusta después de ver sus errores.

El recuperador coincide exactamente en ocho consultas. Ante `colibri enfermo`, cita
el documento de colibrí aunque este no contiene estado de salud: falso positivo.
Ante `ave pequeña que poliniza`, no reconoce la relación semántica que la etiqueta
didáctica asocia con colibrí: falso negativo. No borre esos casos para mejorar la cifra.

Las métricas usan dos unidades distintas:

- Por consulta: coincidencias exactas, cobertura de respuestas y abstenciones
  correctas entre las consultas sin evidencia esperada.
- Por cita: verdaderos positivos, falsos positivos y falsos negativos. Precisión
  es TP/(TP+FP); recuperación es TP/(TP+FN). Un denominador cero se presenta como
  `null`, no como éxito perfecto.

Estas métricas describen diez fixtures, no generalización, calidad de un LLM ni
seguridad frente a ataques reales. Una evaluación externa necesita casos representativos,
anotación independiente, criterios de relevancia, versión del proveedor/modelo,
variabilidad, costos, tiempos, privacidad y revisión humana de respuestas y citas.

## Una herramienta no hereda permisos del modelo

La única herramienta es `resumir-observaciones`, de lectura. Su entrada acepta
exactamente `herramienta` y `ambito`. El contexto autorizado viene aparte del servidor;
añadir `permisos`, `actorId` o una herramienta de borrado produce rechazo. No existe
una ruta de escritura para que un texto o modelo pueda habilitarla.

Una instrucción dentro de la consulta o de un documento se trata como dato. El
recorrido no ejecuta texto ni lo transforma en nombres de funciones. Eso es una
frontera explícita de este programa, no una prueba de resistencia general contra
inyección de instrucciones en un LLM: aquí no hay LLM. No comparta documentos con
un proveedor externo hasta verificar autorización, minimización y tratamiento de datos.

## Límites de integración

El taller es un módulo hermano de la aplicación original; no cambia su dominio,
SDK ni Core 1.0. El contexto está inyectado para pruebas, no autentica personas.
La recuperación recorre documentos en memoria y ordena candidatos: además del costo
del texto, ordenar K coincidencias cuesta O(K log K). El mapa de referencias evita
volver a recorrer todo el corpus por cada cita, a cambio de O(N) de espacio adicional.
No crea índices vectoriales.
No hay entrenamiento, detección estadística de deriva ni decisión automática sensible.
Una diferencia de medias aislada tampoco demuestra por sí sola deriva de un modelo.

C8 integra interfaz, persistencia y operación; C13 requiere revisión semántica,
transferencia y evidencia externa auténticas. El artículo científico no recibe nuevas
afirmaciones de superioridad por estos ejemplos pedagógicos.
