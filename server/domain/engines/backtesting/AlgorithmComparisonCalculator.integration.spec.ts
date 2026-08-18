import { describe, expect, it } from 'vitest'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/predictor/SimpleRecommendationEngine'

import { calculateAccuracyMetrics } from './AccuracyMetricsCalculator'
import { compareAlgorithms } from './AlgorithmComparisonCalculator'
import { SimpleBacktestingEngine } from './SimpleBacktestingEngine'

describe('AlgorithmComparisonCalculator integration', () => {
  it('compares algorithms using historical backtesting results', async () => {
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

    const firstResults = backtestingEngine.run(draws)
    const secondResults = backtestingEngine.run(draws)

    const firstMetrics = calculateAccuracyMetrics(firstResults)
    const secondMetrics = calculateAccuracyMetrics(secondResults)

    const comparison = compareAlgorithms(
      {
        name: 'Algorithm A',
        metrics: firstMetrics
      },
      {
        name: 'Algorithm B',
        metrics: secondMetrics
      }
    )

    expect(comparison.first.name).toBe('Algorithm A')
    expect(comparison.second.name).toBe('Algorithm B')

    expect(comparison.first.metrics).toEqual(firstMetrics)
    expect(comparison.second.metrics).toEqual(secondMetrics)

    expect(comparison.winner).toBeNull()
  })

  it('selects the algorithm with better historical accuracy', async () => {
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

    const betterMetrics = {
      ...metrics,
      hitRate: metrics.hitRate + 0.1
    }

    const comparison = compareAlgorithms(
      {
        name: 'Baseline',
        metrics
      },
      {
        name: 'Improved',
        metrics: betterMetrics
      }
    )

    expect(comparison.winner).toBe('Improved')
  })
})
