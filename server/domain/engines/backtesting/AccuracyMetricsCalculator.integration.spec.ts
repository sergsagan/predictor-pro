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
      totalPredictions: 68,
      totalMatches: 40,
      averageMatches: 0.5882352941176471,
      predictionsWithMatches: 34,
      hitRate: 0.5,
      distribution: {
        0: 34,
        1: 29,
        2: 4,
        3: 1,
        4: 0,
        5: 0
      }
    })
  })
})
