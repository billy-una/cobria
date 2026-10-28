export const antecedents={
  repositorio:'https://martinfowler.com/eaaCatalog/repository.html',
  mapeador:'https://martinfowler.com/eaaCatalog/dataMapper.html',
  idempotencia:'https://microservices.io/post/microservices/patterns/2020/10/16/idempotent-consumer.html',
  salida:'https://microservices.io/patterns/data/transactional-outbox.html',
  cqrs:'https://martinfowler.com/bliki/CQRS.html',
  vista:'https://learn.microsoft.com/en-us/azure/architecture/patterns/materialized-view'
};
// Clasificación editorial argumentada, no declaración de novedad ni norma.
export const reviews=[
  [1,'contrato','Combina identidad, ámbito y autoridad; congelar un objeto no implementa todas esas garantías.',null],
  [2,'adaptación','Organiza tiempos del hecho y de conocimiento para el contrato documental; no inventa el modelado temporal.',null],
  [3,'adaptación','Añade ámbito explícito al papel de repositorio; el repositorio es un antecedente reconocido.','repositorio'],
  [4,'contrato','Exige interpretar un código con una edición; un catálogo no es por sí mismo un patrón de objetos.',null],
  [5,'adaptación','Usa representaciones de lectura derivadas, con antecedentes en vistas materializadas.','vista'],
  [6,'mecanismo','Selecciona información para una lectura; cubrir campos no concede acceso a ellos.',null],
  [7,'contrato','Declara reconstrucción desde fuentes; el ejemplo calcula una candidata, no verifica equivalencia general.',null],
  [8,'mecanismo','Aplica cambios desde una posición; requiere demostrar integridad del historial, no solo guardar un cursor.',null],
  [9,'mecanismo','Propone una versión activa y reversión; el fragmento no cambia un alias persistente.',null],
  [10,'patrón reconocido','Procesamiento idempotente tiene antecedentes explícitos; la variante local no prueba exclusión concurrente.','idempotencia'],
  [11,'mecanismo','Controla revisiones obsoletas; la comparación debe ser indivisible en el motor para cubrir concurrencia.',null],
  [12,'patrón reconocido','La bandeja de salida transaccional es un patrón previo; el ejemplo devuelve un plan, no una transacción real.','salida'],
  [13,'mecanismo','Detecta y propone reparar una divergencia; igualdad de identificadores no demuestra igualdad de contenido.',null],
  [14,'contrato','Declara fuentes y repetibilidad de un conjunto; no es un algoritmo nuevo de aprendizaje.',null],
  [15,'contrato','Versiona una transformación de características, no valida por sí sola una predicción.',null],
  [16,'mecanismo','Limita recuperación al ámbito autorizado; el corpus recibido también debe ser confiable.',null],
  [17,'mecanismo','Gobierna una herramienta; una aprobación booleana no autentica a una persona.',null],
  [18,'heurística','Guía la separación de autoridad de lectura y escritura; no equivale a implementar todo CQRS.','cqrs'],
  [19,'heurística','Recomienda comparar un índice antes de mantener una copia; su utilidad depende de la carga.',null],
  [20,'mecanismo','Organiza el retiro con consumidores y reversión; el ejemplo no elimina datos remotos.',null],
  [21,'adaptación','Mantiene identidad al cambiar ubicación; la independencia de ubicación no nace con COBRIA.',null],
  [22,'mecanismo','Validar entradas es una práctica establecida; no se presenta como un patrón GoF específico.',null],
  [23,'adaptación','Aplica evolución explícita de formato; una migración local no demuestra migración de toda la colección.',null],
  [24,'contrato','Requiere un corte coherente de revisión; etiquetas iguales no prueban instantánea compartida.',null],
  [25,'contrato','Declara antigüedad admitida y conducta al excederla; necesita tiempos confiables.',null],
  [26,'contrato','Relaciona transformación, fuentes y versión; una cadena con forma de huella no comprueba sus bytes.',null],
  [27,'contrato','Prohíbe fuga según el protocolo; el caso local no detecta todas las dependencias ocultas.',null],
  [28,'mecanismo','Se abstiene con evidencia insuficiente; un umbral no acredita calibración del modelo.',null],
  [29,'heurística','Explicita costo total y presupuesto; no demuestra que toda proyección sea rentable.',null],
  [30,'experimental','Propone reconstruir un relato de auditoría; no sustituye evidencia legal ni revisión independiente.',null]
];
export const entryPatterns=[
  {name:'Repositorio',category:'patrón reconocido',reason:'Concentra acceso mediante una interfaz de colección; el ámbito es una adaptación del proyecto.',reference:'repositorio',file:'replication/examples/ecosistema-app/src/infrastructure/repositorio-memoria.mjs'},
  {name:'Mapeador y Dater',category:'adaptación',reason:'Dater es el nombre local de una frontera de traducción. No es un patrón universal nuevo ni obliga a letras compactas.',reference:'mapeador',file:'replication/examples/ecosistema-app/src/infrastructure/data/observacion-dater.mjs'},
  {name:'Inyección en la composición',category:'mecanismo',reason:'Entregar un repositorio desacopla su elección. Una función crearAplicacion no basta para llamarse Factory Method.',reference:null,file:'replication/examples/ecosistema-app/src/composition.mjs'},
  {name:'Atributos físicos a–h',category:'convención',reason:'Acuerdo del diccionario local. La letra g puede tener otro significado en otro contrato; el dominio no depende de esas letras.',reference:null,file:'replication/examples/ecosistema-app/data/diccionario-observaciones.json'}
];
