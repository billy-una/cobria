import fs from 'node:fs';
import path from 'node:path';

// Describe lo que el ejemplo ejecuta, no la garantía del patrón completo.
const resultadosLocales = {
  7: 'Calcula una candidata; todavía no comprueba equivalencia ni un corte consistente.',
  9: 'Propone la versión siguiente y la reversión; no cambia la versión persistida.',
  12: 'Prepara documento y evento en memoria; no ejecuta una transacción del motor.',
  17: 'Valida una propuesta con aprobación declarada; no autentica a una persona ni ejecuta la acción.',
  20: 'Propone retirar la copia según entradas declaradas; no borra datos ni descubre consumidores reales.',
  22: 'Valida coordenadas y normaliza texto; la existencia de la especie en catálogo se comprueba aparte.'
};

const scenarios = [
['Objeto canónico','Expediente de un árbol patrimonial','Varias brigadas guardan altura, especie y estado en archivos distintos.','ArbolPatrimonial','registrar','arbolId: "roble-42", especie: "Quercus costaricensis"','Un único expediente conserva identidad y reglas; los mapas son derivados.'],
['Dato fechado','Medición de un río después de una tormenta','Una lectura sin tiempo válido confunde cuándo ocurrió con cuándo se transmitió.','MedicionRio','registrar','rioId: "terraba", nivelCm: 184, observadoEn: "2026-08-24T06:15:00Z"','La observación conserva tiempo observado, recibido y procedencia del sensor.'],
['Repositorio con ámbito','Observaciones privadas de una reserva','Una consulta sin reservaId puede mezclar registros de áreas protegidas diferentes.','RepositorioObservaciones','buscar','reservaId: "las-tablas", observacionId: "obs-184"','El repositorio rechaza cualquier lectura que no declare primero la reserva.'],
['Catálogo versionado','Códigos de especies usados durante diez años','El código AV-03 cambió de significado y los informes históricos quedan ambiguos.','CatalogoEspecies','resolver','codigo: "AV-03", version: "2024.2"','Cada observación se interpreta con la edición del catálogo que estaba vigente.'],
['Proyección de lectura','Panel diario de avistamientos','La pantalla recorre miles de observaciones para contar especies cada vez que abre.','PanelAvistamientos','proyectar','reservaId: "piedras-blancas", fecha: "2026-08-24"','Una vista reconstruible entrega conteos diarios sin reemplazar las observaciones.'],
['Proyección de cobertura','Ficha breve para guardaparques sin conexión','La consulta móvil descarga expedientes completos cuando solo necesita ubicación y alerta.','FichaGuardaparque','crear','senderoId: "quebrada-azul", incluir: ["riesgo", "ubicacion"]','La proyección contiene exactamente los campos que necesita la ronda de campo.'],
['Reconstrucción total','Mapa de calor de nacientes','Una nueva fórmula exige recalcular todo el mapa sin modificar mediciones originales.','ReconstruirMapaNacientes','ejecutar','cuencaId: "coto-brus", version: "v3"','Se construye una versión candidata completa, se verifica y luego se publica.'],
['Reconstrucción incremental','Conteo de visitantes por sendero','Recalcular cinco años por una entrada nueva desperdicia tiempo y energía.','ActualizarConteoSenderos','aplicar','eventoId: "paso-991", senderoId: "cotoncito"','Solo se procesa el cambio nuevo y se conserva un cursor verificable.'],
['Publicación por versión','Nueva clasificación del estado del bosque','Los lectores podrían observar una mezcla de datos viejos y nuevos durante el cálculo.','PublicadorCoberturaBosque','publicar','candidata: "cobertura-v7", esperada: "cobertura-v6"','La versión candidata se activa mediante un único cambio de referencia.'],
['Procesamiento idempotente','Sensor que reenvía la misma lectura','La mala señal hace que una medición llegue tres veces y triplique el promedio.','ProcesadorLecturas','procesar','eventoId: "sensor-17:8842", humedad: 86','La clave del evento permite repetir la operación sin duplicar efectos.'],
['Revisión obsoleta rechazada','Dos brigadas editan el mismo sendero','Una tableta sin conexión intenta guardar una descripción anterior sobre una revisión nueva.','EditorSendero','guardar','senderoId: "fila-cal", revisionEsperada: 12, dificultad: "alta"','La escritura falla con conflicto y conserva la revisión más reciente.'],
['Cola de salida transaccional','Alerta por deslizamiento junto con la medición','Guardar la alerta después de la medición puede fallar y dejar el riesgo sin notificación.','RegistroConAlerta','guardar','sensorId: "ladera-8", riesgo: "alto"','Documento y mensaje pendiente nacen juntos; un trabajador publica después.'],
['Reparación verificable','Índice de especies incompleto','Una interrupción dejó veinte observaciones fuera del índice de búsqueda.','ReparadorIndiceEspecies','reparar','reservaId: "golfo-dulce", lote: 100','La reparación compara fuente e índice, corrige diferencias y vuelve a medir.'],
['Conjunto de datos reproducible','Estudio anual de presencia de aves','El conjunto cambia cada vez que alguien corrige una observación histórica.','ConstructorDatasetAves','construir','corte: "2026-07-31", catalogo: "aves-5", semilla: 420','El manifiesto fija consulta, corte, catálogo, transformación y huellas.'],
['Característica versionada','Índice de sequedad para riesgo de incendio','Cambiar la fórmula altera predicciones sin explicar por qué.','IndiceSequedad','calcular','humedad: 31, lluvia7d: 4, formula: "is-2"','El valor viaja con la versión exacta de la fórmula que lo produjo.'],
['Recuperación limitada por ámbito','Asistente sobre una estación biológica','El asistente podría citar documentos pertenecientes a otra estación.','BuscadorEstacion','recuperar','estacionId: "las-cruces", pregunta: "¿Qué floreció esta semana?"','Filtro, búsqueda y citas conservan el mismo ámbito autorizado.'],
['Herramienta de agente gobernada','Asistente que propone cerrar un sendero','Un modelo no debe cerrar rutas por sí mismo al detectar lluvia intensa.','AgenteSenderos','proponer','senderoId: "cerro-pittier", accion: "cerrar"','La herramienta valida permiso, muestra evidencia y exige aprobación humana.'],
['Frontera lectura—escritura','Resumen público de calidad del agua','Editar el resumen directamente lo convertiría en una segunda autoridad.','ResumenCalidadAgua','consultar','cuencaId: "sixaola", mes: "2026-08"','El resumen solo se lee; toda corrección entra por la medición canónica.'],
['Índice antes que proyección','Búsqueda de viveros por cantón','El equipo quiere copiar fichas completas cuando un índice compuesto basta.','IndiceViveros','buscar','canton: "coto-brus", especie: "roble-sabana"','Se prueba primero una clave pequeña antes de mantener otra representación.'],
['Retiro de proyección','Mapa antiguo que nadie consulta','Una proyección sin usuarios continúa consumiendo almacenamiento y monitoreo.','RetirarMapaHistorico','ejecutar','proyeccion: "mapa-2019", diasSinUso: 420','Se confirma ausencia de consumidores, se conserva la fuente y se retira la copia.'],
['Identidad documental estable','La misma cámara cambia de ubicación','Usar la ubicación como identificador crea otro dispositivo al moverla.','CamaraTrampa','registrar','camaraId: "cam-0091", ubicacion: "sendero-norte"','La identidad permanece estable mientras sus atributos pueden cambiar.'],
['Validación en frontera','Formulario ciudadano de avistamientos','Coordenadas imposibles o especies desconocidas llegan hasta el almacén.','IngresoAvistamiento','aceptar','latitud: 8.79, longitud: -82.96, especie: "tucan-pico-iris"','La entrada se normaliza o rechaza antes de crear el documento.'],
['Contrato documental versionado','Aplicación móvil todavía usa el formato anterior','Cambiar nombre de campos rompe tabletas que aún no se actualizaron.','ContratoObservacion','decodificar','schemaVersion: 2, especieCodigo: "AV-12"','El lector selecciona el contrato correcto y migra de forma explícita.'],
['Lectura coherente por revisión','Informe combina mapa y estadísticas','Leer partes en momentos distintos produce un informe internamente contradictorio.','InformeReserva','cargar','reservaId: "corcovado", revision: 884','Todas las piezas declaran la misma revisión o la lectura se repite.'],
['Ventana de frescura declarada','Tablero de incendios forestales','Un tablero parece actual aunque la última proyección tenga dos horas.','TableroIncendios','consultar','region: "brunca", frescuraMaxMin: 10','El consumidor acepta, espera o rechaza según la edad declarada.'],
['Manifiesto de proyección','Mapa de corredores biológicos','Nadie recuerda con qué fuentes y filtros se produjo el mapa publicado.','ManifiestoCorredores','crear','version: "corredores-12", fuentes: ["bosque-v7", "rios-v3"]','La proyección publica receta, entradas, versión, huellas y responsable.'],
['Partición analítica sin fuga','Predicción de floración','Observaciones futuras del mismo árbol aparecen en entrenamiento y validación.','ParticionFloracion','dividir','grupo: "arbolId", corte: "2025-12-31", semilla: 73','La partición respeta grupos y tiempo antes de calcular características.'],
['Abstención con evidencia','Asistente identifica una especie en una foto borrosa','El modelo podría inventar una respuesta segura sin evidencia suficiente.','IdentificadorEspecies','responder','confianza: 0.41, minimo: 0.78, candidatos: ["tangara", "mielero"]','El asistente se abstiene, explica qué falta y conserva candidatos.'],
['Presupuesto de derivados','Cada equipo solicita su propio tablero','Diez proyecciones similares multiplican escritura, costo y mantenimiento.','PresupuestoProyecciones','evaluar','beneficioMensual: 18, costoMensual: 31, consumidores: 1','La copia solo se aprueba con propietario, beneficio y criterio de retiro.'],
['Auditoría narrativa reconstruible','Explicar por qué se cerró una reserva','Registros aislados no cuentan qué lluvia, regla y aprobación produjeron la decisión.','HistoriaCierreReserva','reconstruir','reservaId: "la-amistad", desde: "2026-08-23T18:00:00Z"','Una línea temporal enlaza eventos, revisiones, política, responsable y resultado.']
];

const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'sitio/public/catalogo.json'), 'utf8'));
const cases = JSON.parse(fs.readFileSync(path.join(root, 'replication/examples/patterns-r4/cases.json'), 'utf8'));
const typeScriptPath = 'replication/examples/patterns-r4/src/patrones.ts';
const typeScriptSource = fs.readFileSync(path.join(root, typeScriptPath), 'utf8');
const catalogById = new Map(catalog.items.map(item => [item.id, item]));
const caseById = new Map(cases.map(item => [item.id, item]));

const selectedLanguages = new Map([
  [3, {language: 'Python', source: 'replication/examples/patterns-r4/multilang/python/repositorio_ambito.py', test: 'replication/examples/patterns-r4/multilang/python/test_repositorio_ambito.py'}],
  [9, {language: 'Go', source: 'replication/examples/patterns-r4/multilang/go/publicacion.go', test: 'replication/examples/patterns-r4/multilang/go/publicacion_test.go'}],
  [10, {language: 'Java', source: 'replication/examples/patterns-r4/multilang/java/ProcesamientoIdempotente.java', test: 'replication/examples/patterns-r4/multilang/java/ProcesamientoIdempotente.java', bookMarkers: ['// @book-start', '// @book-end']}]
]);

function typeScriptExample(id) {
  const match = typeScriptSource.match(new RegExp(`// @example-start ${id}\\n([\\s\\S]*?)\\n// @example-end ${id}`));
  if (!match) throw new Error(`No existe el fragmento TypeScript del patrón ${id}`);
  return match[1].trim();
}

function contraindication(text, patternName) {
  const match = text.match(/(?:Evítelo|Evítela|No lo use|No la use)[^.?!]*(?:[.?!]|$)/i);
  return match?.[0] ?? `No adopte ${patternName} si el problema no fue observado o una alternativa más simple satisface el contrato.`;
}

const outputs = scenarios.map((scenario,index)=>{
  const [nombre,escena,problemaConcreto,clase,,,resultado]=scenario;
  const id=index+1;
  const item = catalogById.get(id);
  const testCase = caseById.get(id);
  if (!item || !testCase) throw new Error(`Faltan metadatos o pruebas para el patrón ${id}`);
  const code = {TypeScript: typeScriptExample(id)};
  const languagesVerified = [{language: 'TypeScript', source: typeScriptPath, test: 'replication/examples/patterns-r4/test/patrones.test.ts'}];
  const selected = selectedLanguages.get(id);
  if (selected) {
    let selectedSource = fs.readFileSync(path.join(root, selected.source), 'utf8').trim();
    if (selected.bookMarkers) {
      const [start, end] = selected.bookMarkers;
      selectedSource = selectedSource.split(start)[1]?.split(end)[0]?.trim();
      if (!selectedSource) throw new Error(`No se pudieron extraer las marcas editoriales de ${selected.source}`);
    }
    code[selected.language] = selectedSource;
    languagesVerified.push(selected);
  }
  return {
    id,
    nombre,
    escena,
    problema: problemaConcreto,
    problemaIngenuo: item.problema,
    solucion: item.solucion,
    contrato: item.contrato,
    participantes:[clase,'Contrato de entrada','Repositorio documental','Evidencia'],
    resultado: resultadosLocales[id] ?? resultado,
    costo: item.metricas,
    cuandoNoUsar: contraindication(item.aplicacion, nombre),
    pruebaPositiva: {entrada: testCase.valid, esperado: testCase.expected},
    pruebaNegativa: {entrada: testCase.invalid, codigoError: testCase.errorCode, esperado: testCase.negativeExpected},
    code,
    languagesVerified
  };
});

const json=JSON.stringify(outputs,null,2)+'\n';
fs.writeFileSync(path.join(import.meta.dirname,'practical-examples.json'),json);
fs.writeFileSync(path.join(root,'sitio/public/practical-examples.json'),json);
console.log(`Ejemplos prácticos generados: ${outputs.length}`);
