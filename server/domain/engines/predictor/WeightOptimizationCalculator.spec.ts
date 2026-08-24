import { describe, expect, it } from 'vitest'

import type { WeightOptimizationResult } from './WeightOptimizationResult'
import { selectBestWeightOptimization } from './WeightOptimizationCalculator'

describe('selectBestWeightOptimization', () => {
  it('selects the result with the higher hit rate', () => {
    const first: WeightOptimizationResult = {
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      },
      metrics: {
        totalPredictions: 54,
        totalMatches: 33,
        averageMatches: 0.61,
        predictionsWithMatches: 26,
        hitRate: 0.48,
        distribution: [28, 20, 5, 1, 0, 0]
      }
    }

    const second: WeightOptimizationResult = {
      weights: {
        frequency: 1,
        currentGap: 3,
        pairScore: 2
      },
      metrics: {
        totalPredictions: 54,
        totalMatches: 40,
        averageMatches: 0.74,
        predictionsWithMatches: 30,
        hitRate: 0.56,
        distribution: [24, 20, 8, 2, 0, 0]
      }
    }

    const result = selectBestWeightOptimization(first, second)

    expect(result).toBe(second)
  })

  it('keeps the first result when hit rates are equal', () => {
    const first: WeightOptimizationResult = {
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      },
      metrics: {
        totalPredictions: 54,
        totalMatches: 33,
        averageMatches: 0.61,
        predictionsWithMatches: 26,
        hitRate: 0.48,
        distribution: [28, 20, 5, 1, 0, 0]
      }
    }

    const second: WeightOptimizationResult = {
      weights: {
        frequency: 2,
        currentGap: 2,
        pairScore: 2
      },
      metrics: {
        totalPredictions: 54,
        totalMatches: 35,
        averageMatches: 0.65,
        predictionsWithMatches: 28,
        hitRate: 0.48,
        distribution: [26, 21, 6, 1, 0, 0]
      }
    }

    const result = selectBestWeightOptimization(first, second)

    expect(result).toBe(first)
  })
})
