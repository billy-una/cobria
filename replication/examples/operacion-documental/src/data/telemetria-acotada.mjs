const METRICAS = new Set(['lectura-observaciones', 'registrar-observacion', 'carga-mapa']);

export class TelemetriaAcotada {
  constructor({ maxItems = 10 } = {}) {
    if (!Number.isInteger(maxItems) || maxItems < 1) throw new Error('LIMITE_INVALIDO');
    this.maxItems = maxItems;
    this.items = [];
    this.descartadas = 0;
  }
  registrar({ metrica, duracionMs, ok }) {
    if (!METRICAS.has(metrica) || !Number.isFinite(duracionMs) || duracionMs < 0 || typeof ok !== 'boolean') {
      this.descartadas++;
      return false;
    }
    if (this.items.length >= this.maxItems) this.items.shift();
    // Campos permitidos explícitos: nunca copiar el objeto de entrada completo.
    this.items.push({ metrica, duracionMs: Math.min(duracionMs, 120000), ok });
    return true;
  }
}
