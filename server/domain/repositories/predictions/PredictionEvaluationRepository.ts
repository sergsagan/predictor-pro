import type { PredictionEvaluation } from '@server/domain/models/PredictionEvaluation'

export type PredictionEvaluationRepository = Readonly<{
  save(evaluation: PredictionEvaluation): Promise<void>

  findAll(): Promise<readonly PredictionEvaluation[]>

  findByPredictionDate(
    predictionDate: string
  ): Promise<PredictionEvaluation | null>
}>
