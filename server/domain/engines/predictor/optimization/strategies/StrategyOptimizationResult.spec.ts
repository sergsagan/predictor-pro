import { describe, expect, it } from 'vitest'

import type { StrategyOptimizationResult } from './StrategyOptimizationResult'

describe('StrategyOptimizationResult', () => {
  it('contains strategy and optimization result', () => {
    const result: StrategyOptimizationResult = {
      strategy: 'simple',
      weights: {
        frequency: 1,
        currentGap: 2,
        pairScore: 3
      },
      metrics: {
        totalPredictions: 54,
        totalMatches: 33,
        averageMatches: 0.6111111111111112,
        predictionsWithMatches: 26,
        hitRate: 0.48148148148148145,
        distribution: {
          0: 28,
          1: 20,
          2: 5,
          3: 1,
          4: 0,
          5: 0
        }
      }
    }

    expect(result.strategy).toBe('simple')

    expect(result.weights).toEqual({
      frequency: 1,
      currentGap: 2,
      pairScore: 3
    })

    expect(result.metrics.hitRate).toBe(0.48148148148148145)
  })
})
