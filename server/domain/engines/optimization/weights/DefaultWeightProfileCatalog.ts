import type { RecommendationStrategyConfig } from '../../recommendation/config/RecommendationStrategyConfig'

import { generateParameterConfigurations } from '../parameters/ParameterSearch'

export function createDefaultWeightProfiles(): readonly RecommendationStrategyConfig[] {
  return generateParameterConfigurations({
    strategy: 'simple',
    frequency: [1, 2],
    currentGap: [1, 2],
    pairScore: [1, 2]
  })
}
