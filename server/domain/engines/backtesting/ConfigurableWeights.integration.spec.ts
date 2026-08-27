import { describe, expect, it } from 'vitest'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'

import { SimpleBacktestingEngine } from './SimpleBacktestingEngine'
import { calculateAccuracyMetrics } from './AccuracyMetricsCalculator'

describe('Configurable weights integration', () => {
  it('runs backtesting with configurable recommendation weights', async () => {
    const repository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await repository.findAll()

    const statisticsEngine = createStatisticsEngine()

    const recommendationEngine = new SimpleRecommendationEngine({
      frequency: 2,
      currentGap: 0.5,
      pairScore: 3
    })

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
  })
})
