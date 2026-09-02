import { huella } from "./core/cobria.mjs";

export const normalizeDocuments = values => values
  .map(({ id, scope, status, value, revision, projected, sourceRevision }) =>
    ({ id, scope, status, value, revision, projected, sourceRevision }))
  .sort((left, right) => `${left.scope}\u0000${left.id}`.localeCompare(`${right.scope}\u0000${right.id}`));

export const equivalentDocuments = (left, right) =>
  huella(normalizeDocuments(left)) === huella(normalizeDocuments(right));

export function oracleProjection(canonical, transform) {
  return canonical.map(transform).filter(Boolean);
}

export function oracleFailure({ detected, recovered, activePreserved = true }) {
  return Boolean(detected && recovered && activePreserved);
}
