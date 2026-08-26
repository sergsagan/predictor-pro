import { describe, expect, it } from 'vitest'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/engines/SimpleRecommendationEngine'
import { GapFocusedRecommendationEngine } from '@server/domain/engines/recommendation/engines/GapFocusedRecommendationEngine'

import { SimpleBacktestingEngine } from './SimpleBacktestingEngine'
import { calculateAccuracyMetrics } from './AccuracyMetricsCalculator'
import { compareAlgorithms } from './AlgorithmComparisonCalculator'

describe('Recommendation strategies comparison integration', () => {
  it('compares simple and gap-focused recommendation strategies', async () => {
    const repository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await repository.findAll()

    const statisticsEngine = createStatisticsEngine()

    const simpleBacktestingEngine = new SimpleBacktestingEngine(
      statisticsEngine,
      new SimpleRecommendationEngine()
    )

    const gapFocusedBacktestingEngine = new SimpleBacktestingEngine(
      statisticsEngine,
      new GapFocusedRecommendationEngine()
    )

    const simpleResults = simpleBacktestingEngine.run(draws)

    const gapFocusedResults = gapFocusedBacktestingEngine.run(draws)

    const simpleMetrics = calculateAccuracyMetrics(simpleResults)

    const gapFocusedMetrics = calculateAccuracyMetrics(gapFocusedResults)

    const comparison = compareAlgorithms(
      {
        name: 'Simple',
        metrics: simpleMetrics
      },
      {
        name: 'GapFocused',
        metrics: gapFocusedMetrics
      }
    )

    expect(comparison.first.name).toBe('Simple')
    expect(comparison.second.name).toBe('GapFocused')

    expect(comparison.first.metrics.totalPredictions).toBe(draws.length - 1)
    expect(comparison.second.metrics.totalPredictions).toBe(draws.length - 1)

    expect(['Simple', 'GapFocused', null]).toContain(comparison.winner)
  })
})
