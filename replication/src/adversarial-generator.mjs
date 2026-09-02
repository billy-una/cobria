export function adversarialDataset({ size = 30, seed = 1, scope = "bosque-sur", foreignScope = "bosque-norte" } = {}) {
  const value = index => ((index * 7919 + seed * 104729) % 1000003);
  return Array.from({ length: size }, (_, index) => ({
    id: `doc-${index}`,
    scope: index % 7 === 0 ? foreignScope : scope,
    status: index % 4 === 0 ? "activo" : "cerrado",
    value: index % 5 === 0 ? { nested: value(index), unicode: "ñ-日本語" } : value(index),
    revision: index % 9 === 0 ? 2 : 1,
    eventTime: index,
    schemaVersion: index % 11 === 0 ? 2 : 1
  }));
}
