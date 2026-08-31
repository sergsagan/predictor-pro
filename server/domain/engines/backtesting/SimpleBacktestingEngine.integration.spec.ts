import { describe, expect, it } from 'vitest'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'

import { SimpleBacktestingEngine } from './SimpleBacktestingEngine'

describe('SimpleBacktestingEngine integration', () => {
  it('runs backtesting against historical draws', async () => {
    const repository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await repository.findAll()

    const statisticsEngine = createStatisticsEngine()
    const recommendationEngine = new SimpleRecommendationEngine()

    const engine = new SimpleBacktestingEngine(
      statisticsEngine,
      recommendationEngine
    )

    const result = engine.run(draws)

    expect(result).toHaveLength(draws.length - 1)
  })

  it('produces a valid backtest result for every prediction', async () => {
    const repository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await repository.findAll()

    const statisticsEngine = createStatisticsEngine()
    const recommendationEngine = new SimpleRecommendationEngine()

    const engine = new SimpleBacktestingEngine(
      statisticsEngine,
      recommendationEngine
    )

    const result = engine.run(draws)

    expect(result).toHaveLength(draws.length - 1)

    for (const backtestResult of result) {
      expect(backtestResult.actualDraw).toBeDefined()
      expect(backtestResult.recommendation).toBeDefined()

      expect(backtestResult.recommendation.numbers).toHaveLength(5)

      expect(backtestResult.matches).toBeGreaterThanOrEqual(0)
      expect(backtestResult.matches).toBeLessThanOrEqual(5)
    }

    const totalMatches = result.reduce((total, item) => total + item.matches, 0)

    const predictionsWithMatches = result.filter(
      (item) => item.matches > 0
    ).length

    expect(result).toHaveLength(draws.length - 1)
    expect(totalMatches).toBe(28)
    expect(predictionsWithMatches).toBe(23)
  })
})
