import { defineEventHandler } from 'h3'

import { DefaultGetStrategyPerformanceHistory } from '@server/application/strategyPerformance/DefaultGetStrategyPerformanceHistory'
import { createCsvStrategyPerformanceRepository } from '@server/domain/repositories/strategies/CsvStrategyPerformanceRepository'

export default defineEventHandler(async () => {
  const repository = createCsvStrategyPerformanceRepository({
    filePath: 'data/strategy-performance.csv'
  })

  const service = new DefaultGetStrategyPerformanceHistory(repository)

  return service.execute()
})
