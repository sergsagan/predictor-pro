import type { Prediction } from '@server/domain/models/Prediction'

import type { PredictionRepository } from '@server/domain/repositories/predictions/PredictionRepository'
import type { PredictionEvaluationRepository } from '@server/domain/repositories/predictions/PredictionEvaluationRepository'

export class DefaultFindPendingPredictions {
  constructor(
    private readonly predictionRepository: PredictionRepository,
    private readonly evaluationRepository: PredictionEvaluationRepository
  ) {}

  async execute(): Promise<readonly Prediction[]> {
    const [predictions, evaluations] = await Promise.all([
      this.predictionRepository.findAll(),
      this.evaluationRepository.findAll()
    ])

    const evaluatedDates = new Set(
      evaluations.map((evaluation) => evaluation.prediction.predictionDate)
    )

    return predictions.filter(
      (prediction) => !evaluatedDates.has(prediction.predictionDate)
    )
  }
}
