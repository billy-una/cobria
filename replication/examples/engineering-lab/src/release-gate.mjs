export function evaluateRelease(candidate) {
  const required = ['commit','artifactDigest','stagingDigest','testsPassed','backupVerified','approval','smokePlan','rollbackArtifact'];
  const missing = required.filter(key => !candidate[key]);
  if (candidate.artifactDigest && candidate.stagingDigest && candidate.artifactDigest !== candidate.stagingDigest)
    missing.push('sameArtifact');
  return {decision: missing.length ? 'NO-GO' : 'GO', missing: [...new Set(missing)].sort()};
}
