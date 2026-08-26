import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'

import type { RecommendationStrategy } from '../../config/RecommendationStrategy'
import type { RecommendationWeights } from '../../config/RecommendationWeights'

export type StrategyOptimizationResult = Readonly<{
  strategy: RecommendationStrategy
  weights: RecommendationWeights
  metrics: AccuracyMetrics
}>
