import { describe, expect, it } from 'vitest'

import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'
import type { WeightOptimizationResult } from './WeightOptimizationResult'

describe('WeightOptimizationResult', () => {
  it('contains weights and accuracy metrics', () => {
    const metrics: AccuracyMetrics = {
      totalPredictions: 54,
      totalMatches: 33,
      averageMatches: 0.611,
      predictionsWithMatches: 26,
      hitRate: 0.481,
      distribution: [28, 20, 5, 1, 0, 0]
    }

    const result: WeightOptimizationResult = {
      weights: {
        frequency: 1,
        currentGap: 2,
        pairScore: 3
      },
      metrics
    }

    expect(result.weights).toEqual({
      frequency: 1,
      currentGap: 2,
      pairScore: 3
    })

    expect(result.metrics.hitRate).toBe(0.481)
  })
})
