import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionEvaluation } from '@server/domain/models/PredictionEvaluation'

import type { PredictionEvaluationRepository } from '@server/domain/repositories/predictions/PredictionEvaluationRepository'

type PredictionEvaluationService = Readonly<{
  execute(prediction: Prediction, actualDraw: Draw): PredictionEvaluation
}>

export class DefaultEvaluatePrediction {
  constructor(
    private readonly evaluationService: PredictionEvaluationService,
    private readonly evaluationRepository: PredictionEvaluationRepository
  ) {}

  async execute(
    prediction: Prediction,
    actualDraw: Draw
  ): Promise<PredictionEvaluation> {
    const evaluation = this.evaluationService.execute(prediction, actualDraw)

    await this.evaluationRepository.save(evaluation)

    return evaluation
  }
}
