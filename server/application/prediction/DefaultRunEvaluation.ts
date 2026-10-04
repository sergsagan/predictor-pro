import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'

type FindPendingPredictions = Readonly<{
  execute(): Promise<readonly Prediction[]>
}>

type DrawRepository = Readonly<{
  findAll(): Promise<readonly Draw[]>
}>

type EvaluatePrediction = Readonly<{
  execute(prediction: Prediction, actualDraw: Draw): Promise<unknown>
}>

export class DefaultRunEvaluation {
  constructor(
    private readonly findPendingPredictions: FindPendingPredictions,
    private readonly drawRepository: DrawRepository,
    private readonly evaluatePrediction: EvaluatePrediction
  ) {}

  async execute(): Promise<void> {
    const [predictions, draws] = await Promise.all([
      this.findPendingPredictions.execute(),
      this.drawRepository.findAll()
    ])

    const chronologicalDraws = [...draws].sort((a, b) =>
      a.drawDate.localeCompare(b.drawDate)
    )

    for (const prediction of predictions) {
      const actualDraw = chronologicalDraws.find(
        (draw) => draw.drawDate > prediction.predictionDate
      )

      if (!actualDraw) {
        continue
      }

      await this.evaluatePrediction.execute(prediction, actualDraw)
    }
  }
}
