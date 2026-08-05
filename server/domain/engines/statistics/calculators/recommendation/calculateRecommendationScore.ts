/**
 * Calculates overall recommendation score.
 *
 * Current implementation uses a simple sum.
 * Future versions may introduce weighted scoring.
 */
export function calculateRecommendationScore(
  frequency: number,
  currentGap: number,
  pairScore: number
): number {
  return frequency + currentGap + pairScore
}
