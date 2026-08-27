import { describe, expect, it } from 'vitest'

import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'
import type { RecommendationStrategyConfig } from '../../recommendation/config/RecommendationStrategyConfig'

import { createStatisticsEngine } from '../../statistics/DefaultStatisticsEngine'
import { SimpleBacktestingEngine } from '../../backtesting/SimpleBacktestingEngine'
import { createRecommendationEngine } from '../../recommendation/createRecommendationEngine'

import { WeightOptimizationEvaluator } from './WeightOptimizationEvaluator'
import { optimizeWeightConfigurations } from './WeightOptimizationWorkflow'

describe('WeightOptimizationWorkflow integration', () => {
  it('optimizes weights using real recommendation and backtesting engines', () => {
    const statisticsEngine = createStatisticsEngine()

    const createBacktestingEngine = (
      config: RecommendationStrategyConfig
    ): BacktestingEngine => {
      const recommendationEngine = createRecommendationEngine(config)

      return new SimpleBacktestingEngine(statisticsEngine, recommendationEngine)
    }

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
          frequency: 2,
          currentGap: 1,
          pairScore: 1
        }
      }
    ]

    const draws = [
      {
        drawDate: '2025-01-01',
        numbers: [1, 2, 3, 4, 5] as const,
        extraNumbers: [1, 2] as const
      },
      {
        drawDate: '2025-01-08',
        numbers: [1, 2, 3, 4, 6] as const,
        extraNumbers: [1, 3] as const
      },
      {
        drawDate: '2025-01-15',
        numbers: [1, 2, 3, 5, 6] as const,
        extraNumbers: [2, 3] as const
      }
    ] as const

    const result = optimizeWeightConfigurations(evaluator, configs, draws)

    expect(result).toBeDefined()

    expect(result?.weights).toEqual(
      expect.objectContaining({
        frequency: expect.any(Number),
        currentGap: expect.any(Number),
        pairScore: expect.any(Number)
      })
    )

    expect(result?.metrics.totalPredictions).toBe(2)

    expect(result?.metrics).toEqual(
      expect.objectContaining({
        totalMatches: expect.any(Number),
        averageMatches: expect.any(Number),
        hitRate: expect.any(Number)
      })
    )
  })

  it('compares multiple weight configurations using real historical draws', () => {
    const statisticsEngine = createStatisticsEngine()

    const createBacktestingEngine = (
      config: RecommendationStrategyConfig
    ): BacktestingEngine => {
      const recommendationEngine = createRecommendationEngine(config)

      return new SimpleBacktestingEngine(statisticsEngine, recommendationEngine)
    }

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
          frequency: 2,
          currentGap: 1,
          pairScore: 1
        }
      },
      {
        strategy: 'simple' as const,
        weights: {
          frequency: 1,
          currentGap: 2,
          pairScore: 1
        }
      },
      {
        strategy: 'simple' as const,
        weights: {
          frequency: 1,
          currentGap: 1,
          pairScore: 2
        }
      },
      {
        strategy: 'simple' as const,
        weights: {
          frequency: 2,
          currentGap: 2,
          pairScore: 2
        }
      }
    ]

    const draws = [
      {
        drawDate: '2025-01-01',
        numbers: [1, 2, 3, 4, 5] as const,
        extraNumbers: [1, 2] as const
      },
      {
        drawDate: '2025-01-08',
        numbers: [1, 2, 3, 4, 6] as const,
        extraNumbers: [1, 3] as const
      },
      {
        drawDate: '2025-01-15',
        numbers: [1, 2, 3, 5, 6] as const,
        extraNumbers: [2, 3] as const
      },
      {
        drawDate: '2025-01-22',
        numbers: [1, 2, 4, 5, 7] as const,
        extraNumbers: [1, 4] as const
      },
      {
        drawDate: '2025-01-29',
        numbers: [1, 3, 4, 6, 7] as const,
        extraNumbers: [2, 4] as const
      }
    ] as const

    const results = evaluator.evaluateAll(configs, draws)

    const best = optimizeWeightConfigurations(evaluator, configs, draws)

    expect(results).toHaveLength(configs.length)

    expect(best).toBeDefined()

    expect(best?.metrics.hitRate).toBe(
      Math.max(...results.map((result) => result.metrics.hitRate))
    )
  })

  it('produces different backtesting results for different weight configurations', () => {
    const statisticsEngine = createStatisticsEngine()

    const createBacktestingEngine = (
      config: RecommendationStrategyConfig
    ): BacktestingEngine => {
      const recommendationEngine = createRecommendationEngine(config)

      return new SimpleBacktestingEngine(statisticsEngine, recommendationEngine)
    }

    const evaluator = new WeightOptimizationEvaluator(createBacktestingEngine)

    const frequencyFocusedConfig = {
      strategy: 'simple' as const,
      weights: {
        frequency: 2,
        currentGap: 1,
        pairScore: 1
      }
    }

    const gapFocusedConfig = {
      strategy: 'simple' as const,
      weights: {
        frequency: 1,
        currentGap: 2,
        pairScore: 1
      }
    }

    const draws = [
      {
        drawDate: '2025-01-01',
        numbers: [1, 2, 3, 4, 5] as const,
        extraNumbers: [1, 2] as const
      },
      {
        drawDate: '2025-01-08',
        numbers: [1, 2, 3, 4, 5] as const,
        extraNumbers: [1, 2] as const
      },
      {
        drawDate: '2025-01-15',
        numbers: [1, 2, 3, 4, 5] as const,
        extraNumbers: [1, 2] as const
      },
      {
        drawDate: '2025-01-22',
        numbers: [1, 2, 3, 4, 6] as const,
        extraNumbers: [1, 2] as const
      },
      {
        drawDate: '2025-01-29',
        numbers: [1, 2, 3, 4, 6] as const,
        extraNumbers: [1, 2] as const
      }
    ] as const

    const [frequencyFocusedResult, gapFocusedResult] = evaluator.evaluateAll(
      [frequencyFocusedConfig, gapFocusedConfig],
      draws
    )

    expect(frequencyFocusedResult).toBeDefined()
    expect(gapFocusedResult).toBeDefined()

    expect(frequencyFocusedResult?.metrics.totalMatches).not.toBe(
      gapFocusedResult?.metrics.totalMatches
    )
  })
})
