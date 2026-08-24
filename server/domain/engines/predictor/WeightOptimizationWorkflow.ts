import type { Draw } from '@server/domain/models/Draw'

import type { RecommendationStrategyConfig } from './RecommendationStrategyConfig'
import type { WeightOptimizationResult } from './WeightOptimizationResult'

import type { WeightOptimizationEvaluator } from './WeightOptimizationEvaluator'
import { optimizeWeights } from './WeightOptimizer'

export function optimizeWeightConfigurations(
  evaluator: WeightOptimizationEvaluator,
  configs: readonly RecommendationStrategyConfig[],
  draws: readonly Draw[]
): WeightOptimizationResult | undefined {
  const results = evaluator.evaluateAll(configs, draws)

  return optimizeWeights(results)
}
