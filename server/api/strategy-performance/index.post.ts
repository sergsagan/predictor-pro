import { defineEventHandler } from 'h3'

import { DefaultRecordStrategyPerformance } from '@server/application/strategyPerformance/DefaultRecordStrategyPerformance'
import { DefaultCompareStrategies } from '@server/application/strategyComparison/DefaultCompareStrategies'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'
import { GapFocusedRecommendationEngine } from '@server/domain/engines/recommendation/GapFocusedRecommendationEngine'
import { SimpleBacktestingEngine } from '@server/domain/engines/backtesting/SimpleBacktestingEngine'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createCsvStrategyPerformanceRepository } from '@server/domain/repositories/strategies/CsvStrategyPerformanceRepository'

export default defineEventHandler(async () => {
  const drawRepository = createCsvDrawRepository({
    filePath: 'data/draws.csv'
  })

  const performanceRepository = createCsvStrategyPerformanceRepository({
    filePath: 'data/strategy-performance.csv'
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

  const compareStrategies = new DefaultCompareStrategies(
    {
      name: 'Simple',
      engine: simpleBacktestingEngine
    },
    {
      name: 'GapFocused',
      engine: gapFocusedBacktestingEngine
    }
  )

  const service = new DefaultRecordStrategyPerformance(
    drawRepository,
    compareStrategies,
    performanceRepository,
    {
      now: () => new Date()
    }
  )

  return service.execute()
})
