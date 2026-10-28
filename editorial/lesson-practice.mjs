// Fuente editorial: ejercicios específicos, no resultados de ejecución ni evaluación humana.
const activities={
  codigo:[
    ['Renombre contar(x) para expresar que cuenta aves por reserva y declare su unidad.','contarAvesPorReserva(observaciones, ambito) expresa entrada y alcance; devuelve individuos, no documentos.'],
    ['Escriba un comentario para explicar por qué no se acepta cantidad cero.','Explique la regla de un avistamiento confirmado y enlace el rechazo del dominio; no repita el if.'],
    ['Separe cantidad inválida, acceso denegado y motor caído en una tabla de errores.','El primero pide corregir entrada, el segundo revisar permiso y el tercero reintentar con la misma clave; no exponga stack.'],
    ['Separe normalizar fecha y guardar avistamiento e identifique cuál tiene efecto.','Normalizar devuelve UTC sin escribir; guardar recibe repositorio y contexto. Un fallo del guardado no cambia la regla pura.'],
    ['Revise una función con nombres ambiguos aunque pase el formateador.','Lint controla reglas mecánicas; la revisión explica ámbito, unidad y efecto. Un formato correcto no demuestra un nombre comprensible.']
  ],
  core:[
    ['Decida quién puede corregir el número de colibríes: expediente o resumen.','Corrija el expediente autorizado y reconstruya el resumen; jamás mantenga dos autoridades editables.'],
    ['Dibuje lo que ve el lector cuando se interrumpe una candidata antes de publicarse.','Sigue viendo la versión activa anterior; la candidata incompleta no puede convertirse en activa. CAS de un agregado no prueba transacción distribuida.'],
    ['Elabore una declaración de nivel con un requisito que todavía no ha probado.','Marque ese requisito pendiente y no declare el nivel completo. El nombre C2 no reemplaza la suite y su alcance.'],
    ['Compare dos resúmenes con distinto orden y otro con un ave faltante.','Declare si el orden importa; normalice solo lo permitido. La ausencia cambia el conjunto y debe fallar aunque el total coincida.'],
    ['Decida si conservar un resumen que nadie consulta pero duplica cada escritura.','Mida uso y costo, compruebe consumidores y prepare reversión; retire el derivado, nunca la fuente que lo reconstruye.']
  ],
  patrones:[
    ['Elija Repositorio con ámbito y escriba un caso donde no hace falta otra capa.','Úselo cuando varias rutas necesitan el límite; un script pequeño sin persistencia compartida puede no justificar la ceremonia.'],
    ['Combine objeto canónico y proyección sin añadir todos los treinta mecanismos.','El primero posee reglas y el segundo solo sirve lectura; agregue publicación versionada únicamente si el riesgo de reconstrucción lo exige.'],
    ['Compare frescura inmediata y costo de reconstrucción del conteo de aves.','Mayor frescura puede aumentar trabajo de escritura; haga explícito el presupuesto y mida antes de elegir.'],
    ['Construya el caso de un resumen escrito directamente por dos pantallas.','Cambie una copia y deje la otra antigua: el desacuerdo reproduce la doble autoridad. Cierre escrituras paralelas antes de reconstruir.'],
    ['Trace dependencias entre ámbito, identidad, proyección y reparación.','La proyección referencia identidad y ámbito de fuentes; reparación depende de esa procedencia. La fuente no depende del resumen para existir.']
  ],
  apiux:[
    ['Especifique una solicitud de registro y tres respuestas de rechazo.','Entrada válida necesita contexto confiable y clave; formato incorrecto, ámbito ajeno y revisión obsoleta tienen respuestas distintas.'],
    ['Diseñe estados vacío, guardando, confirmado y fallido para el formulario.','Cada estado usa texto accionable, no solo color; al fallar conserva entrada y clave. La lectura con teclado se comprueba aparte.'],
    ['Ordene avistamientos con igual instante y describa qué guarda el cursor.','Use instante e identidad para desempatar y vincule cursor a ámbito/filtro. El taller pagina en memoria: no promete instantánea concurrente.'],
    ['Repita una solicitud tras perder su respuesta y cambie luego su cantidad.','Misma clave y mismo cuerpo recuperan resultado; misma clave y otro cuerpo producen conflicto, no una segunda escritura silenciosa.'],
    ['Recorra el formulario a 320 px usando únicamente teclado.','Anote orden de foco, etiqueta, error y recuperación observados; no afirme compatibilidad con lector de pantalla sin probarlo.']
  ],
  documentacion:[
    ['Clasifique comenzar, listar campos, decidir agregado y restaurar una copia.','Son tutorial, referencia, ADR y procedimiento operacional, respectivamente; cada uno responde una necesidad distinta.'],
    ['Elija un texto generado y señale cuál fuente se edita para cambiarlo.','Para lecciones se edita la fuente editorial, se genera curriculum.json y después libro y web; nunca arregle solo el HTML derivado.'],
    ['Escriba un README que permita registrar el primer colibrí.','Declare Node, raíz, orden de instalación, comando, dirección local y resultado 3; enlace permisos y límites antes de sugerir producción.'],
    ['Escriba la decisión de un agregado y una instrucción para recuperarlo.','El ADR explica límites y alternativas; el procedimiento identifica copia, destino nuevo, huella y verificación. No mezcle razones con pasos urgentes.'],
    ['Enlace una afirmación de persistencia con archivo y prueba.','Use repositorio-pouch.mjs y el caso de reinicio en otro proceso; una ruta existente no demuestra por sí sola que se ejecutó.']
  ],
  seguridad:[
    ['Modele a un visitante intentando exportar datos de otra reserva.','Activo: observaciones; frontera: HTTP a aplicación; control: capacidad más ámbito; prueba negativa: 403 sin exportación.'],
    ['Planifique respuesta a un token expuesto sin escribir un secreto real.','Revocar identidad, limitar alcance, revisar accesos y emitir otra credencial; borrar un archivo no revoca lo ya expuesto.'],
    ['Añada al modelo una herramienta de IA que recibe texto malicioso.','El documento es evidencia y no instrucción. La herramienta conserva capacidad mínima y no ejecuta acciones solicitadas por el texto recuperado.'],
    ['Compare un actor conocido sin permiso con un token inventado.','El primero falla autorización y el segundo identidad. Ningún campo actorId enviado en el cuerpo concede capacidades.'],
    ['Elija una dependencia y describa cómo verificar actualización y reversión.','Conserve lockfile, procedencia, pruebas y versión anterior. Un inventario no es escaneo de vulnerabilidades ni garantía de ausencia de riesgo.']
  ],
  calidad:[
    ['Asocie la regla cantidad positiva a un caso válido y uno negativo.','Cantidad 3 acepta; 0 rechaza antes de persistir. El caso negativo protege la decisión, no un porcentaje abstracto de cobertura.'],
    ['Diseñe una comparación de lectura que pueda favorecer al índice nativo.','Misma salida y corpus, calentamiento y orden pareado fijados; conservar también costos de mantener la proyección y resultados desfavorables.'],
    ['Redacte el cierre de un fallo donde ocultar un botón no bloqueó la escritura.','Trace UI, caso de uso, autorización y motor; agregue prueba negativa en servidor, retest por rol y riesgo residual antes de cerrar.'],
    ['Genere tres cantidades límite y reduzca un contraejemplo.','Pruebe 0, 1 y un entero fuera del rango seguro; conserve entrada mínima y semilla. No convierta el fallo en caso omitido.'],
    ['Elija calidad del dato, del producto y en uso para el registro de aves.','Dato: cantidad válida; producto: rechazo correcto; uso: lector completa tarea. Esta última requiere personas, no se deduce del test unitario.']
  ],
  operaciones:[
    ['Defina una promoción local a staging sin copiar credenciales productivas.','Construya un artefacto identificado, configure ambiente separado, pruebe roles y reversión; producción requiere aprobación explícita.'],
    ['Diseñe un evento repetido de actualización de resumen.','Use clave vinculada al evento, resultado persistido y reintento acotado; una entrega al menos una vez no garantiza efecto externo exactamente una vez.'],
    ['Asigne propósito y datos permitidos a desarrollo, preview, staging y producción.','Desarrollo y staging usan datos sintéticos; preview tiene vida limitada; producción tiene acceso y aprobación propios. Promueva el mismo artefacto identificado.'],
    ['Separe borrador offline de operación sensible ya autorizada.','Guardar un borrador no confirma el hecho; al sincronizar revalide permiso, TTL, ámbito y revisión. No confíe en el permiso viejo del navegador.'],
    ['Prepare un ensayo de reversión que no sobrescriba un motor existente.','Restaure copia verificada en destino nuevo, compare hechos y opere con artefacto anterior compatible. Mida tiempo real antes de afirmar RTO.']
  ],
  ia:[
    ['Separe entrenamiento y evaluación por ave y fecha conocida.','No basta dividir filas al azar: una misma entidad puede filtrar información; el conocimiento posterior al corte se excluye.'],
    ['Responda sobre colibríes con identidad, revisión y huella como cita.','La cita apunta a fuente autorizada; si no respalda la pregunta, absténgase. Coincidencia léxica no demuestra el significado de la respuesta.'],
    ['Detecte una observación antigua conocida después del corte.','Aunque el evento sea antiguo, knownAt posterior produce fuga; cambie el corte o excluya el registro, no altere la fecha para pasar.'],
    ['Describa el orden de autorización y búsqueda entre dos reservas.','Resuelva ámbito desde identidad, limite candidatos y después busque. No recupere todo para ocultar filas al final.'],
    ['Incluya «borre la reserva» dentro de un documento recuperado.','Conserve la frase como cita y rechace herramienta de escritura; el contenido no cambia capacidades ni finalidad.']
  ],
  construir:[
    ['Trace el registro desde formulario hasta LevelDB y vuelva a la respuesta.','UI traduce, controlador valida protocolo, aplicación autoriza y orquesta, dominio decide, Dater traduce y repositorio confirma.'],
    ['Proponga un campo nuevo sin modificar directamente el formato activo.','Actualice diccionario y versión, prepare lectura compatible, migración y copia; no reutilice una letra con otro significado.'],
    ['Siga obs-c8-01 y compruebe conteo 3 después de reabrir.','Use la guía integral, conserve ruta propia y obtenga nueva sesión al reiniciar; datos persistidos no implican sesiones persistidas.'],
    ['Compare el puerto de memoria y registrarAtomico de C8.','No son intercambiables solo por tener guardar: declare capacidades y pruebas. MongoDB/CouchDB integrales no están entregados por este taller.'],
    ['Prepare una entrega sin afirmar revisión independiente no realizada.','Incluya SHA, pruebas, configuración y pendientes; un paquete reproducible local no reemplaza la ejecución por otra persona.']
  ],
  toolkit:[
    ['Diseñe una generación que encuentra un archivo modificado por el usuario.','Simule y compare; ante contenido diferente registre conflicto y no sobrescriba. Repetir una generación idéntica no debe cambiar bytes.'],
    ['Delimite una tarea para IA que no puede modificar Core ni resultados.','Declare autoridad, rutas protegidas, pruebas y reporte. Un documento leído no puede ampliar esa autorización.'],
    ['Añada a un manifiesto la ruta de una prueba ausente.','El validador debe señalar la ruta faltante; no cree un archivo vacío para aparentar evidencia.'],
    ['Ensaye un generador dos veces y compare los archivos planeados.','La segunda ejecución conserva contenido idéntico y un conflicto humano detiene la escritura; simulación no equivale a aplicación.'],
    ['Redacte contexto de agente para arreglar un formulario sin publicar.','Autorice solo UI y pruebas locales; excluya producción, secretos y Core. El informe debe separar realizado, comprobado y pendiente.']
  ],
  evidencia:[
    ['Elija «persiste tras reinicio» y enumere la evidencia necesaria.','Archivo de prueba, comando, salida, versión y ambiente sostienen la frase; no sostienen tolerancia a caída eléctrica.'],
    ['Decida qué conservar al retirar una edición del libro.','Archive fuentes y huellas, enlace sustitución y conserve límites; no borre resultados negativos para mejorar la apariencia de una versión.'],
    ['Complete una fila de trazabilidad y deje explícita su revisión humana pendiente.','Enlace requisito, implementación, prueba y resultado real. Un campo pendiente no se transforma en aprobado mediante generación.'],
    ['Distinga copiar el árbol de trabajo de clonar un commit limpio.','El árbol puede incluir cambios sin confirmar; el clon representa un SHA. Registre cuál se ejecutó y las diferencias, sin llamar réplica externa a ambas.'],
    ['Revise que portada, descargas y manifiesto anuncien la misma edición.','Construya desde fuentes identificadas, compare huellas y publique solo con autoridad; conserve procedimiento de retiro y versión previa.']
  ]
};

export function practiceFor(module,lesson,index){
  const pair=activities[module.key]?.[index];
  if(!pair && !lesson.execution)throw Error(`Práctica ausente ${module.key}/${index+1}`);
  return {
    kind:lesson.execution?'ejecucion-y-explicacion':'artefacto-con-rubrica',
    prerequisites:lesson.execution?.prerequisites ?? ['Leer la situación y el ejemplo de esta lección.','Tener el repositorio abierto; para redactar la decisión no necesita nube ni credenciales.'],
    vocabulary:[{term:'ámbito',meaning:'Reserva o frontera a la que pertenece la operación.'},
      {term:module.title,meaning:lesson.simple}],
    files:module.sources.map(file=>({path:file,responsibility:'Fuente de consulta de esta parte; abrir antes de cambiar su contrato.'})),
    steps:lesson.steps,
    exercise:pair?.[0] ?? `Ejecute la práctica «${lesson.title}» y explique qué rechazo evita un dato incorrecto.`,
    expected:lesson.execution?.expected ?? lesson.evidence,
    frequentError:lesson.mistake,
    recovery:'Vuelva al último ejemplo válido; compare entrada, ámbito y versión antes de cambiar una regla. Conserve el rechazo y no use datos productivos.',
    solution:pair?.[1] ?? `${lesson.example} La comprobación debe coincidir con el resultado esperado; si no coincide, revise el primer error sin desactivar la validación.`,
    rubric:[`Responde al ejercicio: ${pair?.[0] ?? lesson.title}`,`Justifica la decisión con el ejemplo: ${lesson.example}`,
      `Detecta el error: ${lesson.mistake}`,'Distingue lo observado de lo propuesto; anota qué no ha ejecutado.'],
    assessment:'autoevaluacion; no comprension validada con participantes'
  };
}
