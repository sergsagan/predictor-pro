import type { NumberAnalysis } from '@server/domain/models/NumberAnalysis'
import type { NumberExplanation } from '@server/domain/models/NumberExplanation'

export interface GenerateRecommendationsResult {
  recommendations: readonly {
    analysis: NumberAnalysis
    explanation: NumberExplanation
  }[]
}
