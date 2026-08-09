import type { Draw } from '@server/domain/models/Draw'

import type { StatisticsEngine } from '@server/domain/engines/statistics/StatisticsEngine'
import type { RecommendationEngine } from '@server/domain/engines/predictor/RecommendationEngine'
import type { NumberAnalysisEngine } from '@server/domain/engines/analysis/NumberAnalysisEngine'
import type { NumberExplanationEngine } from '@server/domain/engines/explanation/NumberExplanationEngine'

import type { GenerateRecommendations } from './GenerateRecommendations'
import type { GenerateRecommendationsResult } from './GenerateRecommendationsResult'
import type { NumberAnalysis } from '@server/domain/models/NumberAnalysis'
import type { NumberExplanation } from '@server/domain/models/NumberExplanation'

export class DefaultGenerateRecommendations implements GenerateRecommendations {
  constructor(
    private readonly statisticsEngine: StatisticsEngine,
    private readonly recommendationEngine: RecommendationEngine,
    private readonly numberAnalysisEngine: NumberAnalysisEngine,
    private readonly numberExplanationEngine: NumberExplanationEngine
  ) {}

  execute(draws: readonly Draw[]): GenerateRecommendationsResult {
    const statistics = this.statisticsEngine.calculate(draws)

    const recommendation = this.recommendationEngine.recommend(statistics)

    const selectedNumbers = recommendation.numbers.map((number) => number.value)

    const recommendations: {
      analysis: NumberAnalysis
      explanation: NumberExplanation
    }[] = []

    for (const number of recommendation.numbers) {
      const analysis = this.numberAnalysisEngine.analyze(
        number.value,
        selectedNumbers,
        statistics
      )

      const explanation = this.numberExplanationEngine.explain(analysis)

      recommendations.push({
        analysis,
        explanation
      })
    }

    return {
      recommendations
    }
  }
}
