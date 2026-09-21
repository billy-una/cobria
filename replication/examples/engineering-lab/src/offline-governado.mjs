export class PoliticaOffline {
  constructor({onlineOnly = []} = {}) { this.onlineOnly = new Set(onlineOnly); }
  classify(operation) { return this.onlineOnly.has(operation) ? 'online-only' : 'offline-safe'; }
  preflight(operations) {
    const blocked = operations.find(item => this.classify(item.type) === 'online-only');
    if (blocked) throw Object.assign(new Error('El lote requiere conexión'), {code: 'ONLINE_REQUIRED', operation: blocked.type});
  }
}

export class ColaOffline {
  constructor({capacity = 100, ttlMs = 86_400_000, maxAttempts = 5, now = Date.now} = {}) {
    Object.assign(this, {capacity, ttlMs, maxAttempts, now}); this.items = []; this.dead = [];
  }
  enqueue(item) {
    if (this.items.length >= this.capacity) throw Object.assign(new Error('Cola llena'), {code: 'QUEUE_FULL'});
    this.items.push({...item, createdAt: this.now(), attempts: 0});
  }
  async drain(send) {
    const pending = this.items.splice(0);
    for (const item of pending) {
      if (this.now() - item.createdAt > this.ttlMs) { this.dead.push({...item, reason: 'expired'}); continue; }
      try { await send(item); }
      catch {
        item.attempts += 1;
        if (item.attempts >= this.maxAttempts) this.dead.push({...item, reason: 'attempts-exhausted'});
        else this.items.push(item);
      }
    }
  }
}
