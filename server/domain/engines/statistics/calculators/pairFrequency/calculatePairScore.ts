import { createPairKey } from './createPairKey'

export function calculatePairScore(
  candidate: number,
  selectedNumbers: readonly number[],
  pairFrequency: ReadonlyMap<string, number>
): number {
  return selectedNumbers.reduce(
    (score, selectedNumber) =>
      score +
      (pairFrequency.get(createPairKey(candidate, selectedNumber)) ?? 0),
    0
  )
}
