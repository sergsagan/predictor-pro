import type { WeightOptimizationResult } from './WeightOptimizationResult'

import { selectBestWeightOptimization } from './WeightOptimizationCalculator'

export function optimizeWeights(
  results: readonly WeightOptimizationResult[]
): WeightOptimizationResult | undefined {
  return results.reduce<WeightOptimizationResult | undefined>(
    (best, current) =>
      best === undefined
        ? current
        : selectBestWeightOptimization(best, current),
    undefined
  )
}
