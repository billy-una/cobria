// Una regla pura devuelve un valor: no guarda datos ni concede permisos.
export function cantidadPermitida(cantidad) {
  return Number.isInteger(cantidad) && cantidad >= 1;
}
