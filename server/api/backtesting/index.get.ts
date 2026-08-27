import { DefaultRunBacktesting } from '@server/application/backtesting/DefaultRunBacktesting'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'

import { SimpleBacktestingEngine } from '@server/domain/engines/backtesting/SimpleBacktestingEngine'
import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'

export default defineEventHandler(async () => {
  const repository = createCsvDrawRepository({
    filePath: 'data/draws.csv'
  })

  const statisticsEngine = createStatisticsEngine()
  const recommendationEngine = new SimpleRecommendationEngine()

  const backtestingEngine = new SimpleBacktestingEngine(
    statisticsEngine,
    recommendationEngine
  )

  const useCase = new DefaultRunBacktesting(backtestingEngine)

  const draws = await repository.findAll()

  return useCase.execute(draws)
})
