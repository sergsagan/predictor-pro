import { defineEventHandler } from 'h3'

import { DefaultPredictionHistoryService } from '@server/application/prediction/DefaultPredictionHistoryService'
import { createCsvPredictionRepository } from '@server/domain/repositories/predictions/CsvPredictionRepository'

export default defineEventHandler(async (event) => {
  const repository = createCsvPredictionRepository({
    filePath: 'data/predictions.csv'
  })

  const service = new DefaultPredictionHistoryService(repository)

  const predictionDate = event.context.params?.id

  if (!predictionDate) {
    return null
  }

  return service.findByDate(predictionDate)
})
