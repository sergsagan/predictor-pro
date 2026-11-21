import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '../../../models/Draw'
import type { RecommendationStrategyConfig } from '../../recommendation/config/RecommendationStrategyConfig'
import type { WeightOptimizationResult } from './WeightOptimizationResult'

import { createDefaultWeightProfiles } from './DefaultWeightProfileCatalog'
import { evaluateAdaptiveWeightProfiles } from './AdaptiveWeightEvaluation'

describe('evaluateAdaptiveWeightProfiles', () => {
  it('evaluates all default weight profiles using the same historical draws', () => {
    const draws: readonly Draw[] = []

    const results: readonly WeightOptimizationResult[] = []

    const evaluateAll = vi.fn(
      (
        _configurations: readonly RecommendationStrategyConfig[],
        _draws: readonly Draw[]
      ) => results
    )

    const evaluator = { evaluateAll }

    const evaluatedResults = evaluateAdaptiveWeightProfiles(evaluator, draws)

    expect(evaluateAll).toHaveBeenCalledWith(
      createDefaultWeightProfiles(),
      draws
    )

    expect(evaluatedResults).toBe(results)
  })
})
