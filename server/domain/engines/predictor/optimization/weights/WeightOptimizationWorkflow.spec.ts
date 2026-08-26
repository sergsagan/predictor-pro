import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'

import { WeightOptimizationEvaluator } from './WeightOptimizationEvaluator'
import { optimizeWeightConfigurations } from './WeightOptimizationWorkflow'

describe('optimizeWeightConfigurations', () => {
  it('evaluates configurations and returns the best result', () => {
    const firstBacktestingEngine: BacktestingEngine = {
      run: vi.fn().mockReturnValue([{ matches: 1 }, { matches: 0 }])
    }

    const secondBacktestingEngine: BacktestingEngine = {
      run: vi.fn().mockReturnValue([{ matches: 1 }, { matches: 1 }])
    }

    const createBacktestingEngine = vi
      .fn()
      .mockReturnValueOnce(firstBacktestingEngine)
      .mockReturnValueOnce(secondBacktestingEngine)

    const evaluator = new WeightOptimizationEvaluator(createBacktestingEngine)

    const configs = [
      {
        strategy: 'simple' as const,
        weights: {
          frequency: 1,
          currentGap: 1,
          pairScore: 1
        }
      },
      {
        strategy: 'simple' as const,
        weights: {
          frequency: 1,
          currentGap: 2,
          pairScore: 3
        }
      }
    ]

    const draws: Draw[] = []

    const result = optimizeWeightConfigurations(evaluator, configs, draws)

    expect(result).toMatchObject({
      weights: {
        frequency: 1,
        currentGap: 2,
        pairScore: 3
      },
      metrics: {
        hitRate: 1
      }
    })
  })

  it('returns undefined when there are no configurations', () => {
    const createBacktestingEngine = vi.fn()

    const evaluator = new WeightOptimizationEvaluator(createBacktestingEngine)

    const result = optimizeWeightConfigurations(evaluator, [], [])

    expect(result).toBeUndefined()

    expect(createBacktestingEngine).not.toHaveBeenCalled()
  })
})
