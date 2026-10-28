// Evalúa registros ya obtenidos. No ejecuta deploy ni acredita su autenticidad.
export function verificarEntrega({ sha, digest, evidencias, ahora, maxEdadMs }) {
  if (!/^[a-f0-9]{40}$/.test(sha) || !/^[a-f0-9]{64}$/.test(digest)) throw new Error('IDENTIDAD_INVALIDA');
  if (!Number.isFinite(ahora) || !Number.isFinite(maxEdadMs) || maxEdadMs <= 0) throw new Error('TIEMPO_INVALIDO');
  const tipos = ['pruebas', 'staging', 'respaldo', 'restauracion', 'aprobacion'];
  if (!Array.isArray(evidencias) || evidencias.length !== tipos.length) throw new Error('EVIDENCIA_INCOMPLETA');
  for (const tipo of tipos) {
    const coincidencias = evidencias.filter(item => item.tipo === tipo);
    const item = coincidencias[0];
    if (coincidencias.length !== 1 || item.sha !== sha || item.digest !== digest || item.estado !== 'aprobado' ||
        !Number.isFinite(item.fechaMs) || item.fechaMs > ahora || ahora - item.fechaMs > maxEdadMs) {
      throw new Error('EVIDENCIA_INCOMPATIBLE');
    }
  }
  return { consistente: true, sha, digest };
}
