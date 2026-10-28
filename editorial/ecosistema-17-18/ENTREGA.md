# Revisión de candidata y preparación de publicación

Las fases 17 y 18 revisan una entrega concreta y preparan su mantenimiento. No amplían
Core 1.0 ni convierten COBRIA en un estándar oficial. Una comprobación automática,
una revisión humana independiente y una autorización de publicación son decisiones distintas.

## Candidata que se revisa

La entrega interna de la fase 16 procede de la instantánea
`2b0120a9c82b43ee903118b480ce02e29d110822`. Su ZIP tiene SHA-256
`1b3cef01b4dbf4aee4cb147044bb2e022f65c66af1bca3517fe44a8f3856d2b9`.
No sustituye RC2 ni incluye automáticamente las correcciones posteriores a su creación.
La huella del recibo identifica el objeto revisado, no una publicación estable.

## Revisión automática reproducible

Desde la raíz del repositorio:

```sh
make verificar-ecosistema-17-18
make revisar-candidata-ecosistema-17 \
  COBRIA_CANDIDATE=output/release/ecosistema-16-local/20261019T170850767529Z \
  COBRIA_REVIEW_OUTPUT=output/review/ecosistema-17-18/revision-nueva
```

El directorio de salida debe ser nuevo. La revisión valida el ZIP completo, rechaza
rutas inseguras y entradas duplicadas, comprueba los controles de construcción y QA,
restaura el bundle y compara todas las fuentes con su inventario. Consulta `npm audit`
desde los cuatro bloqueos restaurados, incluyendo desarrollo, sin instalar ni ejecutar
scripts de paquetes. Guarda las respuestas originales y los códigos de salida.
Una consulta fallida no se interpreta como ausencia de vulnerabilidades.
El informe identifica también las huellas del comprobador y de su política: una
revisión emitida mediante otro procedimiento no se acepta silenciosamente.

El dictamen automático rechaza vulnerabilidades moderadas, altas o críticas y cualquier
inconsistencia de integridad. Una aprobación no acredita revisión humana,
privacidad de toda la historia Git, seguridad integral, claridad pedagógica, pruebas
con tecnologías de apoyo ni comportamiento distribuido. `npm audit` describe el catálogo
de avisos disponible al consultar, no garantiza ausencia de fallos desconocidos.

La revisión conserva los casos Axe que necesitan evaluación manual y el rendimiento
como dato informativo. Las comprobaciones PDF de fase 16 no sustituyen lectura editorial
ni inspección visual exhaustiva. No se hereda la auditoría antigua rotulada RC1.
No vuelve a ejecutar el navegador ni los experimentos y no incluye una corrección
ortográfica integral; esos límites figuran en el resultado junto a las puertas pendientes.

## Revisión con personas

Antes de enviar el archivo, el responsable revisa privacidad y derechos: el bundle
contiene historia Git. No se distribuye automáticamente. Se utilizan los protocolos
existentes de `specification/phase-18/` y la guía `editorial/pc9/GUIA-REVISION.md`.

Se necesita una persona para revisión técnica y otra para edición y comprensión,
preferiblemente ajenas al desarrollo. Deben declarar conflictos de interés, versión
y huella revisadas, independencia real, asistencia recibida y límites de su trabajo.
La autoría humana no se deduce de una bandera JSON y una evaluación asistida por IA
se identifica como tal. No se inventan identidades ni se cambian declaraciones para
simular independencia. La transferencia exige consentimiento y el protocolo aplicable;
el doble cribado y la réplica externa se registran por separado.

Cada hallazgo incluye identificador, ubicación, pasos, resultado esperado y observado,
gravedad, impacto, evidencia y recomendación. El autor responde con aceptación o
justificación, corrección y prueba. La persona revisora confirma el retest; si no lo
hace, figura como pendiente. No se elimina una observación negativa por haber corregido
el código. La huella anterior queda conservada y la corrección origina otra candidata.

## Decidir sin publicar

```sh
make decidir-publicacion-ecosistema-18 \
  COBRIA_CANDIDATE=output/release/ecosistema-16-local/20261019T170850767529Z \
  COBRIA_REVIEW_REPORT=output/review/ecosistema-17-18/revision-nueva/REVISION.json \
  COBRIA_DECISION_OUTPUT=output/review/ecosistema-17-18/decision-nueva
make preparar-estable
```

La decisión escribe sus bloqueantes y termina con código 2: publicación retenida.
No crea etiquetas, no hace push y no despliega. Cambiar estados históricos a
`executed` no autoriza esta candidata. Tampoco basta con cambiar banderas de la política:
la herramienta no dispone de una rama que publique. La aceptación de evidencia humana
y externa requiere evaluación real y una revisión explícita del procedimiento.

## Entrega y operación cuando se autoricen

1. Cerrar y registrar las incidencias críticas y los retests, conservando resultados negativos.
2. Evaluar revisiones humanas, cribado, transferencia y réplica externa de la versión concreta.
3. Revisar licencias, privacidad y derechos del archivo y de su historia; preparar un paquete
   público saneado sin alterar el interno conservado.
4. Revisar y confirmar el árbol final. Construir dos veces desde ese SHA y observar la CI
   remota de la misma revisión; los cambios de estas fases requieren otra candidata.
5. Obtener autorización explícita de la persona responsable. Acordar registro de versión,
   notas, canal de incidencias y disponibilidad de mantenimiento.
6. Publicar únicamente los artefactos aprobados mediante el flujo autorizado; guardar recibo
   de etiqueta, SHA, versión del alojamiento, fecha y huellas de descargas.
7. Comprobar acceso anónimo real, rutas, cabeceras, seis PDF y manifiesto contra esos bytes.
   Ante un fallo, retener la promoción o volver a la última versión verificada, no reconstruir
   archivos distintos bajo la misma etiqueta.
8. Mantener `MAINTENANCE.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md` y
   `ROADMAP-1.X.md`. Priorizar defectos e informes reproducibles, no volumen de páginas.

La persona responsable de mantenimiento se confirma antes de publicar; no se presume
que colaboradores hayan aceptado tareas. El contacto de seguridad sigue siendo
`cbilly137@gmail.com`. Los objetivos comunitarios de respuesta no son garantías de servicio.

## Incidencias de este ciclo

| Incidencia | Impacto | Respuesta y estado |
|---|---|---|
| ECO17-01 | La auditoría antigua rotula RC1 y no identifica el ZIP nuevo | Nueva revisión por huella; herramienta histórica conservada para su alcance anterior |
| ECO17-02 | Estados declarativos podían parecer suficientes para promover | Puerta conservadora con contexto exacto y pendientes humanos; regresiones contra banderas simuladas |
| ECO17-03 | El ZIP conserva historia sin revisión de privacidad | Sigue bloqueado para distribución; no se confunde integridad con autorización |
| ECO17-04 | Árbol sin confirmar y CI final no observada | Nueva candidata y CI del SHA final pendientes; no se reutiliza la aprobación de otra versión |
| ECO17-05 | Claridad, edición integral y transferencia no acreditadas | Pendientes humanos bajo los protocolos existentes; no se sustituyen con esta revisión |

Las dos primeras correcciones afectan herramientas y documentación posteriores a la
instantánea revisada. Los informes generados indican sus resultados observados; este
documento no es una declaración de revisión independiente ni de publicación.
