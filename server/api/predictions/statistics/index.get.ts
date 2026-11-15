import { defineEventHandler } from 'h3'

import { DefaultGetPredictionAccuracy } from '@server/application/prediction/DefaultGetPredictionAccuracy'
import { DefaultGetPredictionTrends } from '@server/application/prediction/DefaultGetPredictionTrends'
import { createCsvPredictionEvaluationRepository } from '@server/domain/repositories/predictions/CsvPredictionEvaluationRepository'

export default defineEventHandler(async () => {
  const repository = createCsvPredictionEvaluationRepository({
    filePath: 'data/prediction-evaluations.csv'
  })

  const accuracyService = new DefaultGetPredictionAccuracy(repository)
  const trendsService = new DefaultGetPredictionTrends(repository)

  const [accuracy, trends] = await Promise.all([
    accuracyService.execute(),
    trendsService.execute()
  ])

  return {
    accuracy,
    trends
  }
})
