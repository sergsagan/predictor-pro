import { describe, expect, it } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { WeightOptimizationResult } from '../weights/WeightOptimizationResult'
import type { WeightOptimizationEvaluator } from '../weights/WeightOptimizationEvaluator'

import { searchParameters } from './ParameterSearchWorkflow'

describe('searchParameters', () => {
  it('generates parameter configurations and returns the best result', () => {
    const bestResult: WeightOptimizationResult = {
      weights: {
        frequency: 2,
        currentGap: 1,
        pairScore: 2
      },
      metrics: {
        totalPredictions: 2,
        totalMatches: 3,
        averageMatches: 1.5,
        predictionsWithMatches: 2,
        hitRate: 1,
        distribution: {
          0: 0,
          1: 1,
          2: 0,
          3: 1,
          4: 0,
          5: 0
        }
      }
    }

    const evaluator = {
      evaluateAll: () => [bestResult]
    } as unknown as WeightOptimizationEvaluator

    const result = searchParameters(
      evaluator,
      {
        strategy: 'simple',
        frequency: [1, 2],
        currentGap: [1],
        pairScore: [1, 2]
      },
      [] as Draw[]
    )

    expect(result).toBe(bestResult)
  })
})
