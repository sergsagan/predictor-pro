import type { RecommendationStrategy } from './RecommendationStrategy'
import type { RecommendationWeights } from './RecommendationWeights'

export type RecommendationStrategyConfig = Readonly<{
  strategy: RecommendationStrategy
  weights: RecommendationWeights
}>
