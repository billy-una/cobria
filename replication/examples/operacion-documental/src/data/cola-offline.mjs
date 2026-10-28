const segmentos = ruta => {
  if (typeof ruta !== 'string') throw new Error('RUTA_INVALIDA');
  const partes = ruta.replace(/^\/+|\/+$/g, '').split('/');
  if (partes.some(parte => !parte || !/^[a-zA-Z0-9_-]+$/.test(parte))) throw new Error('RUTA_INVALIDA');
  return partes;
};

// Solo borradores locales no autoritativos. Una sincronización posterior debe autorizarse.
export class ColaBorradores {
  constructor({ maxItems = 10, ttlMs = 60000, reloj = Date.now } = {}) {
    if (!Number.isInteger(maxItems) || maxItems < 1 || !Number.isFinite(ttlMs) || ttlMs < 1) {
      throw new Error('LIMITES_INVALIDOS');
    }
    this.maxItems = maxItems;
    this.ttlMs = ttlMs;
    this.reloj = reloj;
    this.items = [];
  }

  encolarLote(cambios) {
    if (!Array.isArray(cambios) || cambios.length === 0) throw new Error('LOTE_INVALIDO');
    // Primero comprobar todas las rutas; después mutar. Nunca encolar media operación.
    for (const cambio of cambios) {
      if (segmentos(cambio?.ruta)[0] !== 'borradores') throw new Error('REQUIERE_ONLINE');
      if (!Object.hasOwn(cambio, 'valor')) throw new Error('VALOR_REQUERIDO');
    }
    if (this.items.length + cambios.length > this.maxItems) throw new Error('COLA_LLENA');
    const lote = structuredClone(cambios).map(cambio => ({ ...cambio, vence: this.reloj() + this.ttlMs }));
    this.items.push(...lote);
    return lote.length;
  }

  clasificar() {
    const ahora = this.reloj();
    return {
      pendientes: structuredClone(this.items.filter(item => item.vence > ahora)),
      vencidos: structuredClone(this.items.filter(item => item.vence <= ahora))
    };
  }
}
