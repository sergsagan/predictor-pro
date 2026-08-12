import { createStatisticsService } from '@server/application/statistics/DefaultStatisticsService'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { toStatisticsDto } from '@server/application/statistics/mappers/toStatisticsDto'

export default defineEventHandler(async () => {
  const repository = createCsvDrawRepository({
    filePath: 'data/draws.csv'
  })

  const engine = createStatisticsEngine()

  const service = createStatisticsService({
    repository,
    engine
  })

  const statistics = await service.calculate()

  return toStatisticsDto(statistics)
})
