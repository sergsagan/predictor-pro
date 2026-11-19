import type { RecommendationWeights } from '../../recommendation/config/RecommendationWeights'
import type { WeightOptimizationResult } from './WeightOptimizationResult'

import { optimizeWeights } from './WeightOptimizer'

export type AdaptiveWeightSelectionReason =
  | 'highest-hit-rate'
  | 'insufficient-sample'
  | 'no-results'
  | 'invalid-profile'
  | 'not-applicable'

export type AdaptiveWeightSelection = Readonly<{
  weights: RecommendationWeights
  reason: AdaptiveWeightSelectionReason
}>

export const DEFAULT_ADAPTIVE_WEIGHTS: RecommendationWeights = {
  frequency: 1,
  currentGap: 1,
  pairScore: 1
}

export function normalizeAdaptiveWeights(
  weights: RecommendationWeights
): RecommendationWeights {
  const values = [weights.frequency, weights.currentGap, weights.pairScore]

  if (!values.every((value) => Number.isFinite(value) && value > 0)) {
    return DEFAULT_ADAPTIVE_WEIGHTS
  }

  const maximum = Math.max(...values)

  return {
    frequency: weights.frequency / maximum,
    currentGap: weights.currentGap / maximum,
    pairScore: weights.pairScore / maximum
  }
}

export function selectAdaptiveWeightProfileWithReason(
  results: readonly WeightOptimizationResult[],
  minimumPredictions = 30
): AdaptiveWeightSelection {
  if (results.length === 0) {
    return {
      weights: DEFAULT_ADAPTIVE_WEIGHTS,
      reason: 'no-results'
    }
  }

  const sufficientlySampled = results.filter(
    ({ metrics }) => metrics.totalPredictions >= minimumPredictions
  )

  if (sufficientlySampled.length === 0) {
    return {
      weights: DEFAULT_ADAPTIVE_WEIGHTS,
      reason: 'insufficient-sample'
    }
  }

  const validResults = sufficientlySampled.filter(({ weights }) =>
    [weights.frequency, weights.currentGap, weights.pairScore].every(
      (value) => Number.isFinite(value) && value > 0
    )
  )

  if (validResults.length === 0) {
    return {
      weights: DEFAULT_ADAPTIVE_WEIGHTS,
      reason: 'invalid-profile'
    }
  }

  const best = optimizeWeights(validResults)

  if (!best) {
    return {
      weights: DEFAULT_ADAPTIVE_WEIGHTS,
      reason: 'no-results'
    }
  }

  return {
    weights: normalizeAdaptiveWeights(best.weights),
    reason: 'highest-hit-rate'
  }
}

export function selectAdaptiveWeightProfile(
  results: readonly WeightOptimizationResult[],
  minimumPredictions = 30
): RecommendationWeights {
  return selectAdaptiveWeightProfileWithReason(results, minimumPredictions)
    .weights
}
