import { defineEventHandler } from 'h3'

import { DefaultCompareStrategies } from '@server/application/strategyComparison/DefaultCompareStrategies'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'
import { GapFocusedRecommendationEngine } from '@server/domain/engines/recommendation/GapFocusedRecommendationEngine'

import { SimpleBacktestingEngine } from '@server/domain/engines/backtesting/SimpleBacktestingEngine'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'

export default defineEventHandler(async () => {
  const repository = createCsvDrawRepository({
    filePath: 'data/draws.csv'
  })

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

  const draws = await repository.findAll()

  return service.execute(draws)
})
