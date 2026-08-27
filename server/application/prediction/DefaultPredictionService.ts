import type { Draw } from '@server/domain/models/Draw'

import type { GenerateRecommendations } from '../recommendation/GenerateRecommendations'
import type { GenerateRecommendationsResult } from '../recommendation/GenerateRecommendationsResult'
import type { PredictionService } from './PredictionService'

export class DefaultPredictionService implements PredictionService {
  constructor(
    private readonly generateRecommendations: GenerateRecommendations
  ) {}

  execute(draws: readonly Draw[]): GenerateRecommendationsResult {
    return this.generateRecommendations.execute(draws)
  }
}
