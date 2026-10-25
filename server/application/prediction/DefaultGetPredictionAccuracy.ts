import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'
import type { PredictionEvaluationRepository } from '@server/domain/repositories/predictions/PredictionEvaluationRepository'

export class DefaultGetPredictionAccuracy {
  constructor(
    private readonly evaluationRepository: PredictionEvaluationRepository
  ) {}

  async execute(): Promise<AccuracyMetrics> {
    const evaluations = await this.evaluationRepository.findAll()

    const totalPredictions = evaluations.length

    const totalMatches = evaluations.reduce(
      (total, evaluation) => total + evaluation.matches,
      0
    )

    const predictionsWithMatches = evaluations.filter(
      (evaluation) => evaluation.matches > 0
    ).length

    const distribution: Record<0 | 1 | 2 | 3 | 4 | 5, number> = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }

    for (const evaluation of evaluations) {
      switch (evaluation.matches) {
        case 0:
          distribution[0]++
          break
        case 1:
          distribution[1]++
          break
        case 2:
          distribution[2]++
          break
        case 3:
          distribution[3]++
          break
        case 4:
          distribution[4]++
          break
        case 5:
          distribution[5]++
          break
      }
    }

    return {
      totalPredictions,
      totalMatches,
      averageMatches:
        totalPredictions === 0 ? 0 : totalMatches / totalPredictions,
      predictionsWithMatches,
      hitRate:
        totalPredictions === 0 ? 0 : predictionsWithMatches / totalPredictions,
      distribution
    }
  }
}
