import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { WeightOptimizationResult } from './WeightOptimizationResult'
import type { StrategyOptimizationResult } from './StrategyOptimizationResult'
import type { WeightOptimizationEvaluator } from './WeightOptimizationEvaluator'

import { optimizeStrategiesWorkflow } from './StrategyOptimizationWorkflow'

describe('optimizeStrategiesWorkflow', () => {
  it('finds the best weights for each strategy and selects the best strategy', () => {
    const simpleResult: WeightOptimizationResult = {
      weights: {
        frequency: 1,
        currentGap: 2,
        pairScore: 1
      },
      metrics: {
        totalPredictions: 10,
        totalMatches: 6,
        averageMatches: 0.6,
        predictionsWithMatches: 5,
        hitRate: 0.5,
        distribution: {
          0: 5,
          1: 3,
          2: 2,
          3: 0,
          4: 0,
          5: 0
        }
      }
    }

    const gapFocusedResult: WeightOptimizationResult = {
      weights: {
        frequency: 1,
        currentGap: 3,
        pairScore: 2
      },
      metrics: {
        totalPredictions: 10,
        totalMatches: 7,
        averageMatches: 0.7,
        predictionsWithMatches: 6,
        hitRate: 0.6,
        distribution: {
          0: 4,
          1: 3,
          2: 2,
          3: 1,
          4: 0,
          5: 0
        }
      }
    }

    const evaluator = {
      evaluateAll: vi
        .fn()
        .mockReturnValueOnce([simpleResult])
        .mockReturnValueOnce([gapFocusedResult])
    } as unknown as WeightOptimizationEvaluator

    const strategies = [
      {
        strategy: 'simple' as const,
        frequency: [1],
        currentGap: [1, 2],
        pairScore: [1]
      },
      {
        strategy: 'gap-focused' as const,
        frequency: [1],
        currentGap: [2, 3],
        pairScore: [1, 2]
      }
    ]

    const result = optimizeStrategiesWorkflow(
      evaluator,
      strategies,
      [] as Draw[]
    )

    const expected: StrategyOptimizationResult = {
      strategy: 'gap-focused',
      weights: gapFocusedResult.weights,
      metrics: gapFocusedResult.metrics
    }

    expect(result).toEqual(expected)

    expect(evaluator.evaluateAll).toHaveBeenCalledTimes(2)
  })
})
