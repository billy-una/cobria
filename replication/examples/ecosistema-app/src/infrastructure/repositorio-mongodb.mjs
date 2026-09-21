/** Adaptador MongoDB. Recibe colecciones inyectadas para mantener el dominio independiente del controlador. */
export class RepositorioMongoDB {
  constructor(documentos, operaciones) {
    this.documentos = documentos;
    this.operaciones = operaciones;
  }

  async guardar(documento) {
    const filtro = { ambito: documento.ambito, id: documento.id };
    const actual = await this.documentos.findOne(filtro);
    if (actual && documento.revision <= actual.revision) throw new ErrorCobria('STALE_REVISION', 'Revisión obsoleta');
    await this.documentos.replaceOne(filtro, { ...documento }, { upsert: true });
  }

  async listar(ambito) { return this.documentos.find({ ambito }).toArray(); }

  async buscarOperacion(ambito, clave) {
    return this.operaciones.findOne({ ambito, clave });
  }

  async registrarOperacion(ambito, clave, firma, resultado) {
    await this.operaciones.updateOne(
      { ambito, clave },
      { $setOnInsert: { ambito, clave, firma, resultado } },
      { upsert: true },
    );
  }
}
import { ErrorCobria } from '../domain/error-cobria.mjs';
