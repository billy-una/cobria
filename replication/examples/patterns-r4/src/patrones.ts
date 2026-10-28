export type Entrada = Record<string, unknown>;
export type Resultado = Record<string, unknown>;
export type Implementacion = (entrada: Entrada) => Resultado;

export class ErrorPatron extends Error {
  constructor(public readonly codigo: string, mensaje: string) {
    super(mensaje);
  }
}

function exigir(condicion: unknown, codigo: string, mensaje: string): asserts condicion {
  if (!condicion) throw new ErrorPatron(codigo, mensaje);
}

function tiene(valor: unknown, campo: string): boolean {
  return valor !== null && typeof valor === 'object' && !Array.isArray(valor) && Object.hasOwn(valor, campo);
}

function texto(entrada: Entrada, campo: string): string {
  const valor = tiene(entrada, campo) ? entrada[campo] : undefined;
  exigir(typeof valor === "string" && valor.trim().length > 0, `${campo.toUpperCase()}_REQUIRED`, `${campo} es obligatorio`);
  return valor;
}

function numero(entrada: Entrada, campo: string): number {
  const valor = tiene(entrada, campo) ? entrada[campo] : undefined;
  exigir(typeof valor === "number" && Number.isFinite(valor), `${campo.toUpperCase()}_INVALID`, `${campo} debe ser numérico`);
  return valor;
}

function lista(entrada: Entrada, campo: string): unknown[] {
  const valor = tiene(entrada, campo) ? entrada[campo] : undefined;
  exigir(Array.isArray(valor) && valor.length > 0, `${campo.toUpperCase()}_REQUIRED`, `${campo} debe contener elementos`);
  return valor;
}

function fechaIso(valor: string): number {
  const instante = Date.parse(valor);
  const normalizado = valor.replace(/Z$/, '.000Z');
  exigir(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(valor) &&
    Number.isFinite(instante) && new Date(instante).toISOString() === (valor.includes('.') ? valor : normalizado),
    'TIME_INVALID', 'Se requiere una fecha UTC ISO-8601 real');
  return instante;
}

// @example-start 1
export function objetoCanonico(entrada: Entrada): Resultado {
  const id = texto(entrada, "id");
  const ambito = texto(entrada, "ambito");
  const revision = numero(entrada, "revision");
  exigir(Number.isSafeInteger(revision) && revision > 0, "REVISION_INVALID", "La revisión debe ser positiva y segura");
  return Object.freeze({ id, ambito, revision, especie: texto(entrada, "especie"), autoridad: "canonica" });
}
// @example-end 1

// @example-start 2
export function datoFechado(entrada: Entrada): Resultado {
  const observadoEn = fechaIso(texto(entrada, "observadoEn"));
  const conocidoEn = fechaIso(texto(entrada, "conocidoEn"));
  exigir(Number.isFinite(observadoEn) && Number.isFinite(conocidoEn), "TIME_INVALID", "Los tiempos deben ser ISO-8601");
  exigir(observadoEn <= conocidoEn, "TIME_ORDER_INVALID", "No puede conocerse antes de observarse");
  return { observadoEn: new Date(observadoEn).toISOString(), conocidoEn: new Date(conocidoEn).toISOString(), procedencia: texto(entrada, "procedencia") };
}
// @example-end 2

// @example-start 3
export function repositorioConAmbito(entrada: Entrada): Resultado {
  const ambitoSolicitado = texto(entrada, "ambitoSolicitado");
  const documento = entrada.documento as Entrada | undefined;
  exigir(documento && tiene(documento, 'ambito') && documento.ambito === ambitoSolicitado, "SCOPE_DENIED", "El documento no pertenece al ámbito autorizado");
  return { documento: { ...documento }, acceso: "permitido" };
}
// @example-end 3

// @example-start 4
export function catalogoVersionado(entrada: Entrada): Resultado {
  const clave = texto(entrada, "clave");
  const version = texto(entrada, "version");
  const catalogos = entrada.catalogos as Record<string, Record<string, string>> | undefined;
  const edicion = catalogos && tiene(catalogos, version) ? catalogos[version] : undefined;
  const significado = edicion && tiene(edicion, clave) ? edicion[clave] : undefined;
  exigir(typeof significado === 'string' && significado.trim(), "CATALOG_VALUE_UNKNOWN", "La clave no existe en la versión solicitada");
  return { clave, version, significado };
}
// @example-end 4

// @example-start 5
export function proyeccionLectura(entrada: Entrada): Resultado {
  const ambito = texto(entrada, "ambito");
  const observaciones = lista(entrada, "observaciones") as Entrada[];
  const conteos = new Map<string, number>();
  for (const item of observaciones.filter((item) => tiene(item, 'ambito') && item.ambito === ambito)) {
    const especie = texto(item, "especie");
    const cantidad = numero(item, 'cantidad');
    exigir(Number.isSafeInteger(cantidad) && cantidad > 0, 'QUANTITY_INVALID', 'La cantidad debe ser un entero positivo seguro');
    const total = (conteos.get(especie) ?? 0) + cantidad;
    exigir(Number.isSafeInteger(total), 'QUANTITY_INVALID', 'El total excede el entero seguro');
    conteos.set(especie, total);
  }
  exigir(conteos.size > 0, "PROJECTION_EMPTY", "No hay fuentes autorizadas para proyectar");
  return { ambito, conteos: Object.fromEntries(conteos), autoridadEscritura: false };
}
// @example-end 5

// @example-start 6
export function proyeccionCobertura(entrada: Entrada): Resultado {
  const documento = entrada.documento as Entrada | undefined;
  const campos = lista(entrada, "campos") as string[];
  exigir(documento, "DOCUMENT_REQUIRED", "Falta el documento fuente");
  const salida = Object.fromEntries(campos.filter((campo) => typeof campo === 'string' && tiene(documento, campo)).map((campo) => [campo, documento[campo]]));
  exigir(Object.keys(salida).length === campos.length, "FIELD_NOT_COVERED", "La fuente no cubre todos los campos");
  return { ...salida, autoridadEscritura: false };
}
// @example-end 6

// @example-start 7
export function reconstruccionTotal(entrada: Entrada): Resultado {
  const fuentes = lista(entrada, "fuentes") as Entrada[];
  const version = texto(entrada, "version");
  const cantidades = fuentes.map(item => numero(item, 'cantidad'));
  exigir(cantidades.every(n => Number.isSafeInteger(n) && n > 0), 'REBUILD_INVALID', 'Cantidades positivas y seguras requeridas');
  const total = cantidades.reduce((suma, cantidad) => suma + cantidad, 0);
  exigir(Number.isSafeInteger(total), 'REBUILD_INVALID', 'El total excede el entero seguro');
  return { estado: 'candidata-calculada', equivalenciaVerificada: false, version, total, fuentes: fuentes.length };
}
// @example-end 7

// @example-start 8
export function reconstruccionIncremental(entrada: Entrada): Resultado {
  const cursor = numero(entrada, "cursor");
  const cambios = lista(entrada, "cambios") as Entrada[];
  const nuevos = cambios.filter((cambio) => numero(cambio, "revision") > cursor);
  exigir(nuevos.length > 0, "NO_NEW_REVISIONS", "No hay revisiones posteriores al cursor");
  return { procesadas: nuevos.map((cambio) => cambio.id), cursor: Math.max(...nuevos.map((cambio) => numero(cambio, "revision"))) };
}
// @example-end 8

// @example-start 9
export function publicacionPorVersion(entrada: Entrada): Resultado {
  const activa = texto(entrada, "activa");
  const candidata = texto(entrada, "candidata");
  exigir(entrada.verificada === true, "CANDIDATE_NOT_VERIFIED", "Solo una candidata verificada puede publicarse");
  exigir(activa !== candidata, "VERSION_ALREADY_ACTIVE", "La candidata ya está activa");
  // Es una propuesta en memoria; el llamador todavía debe persistirla atómicamente.
  return { activaPropuesta: candidata, anterior: activa, rollbackPropuesto: activa, persistida: false };
}
// @example-end 9

// @example-start 10
export function procesamientoIdempotente(entrada: Entrada): Resultado {
  const eventoId = texto(entrada, "eventoId");
  const procesados = entrada.procesados as Record<string, string> | undefined;
  exigir(procesados, "IDEMPOTENCY_STORE_REQUIRED", "Falta el registro idempotente");
  let huella;
  try { huella = JSON.stringify(entrada.payload); }
  catch { throw new ErrorPatron('PAYLOAD_INVALID', 'El payload no es JSON serializable'); }
  exigir(typeof huella === 'string', 'PAYLOAD_INVALID', 'Se requiere un payload JSON serializable');
  const existe = tiene(procesados, eventoId);
  exigir(!existe || procesados[eventoId] === huella, "IDEMPOTENCY_CONFLICT", "La clave ya protege otra entrada");
  const repetido = existe && procesados[eventoId] === huella;
  Object.defineProperty(procesados, eventoId, {value: huella, enumerable: true, writable: true, configurable: true});
  return { eventoId, aplicado: !repetido, repetido };
}
// @example-end 10

// @example-start 11
export function revisionObsoletaRechazada(entrada: Entrada): Resultado {
  const actual = numero(entrada, "revisionActual");
  const esperada = numero(entrada, "revisionEsperada");
  exigir(Number.isSafeInteger(actual) && actual > 0 && actual < Number.MAX_SAFE_INTEGER && Number.isSafeInteger(esperada) && esperada > 0, 'REVISION_INVALID', 'Revisiones positivas sin desbordamiento');
  exigir(actual === esperada, "STALE_REVISION", "La revisión esperada ya no es vigente");
  return { revision: actual + 1, cambio: entrada.cambio };
}
// @example-end 11

// @example-start 12
export function colaSalidaTransaccional(entrada: Entrada): Resultado {
  const documentoId = texto(entrada, "documentoId");
  const eventoId = texto(entrada, "eventoId");
  exigir(entrada.mismaTransaccion === true, "OUTBOX_NOT_ATOMIC", "Documento y evento deben persistirse juntos");
  return { documentoId, outbox: { eventoId, estado: "pendiente" }, planCommit: "unico", persistido: false };
}
// @example-end 12

// @example-start 13
export function reparacionVerificable(entrada: Entrada): Resultado {
  const fuente = lista(entrada, "fuente").map(String);
  const indice = lista(entrada, "indice").map(String);
  const faltantes = fuente.filter((id) => !indice.includes(id));
  exigir(faltantes.length > 0, "NO_DIFFERENCE", "No existe una diferencia que reparar");
  return { reparados: faltantes, equivalente: JSON.stringify([...new Set([...indice, ...faltantes])].sort()) === JSON.stringify([...new Set(fuente)].sort()) };
}
// @example-end 13

// @example-start 14
export function conjuntoReproducible(entrada: Entrada): Resultado {
  const fuentes = lista(entrada, "fuentes").map(String).sort();
  const corte = texto(entrada, "corte");
  const semilla = numero(entrada, "semilla");
  try { fechaIso(corte); } catch { throw new ErrorPatron('CUT_INVALID', 'El corte temporal no es válido'); }
  return { manifiesto: { fuentes, corte, semilla, transformacion: texto(entrada, "transformacion") }, autoridadEscritura: false };
}
// @example-end 14

// @example-start 15
export function caracteristicaVersionada(entrada: Entrada): Resultado {
  const humedad = numero(entrada, "humedad");
  const lluvia7d = numero(entrada, "lluvia7d");
  const formula = texto(entrada, "formula");
  exigir(formula === "is-2", "FEATURE_VERSION_UNKNOWN", "La fórmula no está registrada");
  return { valor: Math.max(0, 100 - humedad - lluvia7d * 2), formula };
}
// @example-end 15

// @example-start 16
export function recuperacionLimitada(entrada: Entrada): Resultado {
  const ambito = texto(entrada, "ambito");
  const corpus = lista(entrada, "corpus") as Entrada[];
  const citas = corpus.filter((item) => tiene(item, 'ambito') && item.ambito === ambito).map((item) => ({ id: texto(item, 'id'), revision: numero(item, 'revision') }));
  exigir(citas.length > 0, "EVIDENCE_INSUFFICIENT", "No existe evidencia autorizada");
  return { citas, ambito, autoridadEscritura: false };
}
// @example-end 16

// @example-start 17
export function herramientaAgenteGobernada(entrada: Entrada): Resultado {
  const accion = texto(entrada, "accion");
  exigir(Array.isArray(entrada.capacidades) && entrada.capacidades.includes(`proponer:${accion}`), "CAPABILITY_DENIED", "La herramienta no posee la capacidad");
  exigir(entrada.evidencia && entrada.aprobacionHumana === true, "HUMAN_APPROVAL_REQUIRED", "Falta evidencia o aprobación humana");
  return { accion, estado: "propuesta-validada", aprobacionDeclarada: true, ejecutadaPorModelo: false };
}
// @example-end 17

// @example-start 18
export function fronteraLecturaEscritura(entrada: Entrada): Resultado {
  exigir(entrada.operacion === "leer", "DERIVED_WRITE_FORBIDDEN", "Un resumen derivado no acepta escrituras");
  return { resumen: entrada.resumen, autoridadEscritura: false };
}
// @example-end 18

// @example-start 19
export function indiceAntesQueProyeccion(entrada: Entrada): Resultado {
  const ahorroIndice = numero(entrada, "ahorroIndice");
  const ahorroProyeccion = numero(entrada, "ahorroProyeccion");
  const costoProyeccion = numero(entrada, "costoProyeccion");
  exigir(ahorroIndice >= 0 && ahorroProyeccion >= 0 && costoProyeccion >= 0, "MEASUREMENTS_INVALID", "Las mediciones no pueden ser negativas");
  return { decision: ahorroIndice >= ahorroProyeccion - costoProyeccion ? "indice" : "proyeccion" };
}
// @example-end 19

// @example-start 20
export function retiroProyeccion(entrada: Entrada): Resultado {
  const consumidores = numero(entrada, "consumidores");
  exigir(consumidores === 0, "PROJECTION_IN_USE", "La proyección conserva consumidores");
  exigir(entrada.fuenteDisponible === true, "SOURCE_REQUIRED", "La fuente debe conservarse antes del retiro");
  return { estado: "retiro-propuesto", fuenteDeclarada: true, persistido: false };
}
// @example-end 20

// @example-start 21
export function identidadEstable(entrada: Entrada): Resultado {
  const camaraId = texto(entrada, "camaraId");
  const ubicacionAnterior = texto(entrada, "ubicacionAnterior");
  const ubicacionNueva = texto(entrada, "ubicacionNueva");
  exigir(ubicacionAnterior !== ubicacionNueva, "NO_IDENTITY_CHANGE", "La prueba requiere un cambio de ubicación");
  return { camaraId, ubicacion: ubicacionNueva, identidadCambio: false };
}
// @example-end 21

// @example-start 22
export function validacionFrontera(entrada: Entrada): Resultado {
  const latitud = numero(entrada, "latitud");
  const longitud = numero(entrada, "longitud");
  exigir(latitud >= -90 && latitud <= 90 && longitud >= -180 && longitud <= 180, "COORDINATES_INVALID", "Las coordenadas están fuera de rango");
  return { latitud, longitud, especie: texto(entrada, "especie").toLowerCase(), validada: true };
}
// @example-end 22

// @example-start 23
export function contratoVersionado(entrada: Entrada): Resultado {
  const version = numero(entrada, "versionEsquema");
  if (version === 1) return { versionEsquema: 2, especieCodigo: texto(entrada, "codigoEspecie") };
  if (version === 2) return { versionEsquema: 2, especieCodigo: texto(entrada, "especieCodigo") };
  throw new ErrorPatron("SCHEMA_VERSION_UNSUPPORTED", "La versión documental no está soportada");
}
// @example-end 23

// @example-start 24
export function lecturaCoherente(entrada: Entrada): Resultado {
  const partes = lista(entrada, "partes") as Entrada[];
  const revisiones = new Set(partes.map((parte) => numero(parte, "revision")));
  exigir(revisiones.size === 1, "MIXED_REVISIONS", "Las piezas no pertenecen a la misma revisión");
  return { revision: [...revisiones][0], partes: partes.map((parte) => parte.nombre) };
}
// @example-end 24

// @example-start 25
export function ventanaFrescura(entrada: Entrada): Resultado {
  const generadoEn = fechaIso(texto(entrada, "generadoEn"));
  const consultadoEn = fechaIso(texto(entrada, "consultadoEn"));
  const maxMin = numero(entrada, "frescuraMaxMin");
  const edadMin = (consultadoEn - generadoEn) / 60_000;
  exigir(edadMin >= 0 && edadMin <= maxMin, "FRESHNESS_EXCEEDED", "La proyección excedió su ventana de frescura");
  return { edadMin, vigente: true };
}
// @example-end 25

// @example-start 26
export function manifiestoProyeccion(entrada: Entrada): Resultado {
  const fuentes = lista(entrada, "fuentes").map(String);
  const huellas = entrada.huellas as Record<string, string> | undefined;
  exigir(huellas && fuentes.every((fuente) => tiene(huellas, fuente) && /^[a-f0-9]{64}$/.test(huellas[fuente] ?? "")), "PROVENANCE_INCOMPLETE", "Cada fuente requiere una huella SHA-256");
  return { version: texto(entrada, "version"), fuentes, huellas, responsable: texto(entrada, "responsable") };
}
// @example-end 26

// @example-start 27
export function particionSinFuga(entrada: Entrada): Resultado {
  const entrenamiento = lista(entrada, "entrenamiento") as Entrada[];
  const evaluacion = lista(entrada, "evaluacion") as Entrada[];
  const trainIds = new Set(entrenamiento.map((item) => texto(item, "entidadId")));
  exigir(evaluacion.every((item) => !trainIds.has(texto(item, "entidadId"))), "ANALYTICS_ENTITY_LEAKAGE", "Una entidad cruza particiones");
  return { entrenamiento: entrenamiento.length, evaluacion: evaluacion.length, fuga: false };
}
// @example-end 27

// @example-start 28
export function abstencionConEvidencia(entrada: Entrada): Resultado {
  const confianza = numero(entrada, "confianza");
  const minimo = numero(entrada, "minimo");
  exigir(confianza >= 0 && confianza <= 1 && minimo >= 0 && minimo <= 1, 'CONFIDENCE_INVALID', 'Confianza y mínimo deben estar entre cero y uno');
  const candidatos = lista(entrada, "candidatos").map(String);
  return confianza < minimo
    ? { estado: "abstencion", causa: "EVIDENCIA_INSUFICIENTE", candidatos }
    : { estado: "respuesta", especie: candidatos[0], confianza };
}
// @example-end 28

// @example-start 29
export function presupuestoDerivados(entrada: Entrada): Resultado {
  const beneficio = numero(entrada, "beneficioMensual");
  const costo = numero(entrada, "costoMensual");
  const consumidores = numero(entrada, "consumidores");
  exigir(beneficio >= 0 && costo >= 0 && Number.isSafeInteger(consumidores), 'MEASUREMENTS_INVALID', 'Costos no negativos y consumidores enteros');
  exigir(consumidores > 0, "OWNER_OR_CONSUMER_REQUIRED", "Un derivado sin consumidores no se justifica");
  return { decision: beneficio > costo ? "aprobar" : "rechazar", margen: beneficio - costo };
}
// @example-end 29

// @example-start 30
export function auditoriaNarrativa(entrada: Entrada): Resultado {
  const eventos = lista(entrada, "eventos") as Entrada[];
  try {
    for (const evento of eventos) {
      fechaIso(texto(evento, 'ocurridoEn')); texto(evento, 'responsable'); texto(evento, 'accion');
      exigir(Number.isSafeInteger(numero(evento, 'revision')) && Number(evento.revision) > 0, 'AUDIT_EVENT_INCOMPLETE', 'Revisión inválida');
    }
  } catch { throw new ErrorPatron('AUDIT_EVENT_INCOMPLETE', 'Fecha, revisión, responsable y acción propios requeridos'); }
  const ordenados = [...eventos].sort((a, b) => Date.parse(texto(a, "ocurridoEn")) - Date.parse(texto(b, "ocurridoEn")));
  exigir(ordenados.every((evento) => evento.revision !== undefined && evento.responsable), "AUDIT_EVENT_INCOMPLETE", "Un evento no explica revisión y responsable");
  return { historia: ordenados.map((evento) => `${evento.ocurridoEn}: ${evento.accion}`), completa: true };
}
// @example-end 30

export const implementaciones: Record<number, Implementacion> = {
  1: objetoCanonico, 2: datoFechado, 3: repositorioConAmbito, 4: catalogoVersionado,
  5: proyeccionLectura, 6: proyeccionCobertura, 7: reconstruccionTotal,
  8: reconstruccionIncremental, 9: publicacionPorVersion, 10: procesamientoIdempotente,
  11: revisionObsoletaRechazada, 12: colaSalidaTransaccional, 13: reparacionVerificable,
  14: conjuntoReproducible, 15: caracteristicaVersionada, 16: recuperacionLimitada,
  17: herramientaAgenteGobernada, 18: fronteraLecturaEscritura, 19: indiceAntesQueProyeccion,
  20: retiroProyeccion, 21: identidadEstable, 22: validacionFrontera,
  23: contratoVersionado, 24: lecturaCoherente, 25: ventanaFrescura,
  26: manifiestoProyeccion, 27: particionSinFuga, 28: abstencionConEvidencia,
  29: presupuestoDerivados, 30: auditoriaNarrativa,
};

export function ejecutarPatron(id: number, entrada: Entrada): Resultado {
  if (!Number.isInteger(id) || !Object.hasOwn(implementaciones, id)) throw new ErrorPatron('PATTERN_UNKNOWN', 'Identificador de patrón desconocido');
  exigir(entrada !== null && typeof entrada === 'object' && !Array.isArray(entrada), 'INPUT_INVALID', 'Se requiere un objeto de entrada');
  const implementar = implementaciones[id];
  if (!implementar) throw new ErrorPatron("PATTERN_UNKNOWN", `Patrón desconocido: ${id}`);
  return implementar({ ...entrada });
}
