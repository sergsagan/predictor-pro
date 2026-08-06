import type { NumberAnalysis } from '@server/domain/models/NumberAnalysis'
import type { NumberExplanation } from '@server/domain/models/NumberExplanation'

export interface NumberExplanationEngine {
  explain(analysis: NumberAnalysis): NumberExplanation
}
