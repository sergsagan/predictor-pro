import { describe, expect, it } from 'vitest'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/predictor/SimpleRecommendationEngine'

import { SimpleBacktestingEngine } from './SimpleBacktestingEngine'
import { calculateRecommendationHistory } from './RecommendationHistoryCalculator'

describe('RecommendationHistoryCalculator integration', () => {
  it('builds recommendation history from historical backtesting', async () => {
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

    const history = calculateRecommendationHistory(results)

    expect(history).toHaveLength(draws.length - 1)

    expect(history).toHaveLength(results.length)

    for (const item of history) {
      expect(item.drawDate).toBe(item.actualDraw.drawDate)

      expect(item.recommendation).toBeDefined()
      expect(item.recommendation.numbers).toHaveLength(5)

      expect(item.actualDraw).toBeDefined()

      expect(item.matches).toBeGreaterThanOrEqual(0)
      expect(item.matches).toBeLessThanOrEqual(5)
    }
  })

  it('preserves the first and last historical recommendations', async () => {
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

    const history = calculateRecommendationHistory(results)

    const first = history[0]
    const last = history[history.length - 1]

    expect(first).toBeDefined()
    expect(last).toBeDefined()

    expect(first?.actualDraw).toEqual(results[0]?.actualDraw)
    expect(first?.recommendation).toEqual(results[0]?.recommendation)
    expect(first?.matches).toBe(results[0]?.matches)

    expect(last?.actualDraw).toEqual(results[results.length - 1]?.actualDraw)
    expect(last?.recommendation).toEqual(
      results[results.length - 1]?.recommendation
    )
    expect(last?.matches).toBe(results[results.length - 1]?.matches)
  })
})
