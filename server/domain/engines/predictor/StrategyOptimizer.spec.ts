import { describe, expect, it } from 'vitest'

import type { StrategyOptimizationResult } from './StrategyOptimizationResult'

import { optimizeStrategies } from './StrategyOptimizer'

describe('optimizeStrategies', () => {
  it('selects the strategy with the higher hit rate', () => {
    const first: StrategyOptimizationResult = {
      strategy: 'simple',
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      },
      metrics: {
        totalPredictions: 54,
        totalMatches: 30,
        averageMatches: 0.55,
        predictionsWithMatches: 24,
        hitRate: 0.44,
        distribution: {
          0: 30,
          1: 18,
          2: 5,
          3: 1,
          4: 0,
          5: 0
        }
      }
    }

    const second: StrategyOptimizationResult = {
      strategy: 'gap-focused',
      weights: {
        frequency: 1,
        currentGap: 2,
        pairScore: 1
      },
      metrics: {
        totalPredictions: 54,
        totalMatches: 36,
        averageMatches: 0.67,
        predictionsWithMatches: 28,
        hitRate: 0.52,
        distribution: {
          0: 26,
          1: 20,
          2: 6,
          3: 2,
          4: 0,
          5: 0
        }
      }
    }

    const result = optimizeStrategies([first, second])

    expect(result).toBe(second)
  })

  it('keeps the first strategy when hit rates are equal', () => {
    const first: StrategyOptimizationResult = {
      strategy: 'simple',
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      },
      metrics: {
        totalPredictions: 54,
        totalMatches: 30,
        averageMatches: 0.55,
        predictionsWithMatches: 24,
        hitRate: 0.5,
        distribution: {
          0: 30,
          1: 18,
          2: 5,
          3: 1,
          4: 0,
          5: 0
        }
      }
    }

    const second: StrategyOptimizationResult = {
      strategy: 'gap-focused',
      weights: {
        frequency: 2,
        currentGap: 1,
        pairScore: 2
      },
      metrics: {
        totalPredictions: 54,
        totalMatches: 34,
        averageMatches: 0.63,
        predictionsWithMatches: 27,
        hitRate: 0.5,
        distribution: {
          0: 27,
          1: 21,
          2: 5,
          3: 1,
          4: 0,
          5: 0
        }
      }
    }

    const result = optimizeStrategies([first, second])

    expect(result).toBe(first)
  })

  it('returns undefined when there are no strategy results', () => {
    const result = optimizeStrategies([])

    expect(result).toBeUndefined()
  })
})
