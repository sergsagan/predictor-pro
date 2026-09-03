import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'

import type { PredictionService } from '../prediction/PredictionService'

type PredictionSchedulingService = Readonly<{
  isDue(currentDate: string, drawDate: string): boolean
}>

type SavePrediction = Readonly<{
  execute(prediction: Prediction): Promise<void>
}>

export class DefaultRunScheduledPrediction {
  constructor(
    private readonly schedulingService: PredictionSchedulingService,
    private readonly predictionService: PredictionService,
    private readonly savePrediction: SavePrediction
  ) {}

  async execute(
    draws: readonly Draw[],
    currentDate: string,
    drawDate: string
  ): Promise<void> {
    const isDue = this.schedulingService.isDue(currentDate, drawDate)

    if (!isDue) {
      return
    }

    const result = this.predictionService.execute(draws)

    const numbers = result.recommendations
      .slice(0, 5)
      .map(({ analysis }) => analysis.value)

    if (numbers.length !== 5) {
      throw new Error('Prediction requires exactly five recommendations')
    }

    const prediction: Prediction = {
      predictionDate: currentDate,
      numbers: [numbers[0]!, numbers[1]!, numbers[2]!, numbers[3]!, numbers[4]!]
    }

    await this.savePrediction.execute(prediction)
  }
}
