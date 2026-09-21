export function verifyLegacyBudget({baselineBytes, currentBytes, previousConsumers, currentConsumers, addedResponsibilities = 0}) {
  const violations = [];
  if (currentBytes > baselineBytes) violations.push('LEGACY_GREW');
  if (currentConsumers > previousConsumers) violations.push('CONSUMERS_GREW');
  if (addedResponsibilities > 0) violations.push('RESPONSIBILITY_ADDED');
  return {ok: violations.length === 0, violations, removable: currentConsumers === 0};
}
