import type { PredictionEvaluationRepository } from '@server/domain/repositories/predictions/PredictionEvaluationRepository'

export class DefaultGetPredictionTrends {
  constructor(private readonly repository: PredictionEvaluationRepository) {}

  async execute() {
    const evaluations = await this.repository.findAll()

    const sorted = [...evaluations].sort((a, b) =>
      a.actualDraw.drawDate.localeCompare(b.actualDraw.drawDate)
    )

    let totalMatches = 0
    let predictionsWithMatches = 0

    return sorted.map((evaluation, index) => {
      totalMatches += evaluation.matches

      if (evaluation.matches > 0) {
        predictionsWithMatches++
      }

      const totalPredictions = index + 1

      return {
        predictionDate: evaluation.prediction.predictionDate,
        drawDate: evaluation.actualDraw.drawDate,
        matches: evaluation.matches,
        totalPredictions,
        totalMatches,
        averageMatches: totalMatches / totalPredictions,
        hitRate: predictionsWithMatches / totalPredictions
      }
    })
  }
}
