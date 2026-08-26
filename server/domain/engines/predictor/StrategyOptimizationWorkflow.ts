import type { Draw } from '@server/domain/models/Draw'

import type { RecommendationStrategy } from './RecommendationStrategy'
import type { WeightOptimizationEvaluator } from './WeightOptimizationEvaluator'
import type { StrategyOptimizationResult } from './StrategyOptimizationResult'

import { generateParameterConfigurations } from './ParameterSearch'
import { optimizeWeights } from './WeightOptimizer'
import { optimizeStrategies } from './StrategyOptimizer'

type StrategyParameterSearch = Readonly<{
  strategy: RecommendationStrategy
  frequency: readonly number[]
  currentGap: readonly number[]
  pairScore: readonly number[]
}>

export function optimizeStrategiesWorkflow(
  evaluator: WeightOptimizationEvaluator,
  strategies: readonly StrategyParameterSearch[],
  draws: readonly Draw[]
): StrategyOptimizationResult | undefined {
  const results: StrategyOptimizationResult[] = []

  for (const strategy of strategies) {
    const configurations = generateParameterConfigurations(strategy)

    const optimizationResults = evaluator.evaluateAll(configurations, draws)

    const best = optimizeWeights(optimizationResults)

    if (best !== undefined) {
      results.push({
        strategy: strategy.strategy,
        weights: best.weights,
        metrics: best.metrics
      })
    }
  }

  return optimizeStrategies(results)
}
