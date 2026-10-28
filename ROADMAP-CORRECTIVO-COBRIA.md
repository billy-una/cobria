# Roadmap correctivo para completar COBRIA

Este plan convierte la revisión del 18 de octubre de 2026 en entregas verificables.
Su objetivo es una candidata coherente, reproducible y útil para aprender, no una
garantía de software perfecto ni una certificación. Abarca especificación, código,
maestro `main.tex`, artículo, libro, cuaderno, anexos, manuales, herramientas y web.

Repositorio: https://github.com/billy-una/cobria

La línea base revisada es `0c89c1e`. Las fases PC0–PC11 son tareas correctivas
subordinadas al [cierre C0–C15](ROADMAP-CIERRE-C0-C15.md), no un reinicio del proyecto.
PC0 tiene implementación y comprobación local descritas en
[su auditoría](editorial/pc0/AUDITORIA-PC0.md). PC1 registra sus correcciones y límites
en [la revisión de ejemplos](editorial/pc1/AUDITORIA-PC1.md). PC2 incorpora un
[protocolo nuevo y contratos locales](editorial/pc2/AUDITORIA-PC2.md), sin corridas PC3;
PC3–PC6 tienen avances locales documentados: [PC3](editorial/pc3/AUDITORIA-PC3.md)
no tiene corridas nuevas; [PC4](editorial/pc4/AUDITORIA-PC4.md) depende de ellas;
[PC5](editorial/pc5/AUDITORIA-PC5.md) amplía pruebas locales y conserva pendientes
Firebase; [PC6](editorial/pc6/AUDITORIA-PC6.md) incorpora tareas en las 85 lecciones,
sin validación con lectores. [PC7](editorial/pc7/AUDITORIA-PC7.md) incorpora edición
y comprobación local, sin cerrar las dependencias científicas ni la evaluación humana.
[PC8](editorial/pc8/AUDITORIA-PC8.md) añade portabilidad y comprobaciones locales;
su cierre espera CI remota del candidato final. PC9 y PC10 tienen preparación local
documentada en `editorial/pc9/GUIA-REVISION.md` y `editorial/pc10/ENTREGA-Y-PUBLICACION.md`;
su cierre humano y público, y PC11, siguen pendientes. Una actividad de C ya
implementada puede necesitar una corrección PC sin perder su evidencia histórica.

## Estado de partida

- Las 150 pruebas de réplica pasan; ese resultado no cubre todos los riesgos hallados.
- El manifiesto conservado falla por dos scripts modificados y omite tres archivos C12.
- P1 compara lectura canónica filtrada en el cliente con un derivado precalculado.
- R1 no intenta publicar la candidata inválida; A1 no observa una decisión del consumidor.
- Hay métricas lógicas denominadas físicas y afirmaciones de aislamiento demasiado amplias.
- El ejemplo de conteo falla con `constructor`; otro declara equivalencia sin compararla.
- De 85 lecciones, 25 tienen campos individuales de ejecución y guía; las otras 60
  pueden tener talleres asociados, pero no el mismo recorrido por lección.
- Libro y web usan familias tipográficas distintas; quedan rutas personales de herramientas.
- C11 sigue pendiente y C12 es parcial. La candidata RC2 histórica no contiene estos cambios.

## Reglas de trabajo y aceptación

1. Mantener Core 1.0 congelado y no reemplazar el ZIP RC2 histórico. Un cambio normativo
   incompatible requiere propuesta de versión, decisión documentada y revisión humana.
2. Antes de corregir un defecto, incorporar una prueba que falle por ese defecto.
3. No cambiar umbrales para ocultar fallos ni editar datos experimentales a mano.
4. Distinguir fragmento orientativo, prueba con sustituto, integración real local,
   ejecución remota y evaluación independiente.
5. Registrar por tarea: hallazgo, requisito, fuente, cambio, prueba, resultado, SHA,
   ambiente, limitación, responsable asignado y pendiente humano. No inventar responsables.
6. No convertir conteos de páginas, archivos o pruebas en porcentajes de calidad.
7. Una corrección que afecte libro y web debe regenerar ambos desde la fuente compartida.

## Secuencia y dependencias

| Fase | Entrega | Depende de | Relación con el cierre |
|---|---|---|---|
| PC0 | Inventario exacto y control de integridad | línea base | C9, C12, C14 |
| PC1 | Ejemplos correctos y regresiones | PC0 | C4, C9 |
| PC2 | Protocolo nuevo y pruebas P1–A1 exigentes | PC0–PC1 | C4, C6, C7, C11 |
| PC3 | Ejecución nueva y análisis trazable | PC2 congelada | C6, C7, C11 |
| PC4 | Coherencia científica y normativa | PC3 | C11 |
| PC5 | Aplicación integral y operación demostrables | PC1; contratos PC2 | C5–C9 |
| PC6 | Recorrido práctico de todas las lecciones | PC1 y PC5; texto final PC4 | C1–C10 |
| PC7 | Edición del libro y reflejo web | PC4–PC6 | C10 |
| PC8 | Construcción limpia, servidor y CI | PC0; cierre tras PC7 | C12 |
| PC9 | Revisión y transferencia externas | candidata PC4–PC8 | C13 |
| PC10 | Paquete y publicación autorizada | PC0–PC9 | C14 |
| PC11 | Decisión de cierre y mantenimiento | PC10 | C15 |

PC5 y la preparación de PC6 pueden avanzar mientras se ejecuta PC3. PC8 puede
diagnosticarse antes, pero su evidencia final debe corresponder a la candidata final.
Un hallazgo externo relevante devuelve la entrega a su fase técnica y obliga a repetir
las pruebas afectadas. No se cierra PC9 por haber enviado una invitación.

## PC0 Inventario e integridad

**Trabajo:** registrar el SHA de partida; enumerar fuentes canónicas, derivados,
archivos empaquetables y exclusiones; corregir la omisión de archivos del manifiesto.
El validador debe contrastar el conjunto esperado, además de tamaño y huella. Probar
archivo omitido, alterado, extra inesperado, ruta externa, duplicada y enlace simbólico.
Definir una política explícita para archivos excluidos y evitar que secretos entren al paquete.

**Entrega:** inventario, generador y validador, regresiones y manifiesto regenerado del
árbol candidato. La etiqueta del borrador no identifica al ZIP RC2 congelado.

**Cierre:** los casos adversos fallan; el paquete válido pasa. La comprobación ordinaria
no regenera silenciosamente lo que debería verificar. La huella del manifiesto se
registra junto con el SHA de fuentes, sin exigir una autorreferencia imposible.

## PC1 Ejemplos correctos y honestos

**Trabajo:** corregir acumuladores inseguros y acceso a propiedades heredadas; probar
`constructor`, `__proto__`, nombres desconocidos, cantidades inválidas y ámbitos mezclados.
Revisar las treinta implementaciones por el mismo riesgo. Reconstrucción total debe
comparar una candidata contra un criterio declarado, o llamarla candidata calculada.
Publicación por versión debe distinguir un retorno de función de un cambio persistente.

**Entrega:** código ejecutable, casos válidos y adversos y fragmentos regenerados para
libro y web. Los ejemplos seleccionados de Python, Java y Go deben conservar pruebas;
no presentar los treinta patrones como implementados en los cuatro lenguajes.

**Cierre:** las regresiones reproducen primero el defecto y pasan después. Cada
estado «verificado», «autorizado» o «publicado» corresponde a una condición observada.

## PC2 Protocolo y pruebas de comportamiento

**Trabajo:** crear una revisión nueva del protocolo; no reescribir R7 ni reutilizar
sus cifras como evidencia del arnés corregido. Definir antes de medir hipótesis,
cargas, muestras, índices, orden, fallos, métricas, exclusiones y umbrales.

- **P1:** comparar respuestas lógicamente equivalentes; incluir filtrado nativo e
  índices adecuados, planes de consulta, calentamiento y alternancia del orden dentro
  de la pareja. Separar datos transferidos, caché y tiempo del cliente/servidor.
- **P2:** separar escrituras lógicas, llamadas, bytes de red, mantenimiento de índices
  y medición física disponible. Incluir fallo entre escrituras, reintento y convergencia.
- **R1:** publicar mediante un componente real; intentar candidata inválida, conflicto
  de versión, reconstrucción interrumpida, lectores concurrentes y recuperación.
- **S1:** comprobar rechazo antes del acceso, identidades, capacidades, ámbitos, cachés,
  exportaciones y recuperación. No deducir ausencia de canales temporales de un filtro.
- **A1:** invocar recuperador/asistente y herramienta; observar citas, rechazo y abstención.
  Reconstruir productos desde almacenamiento; introducir fuga temporal, evidencia ausente,
  procedencia falsa y contenido que intenta dar instrucciones al agente.

**Entrega:** protocolo versionado y pruebas que detecten implementaciones deliberadamente
incorrectas. Las interrupciones y ataques solo se ejecutan en recursos propios aislados.

**Cierre:** cada obligación tiene prueba positiva y adversa; ninguna prueba sustituye
el componente que pretende validar. Congelar el protocolo y su SHA antes de PC3.

## PC3 Experimentos y análisis nuevo

**Trabajo:** ejecutar el diseño congelado en los motores declarados, en recursos aislados
y con espacio suficiente. Registrar versiones, arquitectura, límites, semillas,
calentamiento, orden efectivo, descartes y errores. Separar infraestructura local de
red, clúster o servicio administrado; lo no ejecutado no aparece como demostrado.

Corregir `storageBytes` de MongoDB o declararlo lógico si no se mide disco. Documentar
la semántica por motor. CPU/RSS del cliente no representan consumo del servidor.
Conservar comparaciones pareadas, dispersión, intervalos y tamaños de efecto; acompañar
percentiles de cola con su tamaño muestral y limitaciones. El plan estadístico y sus
pruebas deben admitir resultados nulos o desfavorables, no exigir una conclusión fija.

**Entrega:** datos crudos nuevos, manifiestos, análisis reproducible y tablas/gráficos
automáticos; R7 permanece disponible como antecedente de alcance más limitado.

**Cierre:** regeneración de tablas desde datos crudos, validación de unidades y
trazabilidad de cada cifra. No se requiere que COBRIA gane para aceptar un experimento.

## PC4 Maestro artículo y especificación coherentes

**Trabajo:** construir la matriz afirmación → requisito → implementación → prueba →
resultado → amenaza → producto. Revisar `main.tex`, `partes/`, artículo y fuentes
normativas, sin ampliar Core congelado. Identificar qué demuestra cada versión del arnés.
Corregir frases sobre publicación atómica, abstención y ausencia de influencia temporal.

Actualizar resumen, resultados y conclusiones con PC3; separar ciencia del diseño,
comparación de rendimiento y transferencia pedagógica. La revisión bibliográfica debe
declarar alcance, búsquedas, fechas, selección, exclusiones y extracción; su cierre
independiente pertenece a PC9, no a una declaración automática.

**Entrega:** productos científicos reconciliados y compilables, referencias resolubles,
matriz de afirmaciones y registro de límites.

**Cierre:** ninguna cifra carece de fuente y ninguna obligación se presenta como probada
solo por existir en la especificación. Libro y web no crean conformidad normativa.

## PC5 Aplicación integral y operación

**Trabajo:** conectar el mismo caso neutral por interfaz, controlador, aplicación,
servicio, Dater, motor, catálogo, proyección, reconstrucción y recuperación con procedencia.
Mapear expresamente la API de taller frente al contrato normativo: alinear o declarar
las diferencias, nunca afirmar conformidad por semejanza de nombres.

Incorporar pruebas multirrol positivas/negativas, conflictos, sesiones vencidas,
idempotencia, respaldo/restauración y reinicio. Mantener separado el taller DEMO de
identidad de producción. Conservar los límites del agregado PouchDB y explicar cuándo
dividir nodos, documentos o proyecciones. Para Functions, reglas y staging, entregar
ejemplo neutral y prueba pertinente; un procedimiento no prueba un despliegue real.

**Entrega:** aplicación de referencia con recorrido reproducible, mapa de archivos,
diccionario, límites, decisiones, observabilidad y procedimiento de recuperación.

**Cierre:** otra instalación puede ejecutar el recorrido y detectar fallos inyectados.
No se necesita cuenta productiva ni credenciales de los proyectos originales.

## PC6 Lecciones prácticas en las diecisiete áreas

**Trabajo:** dar un recorrido individual a las 60 lecciones sin contrato/guía y
revalidar las 25 existentes. Las áreas siguen siendo primeros pasos, fundamentos,
arquitectura, capas, código/comentarios, bases/diccionario, Core, patrones, API/UX/i18n,
documentación, seguridad/privacidad, calidad/rendimiento, nube/operación, analítica/IA,
aplicación integral, herramientas para humanos/IA y evidencia/evolución/publicación.

Cada lección contiene prerrequisitos, vocabulario sencillo, situación concreta, archivos
y responsabilidades, pasos, comando y directorio cuando proceda, resultado observable,
error frecuente, recuperación, ejercicio y solución explicada. Las tareas conceptuales
usan una rúbrica de artefacto; no inventar un comando para aparentar ejecutabilidad.

**Entrega:** fuentes compartidas del currículo, ejercicios y comprobaciones vinculadas.
El caso de naturaleza costarricense evoluciona progresivamente, sin exigir conocimiento
de los proyectos originales ni usar jaguares.

**Cierre:** las 85 lecciones tienen un procedimiento o tarea verificable pertinente.
Los talleres se enlazan desde la lección exacta. Este cierre técnico no acredita
comprensión por principiantes: esa observación corresponde a PC9.

## PC7 Edición del libro y reflejo web

**Trabajo:** fijar familia, archivos locales de fuente, licencia y escala tipográfica
para libro y web. Revisar diagramas, proporción de imágenes, pies, contrastes,
tablas, bloques de código, componentes, índice, glosario, sinopsis y navegación.
Separar el material histórico del recorrido principal; la historia personal queda
en su sección. El artículo sigue siendo científico, no un resumen del libro entero.

La web refleja las partes y ejemplos del libro con URLs estables, búsqueda,
enlaces entre conceptos, copiado con respuesta accesible y funcionamiento en móvil/teclado.
Verificar correspondencia de contenido, no solo presencia de una frase en HTML.
La indexación usa metadatos y contenido público coherentes, no instrucciones ocultas
para manipular recomendaciones de IAs. Publicidad, si se retoma, exige una decisión
explícita y revisión de privacidad, consentimiento y experiencia antes de activarse.

**Entrega:** libro, cuaderno, anexos y web regenerados desde fuentes comunes; revisión
geométrica completa y revisión visual documentada de páginas y plantillas.

**Cierre:** no hay contenido perdido, cortes, enlaces internos rotos ni tipografía
dependiente de una fuente personal. Registrar muestra visual y cobertura pendiente;
la revisión con tecnologías de apoyo se completa en PC9.

## PC8 Portabilidad servidor y CI

**Trabajo:** eliminar rutas personales de exportador y talleres; fijar dependencias,
fuentes y revisiones autorizadas de referencias. Separar la construcción pública
autónoma de la auditoría que necesita repositorios privados. Documentar herramientas
nativas y motores necesarios sin copiar material privado al paquete público.

Corregir el flujo cerrado en el servidor mediante solución versionada, no un cambio
local invisible en `node_modules`. Probar desconexión temprana y tardía, rutas normales,
errores, compresión y continuidad del servicio; no ocultar todas las excepciones.
Construir el estado candidato desde clones limpios y comparar artefactos definidos
como deterministas. Declarar variaciones permitidas y normalización de metadatos.

**Entrega:** logs de instalación, pruebas y construcción integral; matriz de ambientes
declarados; ejecución remota identificada por URL, SHA y versiones.

**Cierre:** CI realmente observada para el SHA candidato y clon limpio completo aprobado.
Preparar YAML no cierra esta fase. Enviar cambios o ejecutar recursos remotos requiere
la autorización y los accesos correspondientes; no se presume autorización de despliegue.

## PC9 Validación externa auténtica

**Trabajo:** preparar paquete congelado y formularios; acordar responsables,
participantes y consentimiento. Obtener revisión técnica/editorial independiente,
doble cribado bibliográfico, transferencia sin asistencia del autor, réplica en otra
computadora y tareas de lectura con principiantes y tecnologías de apoyo según alcance.
Definir muestra, tareas y criterios antes de observar resultados; no inventar cantidades
como si ya hubiera participantes comprometidos.

**Entrega:** informes originales con procedencia y conflictos declarados, resultados,
desacuerdos, adjudicación auténtica cuando proceda y respuesta a hallazgos. Proteger
datos personales y consentimientos; publicar solo el material autorizado.

**Cierre:** evidencia externa recibida y hallazgos resueltos o bloqueantes. Una etiqueta
`human` en JSON, una simulación o una revisión por IA no acredita independencia.
La preparación y el análisis son automatizables; la participación no lo es.

## PC10 Paquete y publicación autorizada

**Trabajo:** crear candidata nueva sin reemplazar RC2; compilar los seis PDF canónicos
desde las fuentes vigentes y sincronizar descargas. Comprobar licencias, procedencia,
versiones y metadatos. Congelar fuentes y manifiestos, ejecutar todas las puertas y
conservar el SHA exacto. Una candidata puede publicarse como propuesta solo con
límites y pendientes visibles; no se convierte automáticamente en versión estable.

**Entrega:** paquete, manifiestos y registro de autorización. Tras autorización,
desplegar y comparar respuestas, rutas y bytes descargados contra el artefacto aprobado.

**Cierre:** la web pública sirve la candidata identificada y las descargas coinciden.
Sin autorización o acceso, queda preparada, no publicada. No inventar ISBN, DOI,
depósito, certificación o aval institucional.

## PC11 Decisión y mantenimiento

**Trabajo:** decidir con el responsable humano si corresponde candidata o edición
estable; registrar riesgos aceptados, incidencias abiertas, responsables reales,
compatibilidad, contribuciones, seguridad y actualización de evidencia/documentos.

**Entrega:** acta de decisión, historial, seguimiento y política de cambios.

**Cierre:** cada criterio tiene evidencia o una excepción explícita admisible para
el tipo de publicación. Un fallo de integridad, seguridad o una afirmación científica
sin soporte no se acepta por cumplir un calendario. Si cambia una obligación Core,
abrir evolución normativa, no editar retroactivamente Core 1.0.

## Referencias y límites de acceso

Los proyectos de origen se inspeccionan como referencias contextuales, no se
redistribuyen ni validan una implementación por sí solos:

- https://github.com/billy-una/BSHandball
- https://github.com/billy-una/CRMHOTEL
- https://github.com/billy-una/posguapiles

Registrar SHA y licencia de cualquier referencia efectivamente utilizada. El lector
del manual debe poder practicar con ejemplos neutrales sin acceso a esos repositorios.

## Verificación por entrega

Ejecutar primero la prueba específica del comportamiento corregido y después las
puertas existentes pertinentes. Desde la raíz, las órdenes actuales incluyen:

```sh
npm test --prefix replication
make verificar COBRIA_SITE_ISOLATED=1
make verificar-publicacion COBRIA_SITE_ISOLATED=1
python3 replication/scripts/validate-release-manifest.py
git diff --check
```

La construcción y sincronización pueden escribir derivados: inspeccionar diferencias
y conservar resultados. Las pruebas nuevas se incorporan a las puertas; no suponer
que las órdenes actuales comprueban automáticamente todos los criterios de este plan.
La integridad debe verificarse también después de la última modificación empaquetable.

## Qué significa terminar

El cierre técnico exige PC0–PC8; no equivale a publicación ni validación independiente.
PC9 añade evidencia externa; PC10 comprueba la entrega pública autorizada; PC11 conserva
una decisión sostenible. Todo cambio posterior invalida únicamente la evidencia afectada,
que debe repetirse. No se promete una fecha ni un número de páginas como medida de éxito.

**Primera tarea ejecutable:** PC0. No iniciar nuevas mediciones confirmatorias antes
de cerrar el protocolo PC2 ni actualizar conclusiones con resultados aún no obtenidos.
