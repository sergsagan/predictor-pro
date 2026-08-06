import type { NumberExplanationEngine } from './NumberExplanationEngine'
import type { NumberAnalysis } from '@server/domain/models/NumberAnalysis'
import type { NumberExplanation } from '@server/domain/models/NumberExplanation'
import { formatFrequency } from './formatters/formatFrequency'
import { formatLastSeen } from './formatters/formatLastSeen'
import { formatPairScore } from './formatters/formatPairScore'
import { formatRecommendationScore } from './formatters/formatRecommendationScore'

export class SimpleNumberExplanationEngine implements NumberExplanationEngine {
  explain(analysis: NumberAnalysis): NumberExplanation {
    return {
      value: analysis.value,
      lines: [
        formatFrequency(analysis.frequency),
        formatLastSeen(analysis.lastSeen),
        formatPairScore(analysis.pairScore),
        formatRecommendationScore(analysis.recommendationScore)
      ]
    }
  }
}
