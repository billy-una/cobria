export class ReconstruirResumen {
  constructor({ repositorio, proyecciones, autorizar }) {
    this.repositorio = repositorio;
    this.proyecciones = proyecciones;
    this.autorizar = autorizar;
  }

  async ejecutar(ambito, contexto) {
    this.autorizar(contexto, 'observaciones:leer', ambito);
    const canonicos = await this.repositorio.listar(ambito);
    const conteos = Object.fromEntries(
      [...new Set(canonicos.map((item) => item.especie))]
        .sort()
        .map((especie) => [especie, canonicos.filter((item) => item.especie === especie)
          .reduce((total, item) => total + item.cantidad, 0)])
    );
    const candidata = { ambito, version: 1, conteos };
    const verificada = Object.values(conteos).every((valor) => Number.isInteger(valor) && valor > 0);
    if (!verificada) throw new ErrorCobria('PROJECTION_VERIFICATION_FAILED', 'La proyección candidata no superó la verificación');
    await this.proyecciones.publicar(ambito, candidata);
    return candidata;
  }
}
import { ErrorCobria } from '../domain/error-cobria.mjs';
