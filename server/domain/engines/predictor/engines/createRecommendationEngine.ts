import type { RecommendationEngine } from './RecommendationEngine'
import type { RecommendationStrategyConfig } from '../config/RecommendationStrategyConfig'

import { SimpleRecommendationEngine } from './SimpleRecommendationEngine'
import { GapFocusedRecommendationEngine } from './GapFocusedRecommendationEngine'

export function createRecommendationEngine(
  config: RecommendationStrategyConfig
): RecommendationEngine {
  switch (config.strategy) {
    case 'simple':
      return new SimpleRecommendationEngine(config.weights)

    case 'gap-focused':
      return new GapFocusedRecommendationEngine(config.weights)
  }
}
