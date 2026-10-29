import { describe, expect, it } from 'vitest'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'

import { SimpleBacktestingEngine } from './SimpleBacktestingEngine'
import { calculateAccuracyMetrics } from './AccuracyMetricsCalculator'

describe('AccuracyMetricsCalculator integration', () => {
  it('calculates accuracy metrics from historical backtesting', async () => {
    const repository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await repository.findAll()

    const statisticsEngine = createStatisticsEngine()
    const recommendationEngine = new SimpleRecommendationEngine()

    const backtestingEngine = new SimpleBacktestingEngine(
      statisticsEngine,
      recommendationEngine
    )

    const results = backtestingEngine.run(draws)

    const metrics = calculateAccuracyMetrics(results)

    expect(metrics).toEqual({
      totalPredictions: 84,
      totalMatches: 49,
      averageMatches: 0.5833333333333334,
      predictionsWithMatches: 42,
      hitRate: 0.5,
      distribution: {
        0: 42,
        1: 36,
        2: 5,
        3: 1,
        4: 0,
        5: 0
      }
    })
  })
})
