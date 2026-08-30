import { describe, expect, it } from 'vitest'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'
import { GapFocusedRecommendationEngine } from '@server/domain/engines/recommendation/GapFocusedRecommendationEngine'

import { SimpleBacktestingEngine } from './SimpleBacktestingEngine'
import { DefaultCompareStrategies } from '@server/application/strategyComparsion/DefaultCompareStrategies'

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

    const service = new DefaultCompareStrategies(
      {
        name: 'Simple',
        engine: simpleBacktestingEngine
      },
      {
        name: 'GapFocused',
        engine: gapFocusedBacktestingEngine
      }
    )

    const comparison = service.execute(draws)

    expect(comparison.first.name).toBe('Simple')
    expect(comparison.second.name).toBe('GapFocused')

    expect(comparison.first.metrics.totalPredictions).toBe(draws.length - 1)
    expect(comparison.second.metrics.totalPredictions).toBe(draws.length - 1)

    expect(['Simple', 'GapFocused', null]).toContain(comparison.winner)
  })
})
