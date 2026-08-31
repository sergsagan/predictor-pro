import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionRepository } from '@server/domain/repositories/predictions/PredictionRepository'

export class DefaultSavePrediction {
  constructor(private readonly predictionRepository: PredictionRepository) {}

  async execute(prediction: Prediction): Promise<void> {
    await this.predictionRepository.save(prediction)
  }
}
