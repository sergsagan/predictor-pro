export type WeightedScoreInput = Readonly<{
  frequency: number
  currentGap: number
  pairScore: number
  weights: Readonly<{
    frequency: number
    currentGap: number
    pairScore: number
  }>
}>

export function calculateWeightedScore({
  frequency,
  currentGap,
  pairScore,
  weights
}: WeightedScoreInput): number {
  return (
    frequency * weights.frequency +
    currentGap * weights.currentGap +
    pairScore * weights.pairScore
  )
}
