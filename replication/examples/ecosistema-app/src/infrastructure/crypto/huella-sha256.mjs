import { createHash } from 'node:crypto';

export const calcularHuellaSha256 = (valor) =>
  createHash('sha256').update(JSON.stringify(valor)).digest('hex');
