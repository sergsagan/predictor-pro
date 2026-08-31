import type { Prediction } from '@server/domain/models/Prediction'

export type PredictionRepository = Readonly<{
  save(prediction: Prediction): Promise<void>

  findAll(): Promise<readonly Prediction[]>

  findLatest(): Promise<Prediction | null>

  findByDate(predictionDate: string): Promise<Prediction | null>
}>
