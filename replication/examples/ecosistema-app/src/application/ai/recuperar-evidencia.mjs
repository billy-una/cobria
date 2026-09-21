import { ErrorCobria } from '../../domain/error-cobria.mjs';

const tokens = text => new Set(String(text).toLocaleLowerCase('es').normalize('NFD').replace(/\p{Diacritic}/gu, '').split(/\W+/u).filter(Boolean));
const similarity = (query, text) => {
  const expected = tokens(query); const actual = tokens(text);
  return [...expected].filter(token => actual.has(token)).length / Math.max(expected.size, 1);
};

export class RecuperarEvidencia {
  constructor({ repositorio, autorizar, umbral = 0.5 }) {
    this.repositorio = repositorio;
    this.autorizar = autorizar;
    this.umbral = umbral;
  }

  async ejecutar({ consulta, ambito }, contexto) {
    this.autorizar(contexto, 'observaciones:leer', ambito);
    if (!consulta?.trim()) throw new ErrorCobria('AI_QUERY_REQUIRED', 'La consulta de evidencia es obligatoria');
    const autorizados = await this.repositorio.listar(ambito);
    const citas = autorizados
      .map(item => ({ id: item.id, revision: item.revision, ambito: item.ambito, puntuacion: similarity(consulta, `${item.especie} ${item.cantidad}`) }))
      .filter(item => item.puntuacion >= this.umbral)
      .sort((a, b) => b.puntuacion - a.puntuacion || a.id.localeCompare(b.id));
    if (!citas.length) return Object.freeze({ estado: 'abstencion', causa: 'EVIDENCIA_INSUFICIENTE', citas: [], autoridadEscritura: false });
    return Object.freeze({ estado: 'evidencia-encontrada', citas, autoridadEscritura: false });
  }
}
