import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionEvaluation } from '@server/domain/models/PredictionEvaluation'

type CountPredictionMatches = (prediction: Prediction, draw: Draw) => number

export class DefaultPredictionEvaluationService {
  constructor(
    private readonly countPredictionMatches: CountPredictionMatches
  ) {}

  execute(prediction: Prediction, actualDraw: Draw): PredictionEvaluation {
    const matches = this.countPredictionMatches(prediction, actualDraw)

    return {
      prediction,
      actualDraw,
      matches
    }
  }
}
