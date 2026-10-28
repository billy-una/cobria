import catalogos from '../../../data/catalogos-especies.json' with { type: 'json' };
import { ObservacionDater } from './observacion-dater.mjs';
import { ErrorCobria } from '../../domain/error-cobria.mjs';

const dater = new ObservacionDater();
const fallar = (codigo, mensaje) => { throw new ErrorCobria(codigo, mensaje); };

function formatoUno(documento) {
  const { h: edicion, ...base } = documento;
  // La edición se conserva en el sobre versionado, no se introduce en el dominio.
  void edicion;
  return { ...base, d: 1 };
}

export function resolverEspecie(codigo, version) {
  const edicion = catalogos.editions.find(item => item.version === version);
  if (!edicion) fallar('CAT_VERSION_UNKNOWN', 'La edición del catálogo no está disponible');
  const valor = edicion.values.find(item => item.code === codigo);
  if (!valor) fallar('CAT_CODE_UNKNOWN', 'El código no pertenece a esa edición');
  return Object.freeze({ codigo: valor.code, etiqueta: valor.label, version });
}

// El formato v1 sigue siendo el del Dater original. v2 añade h en esta frontera.
// No se adivina la edición histórica: el responsable debe proporcionarla.
export function migrarObservacion(documento, versionCatalogo) {
  if (!documento || ![1, 2].includes(documento.d)) {
    fallar('PHYSICAL_VERSION_UNSUPPORTED', 'Formato físico no compatible');
  }
  const claves = documento.d === 1 ? ['a','b','c','d','e','f','g'] : ['a','b','c','d','e','f','g','h'];
  if (Object.keys(documento).length !== claves.length || claves.some(clave => !Object.hasOwn(documento, clave) || documento[clave] === undefined || documento[clave] === null)) {
    fallar('DATA_FIELDS_INVALID', 'Campos ausentes, nulos o desconocidos; no se descartan en silencio');
  }
  if (!versionCatalogo) fallar('CAT_VERSION_REQUIRED', 'Declare la edición con la que se interpretó la observación');
  if (documento.d === 2 && documento.h !== versionCatalogo) {
    fallar('CAT_VERSION_CONFLICT', 'Una migración de formato no reclasifica observaciones');
  }
  const observacion = dater.desdeFisico(formatoUno(documento));
  resolverEspecie(observacion.especie, versionCatalogo);
  return { ...dater.haciaFisico(observacion), d: 2, h: versionCatalogo };
}

export function leerObservacionVersionada(documento) {
  const fisico = migrarObservacion(documento, documento?.h);
  return Object.freeze({
    observacion: dater.desdeFisico(formatoUno(fisico)),
    catalogoVersion: fisico.h,
    clasificacion: resolverEspecie(fisico.f, fisico.h)
  });
}

// Referencia funcional, NO adaptador de motor. Escanea N documentos, filtra ámbito
// y especie antes de ordenar M candidatos. No crea un índice ni aplica autorización.
export function consultarObservaciones(documentos, { ambito, especie, limite = 10 }) {
  if (typeof ambito !== 'string' || !ambito.trim()) fallar('DATA_SCOPE_REQUIRED', 'El ámbito es obligatorio');
  if (typeof especie !== 'string' || !especie.trim()) fallar('DATA_SPECIES_REQUIRED', 'La especie es obligatoria');
  if (!Number.isInteger(limite) || limite < 1 || limite > 100) fallar('DATA_LIMIT_INVALID', 'Use un límite entre 1 y 100');
  return documentos.filter(item => item.b === ambito && item.f === especie)
    .map(leerObservacionVersionada)
    .sort((izquierda, derecha) => {
      const x = izquierda.observacion, y = derecha.observacion;
      const comparar = (a, b) => a < b ? -1 : a > b ? 1 : 0;
      return comparar(y.observadaEn, x.observadaEn) || comparar(x.id, y.id);
    }).slice(0, limite);
}
