import { ErrorCobria } from './error-cobria.mjs';

export class Observacion {
  constructor({ id, ambito, especie, cantidad, revision = 1, observadaEn }) {
    if (!id?.trim()) throw new ErrorCobria('OBS_ID_REQUIRED', 'El identificador es obligatorio');
    if (!ambito?.trim()) throw new ErrorCobria('OBS_SCOPE_REQUIRED', 'El ámbito es obligatorio');
    if (!especie?.trim()) throw new ErrorCobria('OBS_SPECIES_REQUIRED', 'La especie es obligatoria');
    if (!Number.isInteger(cantidad) || cantidad < 1) throw new ErrorCobria('OBS_QUANTITY_INVALID', 'La cantidad debe ser positiva');
    if (!Number.isInteger(revision) || revision < 1) throw new ErrorCobria('OBS_REVISION_INVALID', 'La revisión debe ser positiva');

    const instante = new Date(observadaEn);
    if (Number.isNaN(instante.getTime())) throw new ErrorCobria('OBS_DATE_INVALID', 'La fecha de observación no es válida');

    this.id = id;
    this.ambito = ambito;
    this.especie = especie;
    this.cantidad = cantidad;
    this.revision = revision;
    this.observadaEn = instante.toISOString();
    Object.freeze(this);
  }
}
