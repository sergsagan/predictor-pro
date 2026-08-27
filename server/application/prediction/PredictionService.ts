import type { Draw } from '@server/domain/models/Draw'
import type { GenerateRecommendationsResult } from '../recommendation/GenerateRecommendationsResult'

export interface PredictionService {
  execute(draws: readonly Draw[]): GenerateRecommendationsResult
}
