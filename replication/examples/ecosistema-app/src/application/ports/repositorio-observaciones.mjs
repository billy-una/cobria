/**
 * Puerto documental de la aplicación.
 * @typedef {object} RepositorioObservaciones
 * @property {(documento: object) => Promise<void>} guardar
 * @property {(ambito: string) => Promise<object[]>} listar
 * @property {(ambito: string, clave: string) => Promise<object|null>} buscarOperacion
 * @property {(ambito: string, clave: string, firma: string, resultado: object) => Promise<void>} registrarOperacion
 */

export const REPOSITORIO_OBSERVACIONES = Symbol('RepositorioObservaciones');
