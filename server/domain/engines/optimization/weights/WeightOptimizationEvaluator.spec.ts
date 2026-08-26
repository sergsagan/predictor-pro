import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'

import { WeightOptimizationEvaluator } from './WeightOptimizationEvaluator'

describe('WeightOptimizationEvaluator', () => {
  it('creates a backtesting engine for the strategy configuration', () => {
    const backtestingEngine: BacktestingEngine = {
      run: vi
        .fn()
        .mockReturnValue([{ matches: 1 }, { matches: 0 }, { matches: 2 }])
    }

    const createBacktestingEngine = vi.fn().mockReturnValue(backtestingEngine)

    const evaluator = new WeightOptimizationEvaluator(createBacktestingEngine)

    const config = {
      strategy: 'simple' as const,
      weights: {
        frequency: 1,
        currentGap: 2,
        pairScore: 3
      }
    }

    const draws: Draw[] = []

    const result = evaluator.evaluate(config, draws)

    expect(createBacktestingEngine).toHaveBeenCalledWith(config)

    expect(result.weights).toEqual({
      frequency: 1,
      currentGap: 2,
      pairScore: 3
    })

    expect(result.metrics).toMatchObject({
      totalPredictions: 3,
      totalMatches: 3,
      averageMatches: 1,
      predictionsWithMatches: 2,
      hitRate: 2 / 3
    })
  })

  it('evaluates multiple weight configurations', () => {
    const backtestingEngine: BacktestingEngine = {
      run: vi
        .fn()
        .mockReturnValue([{ matches: 1 }, { matches: 0 }, { matches: 2 }])
    }

    const createBacktestingEngine = vi.fn().mockReturnValue(backtestingEngine)

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

    const results = evaluator.evaluateAll(configs, [])

    expect(results).toHaveLength(2)

    expect(results[0]?.weights).toEqual({
      frequency: 1,
      currentGap: 1,
      pairScore: 1
    })

    expect(results[1]?.weights).toEqual({
      frequency: 1,
      currentGap: 2,
      pairScore: 3
    })
  })

  it('creates a separate backtesting engine for each configuration', () => {
    const firstBacktestingEngine: BacktestingEngine = {
      run: vi.fn().mockReturnValue([{ matches: 1 }])
    }

    const secondBacktestingEngine: BacktestingEngine = {
      run: vi.fn().mockReturnValue([{ matches: 2 }])
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
        strategy: 'gap-focused' as const,
        weights: {
          frequency: 2,
          currentGap: 3,
          pairScore: 4
        }
      }
    ]

    evaluator.evaluateAll(configs, [])

    expect(createBacktestingEngine).toHaveBeenCalledTimes(2)

    expect(createBacktestingEngine).toHaveBeenNthCalledWith(1, configs[0])

    expect(createBacktestingEngine).toHaveBeenNthCalledWith(2, configs[1])
  })
})
