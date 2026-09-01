import { defineEventHandler } from 'h3'

import { DefaultPredictionHistoryService } from '@server/application/prediction/DefaultPredictionHistoryService'
import { createCsvPredictionRepository } from '@server/domain/repositories/predictions/CsvPredictionRepository'

export default defineEventHandler(async () => {
  const repository = createCsvPredictionRepository({
    filePath: 'data/predictions.csv'
  })

  const service = new DefaultPredictionHistoryService(repository)

  return service.findAll()
})
