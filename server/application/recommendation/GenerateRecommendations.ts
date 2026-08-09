import type { Draw } from '@server/domain/models/Draw'
import type { GenerateRecommendationsResult } from './GenerateRecommendationsResult'

export interface GenerateRecommendations {
  execute(draws: readonly Draw[]): GenerateRecommendationsResult
}
