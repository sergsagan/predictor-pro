import type { Draw } from '@server/domain/models/Draw'

import type { WeightOptimizationEvaluator } from '../weights/WeightOptimizationEvaluator'
import type { WeightOptimizationResult } from '../weights/WeightOptimizationResult'
import type { RecommendationStrategy } from '../../recommendation/config/RecommendationStrategy'

import { generateParameterConfigurations } from './ParameterSearch'
import { optimizeWeightConfigurations } from '../weights/WeightOptimizationWorkflow'

type ParameterSearch = Readonly<{
  strategy: RecommendationStrategy
  frequency: readonly number[]
  currentGap: readonly number[]
  pairScore: readonly number[]
}>

export function searchParameters(
  evaluator: WeightOptimizationEvaluator,
  parameters: ParameterSearch,
  draws: readonly Draw[]
): WeightOptimizationResult | undefined {
  const configurations = generateParameterConfigurations(parameters)

  return optimizeWeightConfigurations(evaluator, configurations, draws)
}
