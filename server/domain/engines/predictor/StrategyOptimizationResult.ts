import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'

import type { RecommendationStrategy } from './RecommendationStrategy'
import type { RecommendationWeights } from './RecommendationWeights'

export type StrategyOptimizationResult = Readonly<{
  strategy: RecommendationStrategy
  weights: RecommendationWeights
  metrics: AccuracyMetrics
}>
