# Revisión externa de la propuesta COBRIA

Esta ronda evalúa comprensión, ambigüedades y transferencia de la propuesta vigente.
El ZIP contiene seis PDF actuales y un subconjunto de manuales y especificación.
No es una distribución ejecutable completa ni sustituye una réplica desde Git.
El manifiesto identifica los bytes recibidos; su huella no acredita autoría humana.

## Antes de comenzar

Una persona coordinadora debe completar el prerregistro de `protocolo.json`: tamaño,
perfiles, tareas asignadas y tiempo disponible. Debe acordar consentimiento, custodio,
plazo de conservación, retiro y autorización de publicación antes de las tareas.
No se recopilan documentos de identidad ni información laboral innecesaria.
El consentimiento se conserva fuera del repositorio; el formulario usa una referencia
privada, no una firma ni datos de contacto.

Los perfiles técnicos necesitan experiencia en pruebas y sistemas documentales.
La revisión de lectura debe incluir personas del público principiante; la accesibilidad
requiere experiencia de uso de la tecnología de apoyo evaluada. No se atribuyen estos
perfiles a personas que aún no han aceptado. El doble cribado exige dos decisiones
separadas antes de discutir desacuerdos.

## Realizar y entregar las tareas

1. Identificar el paquete mediante `candidateDigest` en `MANIFEST.json`.
2. Elegir la tarea prerregistrada y usar un código de participante sin nombre público.
3. Registrar inicio, fin, entorno, pasos, errores y asistencia recibida. Conservar
   abandonos y desacuerdos; no sustituirlos por una respuesta ideal.
4. Para cada hallazgo, indicar archivo o página, resultado esperado, resultado obtenido,
   severidad, evidencia y sugerencia. Separar opinión de reproducción comprobable.
5. Completar `respuesta-plantilla.json`, adjuntar registros originales sin secretos y
   entregarlos privadamente a la coordinación. No subir consentimientos a Git.

La réplica ejecutable requiere el SHA final y sus instrucciones de construcción
pública. Mientras esa candidata no esté congelada y comprobada en CI, esta tarea queda
pendiente; el subconjunto editorial no promete ejecutar `make verificar`.
Las tareas de P1–A1 requieren además el protocolo y presupuesto experimental propios.

## Recepción y resolución

El validador detecta campos ausentes, no verifica identidad ni independencia.
La coordinación contrasta evidencia original, conflictos, asistencia y consentimiento.
Dos etiquetas JSON no convierten una simulación en trabajo humano.
Cada hallazgo debe recibir responsable, decisión razonada, corrección o rechazo,
prueba y retest. Si cambia el paquete, se calcula una huella nueva; no se presenta
la revisión anterior como aprobación de bytes distintos.

No se reutilizan automáticamente las respuestas históricas como revisión de esta ronda.
Solo se publican resultados anonimizados y autorizados. La recepción, interpretación
y eventual aceptación requieren intervención humana; la IA puede asistir al análisis.
