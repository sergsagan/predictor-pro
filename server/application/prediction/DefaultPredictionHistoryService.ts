import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionRepository } from '@server/domain/repositories/predictions/PredictionRepository'

export class DefaultPredictionHistoryService {
  constructor(private readonly predictionRepository: PredictionRepository) {}

  async findAll(): Promise<readonly Prediction[]> {
    return this.predictionRepository.findAll()
  }

  async findByDate(predictionDate: string): Promise<Prediction | null> {
    return this.predictionRepository.findByDate(predictionDate)
  }
}
