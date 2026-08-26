import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'
import type { RecommendationWeights } from '../../config/RecommendationWeights'

export type WeightOptimizationResult = Readonly<{
  weights: RecommendationWeights
  metrics: AccuracyMetrics
}>
