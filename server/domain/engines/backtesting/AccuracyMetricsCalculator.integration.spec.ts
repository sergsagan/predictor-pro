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
      totalPredictions: 59,
      totalMatches: 28,
      averageMatches: 0.4745762711864407,
      predictionsWithMatches: 23,
      hitRate: 0.3898305084745763,
      distribution: {
        0: 36,
        1: 18,
        2: 5,
        3: 0,
        4: 0,
        5: 0
      }
    })
  })
})
