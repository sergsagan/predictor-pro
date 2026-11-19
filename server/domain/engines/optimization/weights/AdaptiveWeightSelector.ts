import type { RecommendationWeights } from '../../recommendation/config/RecommendationWeights'
import type { WeightOptimizationResult } from './WeightOptimizationResult'

import { optimizeWeights } from './WeightOptimizer'

const DEFAULT_WEIGHTS: RecommendationWeights = {
  frequency: 1,
  currentGap: 1,
  pairScore: 1
}

export function selectAdaptiveWeightProfile(
  results: readonly WeightOptimizationResult[],
  minimumPredictions = 30
): RecommendationWeights {
  const eligibleResults = results.filter(
    ({ metrics }) => metrics.totalPredictions >= minimumPredictions
  )

  const best = optimizeWeights(eligibleResults)

  return best?.weights ?? DEFAULT_WEIGHTS
}
