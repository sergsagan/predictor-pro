import { describe, expect, it } from 'vitest'

import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'
import type { RecommendationStrategyConfig } from '../../recommendation/config/RecommendationStrategyConfig'

import { createStatisticsEngine } from '../../statistics/DefaultStatisticsEngine'
import { SimpleBacktestingEngine } from '../../backtesting/SimpleBacktestingEngine'

import { createRecommendationEngine } from '../../recommendation/engines/createRecommendationEngine'
import { WeightOptimizationEvaluator } from '../weights/WeightOptimizationEvaluator'
import { optimizeStrategiesWorkflow } from './StrategyOptimizationWorkflow'

describe('StrategyOptimizationWorkflow integration', () => {
  it('optimizes each strategy and selects the best overall strategy', () => {
    const statisticsEngine = createStatisticsEngine()

    const createBacktestingEngine = (
      config: RecommendationStrategyConfig
    ): BacktestingEngine => {
      const recommendationEngine = createRecommendationEngine(config)

      return new SimpleBacktestingEngine(statisticsEngine, recommendationEngine)
    }

    const evaluator = new WeightOptimizationEvaluator(createBacktestingEngine)

    const strategies = [
      {
        strategy: 'simple' as const,
        frequency: [1, 2],
        currentGap: [1, 2],
        pairScore: [1, 2]
      },
      {
        strategy: 'gap-focused' as const,
        frequency: [1, 2],
        currentGap: [1, 2],
        pairScore: [1, 2]
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
        numbers: [1, 2, 3, 4, 6] as const,
        extraNumbers: [2, 3] as const
      },
      {
        drawDate: '2025-01-22',
        numbers: [1, 2, 3, 4, 6] as const,
        extraNumbers: [1, 4] as const
      },
      {
        drawDate: '2025-01-29',
        numbers: [1, 2, 3, 4, 6] as const,
        extraNumbers: [2, 4] as const
      }
    ] as const

    const result = optimizeStrategiesWorkflow(evaluator, strategies, draws)

    expect(result).toBeDefined()

    expect(result?.strategy).toMatch(/^(simple|gap-focused)$/)

    expect(result?.weights).toEqual({
      frequency: expect.any(Number),
      currentGap: expect.any(Number),
      pairScore: expect.any(Number)
    })

    expect(result?.metrics.totalPredictions).toBe(draws.length - 1)

    expect(result?.metrics.hitRate).toBeGreaterThanOrEqual(0)
    expect(result?.metrics.hitRate).toBeLessThanOrEqual(1)
  })
})
