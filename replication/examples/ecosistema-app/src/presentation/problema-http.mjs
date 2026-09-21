const titulos = Object.freeze({
  validation: 'La solicitud no es válida',
  authorization: 'La operación no está autorizada',
  conflict: 'La operación entra en conflicto con el estado actual',
  integrity: 'No fue posible verificar el resultado',
  compatibility: 'La versión no es compatible',
  infrastructure: 'El servicio no está disponible temporalmente',
});

const categorias = Object.freeze({
  ACCESS_DENIED: 'authorization',
  IDEMPOTENCY_CONFLICT: 'conflict',
  STALE_REVISION: 'conflict',
  PROJECTION_VERIFICATION_FAILED: 'integrity',
  PHYSICAL_VERSION_UNSUPPORTED: 'compatibility',
  PROVIDER_FAILURE: 'infrastructure',
});

export function crearProblemaHttp(error, estado, traducir, traceId = 'sin-traza') {
  const category = categorias[error.codigo] ?? 'validation';
  return {
    contentType: 'application/problem+json',
    body: {
      type: `https://cobria.example.invalid/problemas/${error.codigo.toLowerCase().replaceAll('_', '-')}`,
      title: titulos[category],
      status: estado,
      code: error.codigo,
      detail: traducir(error.codigo),
      traceId,
    },
  };
}
