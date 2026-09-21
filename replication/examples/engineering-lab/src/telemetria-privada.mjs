const allowed = new Set(['operation','durationMs','outcome','sampledAt']);
export class TelemetriaPrivada {
  constructor({capacity = 20, transport = async () => {}} = {}) { this.capacity = capacity; this.transport = transport; this.queue = []; }
  record(sample) {
    const clean = Object.fromEntries(Object.entries(sample).filter(([key]) => allowed.has(key)));
    this.queue.push(clean);
    if (this.queue.length > this.capacity) this.queue.shift();
  }
  async flush() {
    const batch = this.queue.splice(0);
    try { await this.transport(batch); return true; }
    catch { this.queue = [...batch, ...this.queue].slice(-this.capacity); return false; }
  }
}
