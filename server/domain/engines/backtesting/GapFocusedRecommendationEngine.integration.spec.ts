import { describe, expect, it } from 'vitest'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { GapFocusedRecommendationEngine } from '@server/domain/engines/predictor/GapFocusedRecommendationEngine'

import { SimpleBacktestingEngine } from './SimpleBacktestingEngine'
import { calculateAccuracyMetrics } from './AccuracyMetricsCalculator'

describe('GapFocusedRecommendationEngine integration', () => {
  it('runs backtesting with the gap-focused recommendation strategy', async () => {
    const repository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await repository.findAll()

    const statisticsEngine = createStatisticsEngine()

    const recommendationEngine = new GapFocusedRecommendationEngine()

    const backtestingEngine = new SimpleBacktestingEngine(
      statisticsEngine,
      recommendationEngine
    )

    const results = backtestingEngine.run(draws)

    const metrics = calculateAccuracyMetrics(results)

    expect(results).toHaveLength(draws.length - 1)

    expect(metrics.totalPredictions).toBe(draws.length - 1)

    expect(metrics.totalMatches).toBeGreaterThanOrEqual(0)

    expect(metrics.averageMatches).toBeGreaterThanOrEqual(0)

    expect(metrics.hitRate).toBeGreaterThanOrEqual(0)
    expect(metrics.hitRate).toBeLessThanOrEqual(1)

    expect(
      results.every((result) => result.recommendation.numbers.length === 5)
    ).toBe(true)
  })
})
