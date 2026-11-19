import { describe, expect, it } from 'vitest'

import type { RecommendationWeights } from '../../recommendation/config/RecommendationWeights'
import type { WeightOptimizationResult } from './WeightOptimizationResult'

import { selectAdaptiveWeightProfile } from './AdaptiveWeightSelector'

const defaultWeights: RecommendationWeights = {
  frequency: 1,
  currentGap: 1,
  pairScore: 1
}

const frequencyFocusedWeights: RecommendationWeights = {
  frequency: 2,
  currentGap: 1,
  pairScore: 1
}

function createResult(
  weights: RecommendationWeights,
  hitRate: number,
  totalPredictions = 40
): WeightOptimizationResult {
  const predictionsWithMatches = Math.round(hitRate * totalPredictions)
  const totalMatches = predictionsWithMatches
  const actualHitRate = predictionsWithMatches / totalPredictions

  return {
    weights,
    metrics: {
      totalPredictions,
      totalMatches,
      averageMatches: totalMatches / totalPredictions,
      predictionsWithMatches,
      hitRate: actualHitRate,
      distribution: {
        0: totalPredictions - predictionsWithMatches,
        1: predictionsWithMatches,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    }
  }
}

describe('selectAdaptiveWeightProfile', () => {
  it('selects the profile with the highest hit rate', () => {
    const results = [
      createResult(defaultWeights, 0.4),
      createResult(frequencyFocusedWeights, 0.6)
    ]

    const selected = selectAdaptiveWeightProfile(results)

    expect(selected).toEqual({
      frequency: 1,
      currentGap: 0.5,
      pairScore: 0.5
    })
  })

  it('returns default weights when no optimization results exist', () => {
    const selected = selectAdaptiveWeightProfile([])

    expect(selected).toEqual(defaultWeights)
  })

  it('returns default weights when the sample is insufficient', () => {
    const results = [createResult(frequencyFocusedWeights, 0.9, 29)]

    const selected = selectAdaptiveWeightProfile(results)

    expect(selected).toEqual(defaultWeights)
  })

  it('keeps the first profile when hit rates are equal', () => {
    const results = [
      createResult(defaultWeights, 0.5),
      createResult(frequencyFocusedWeights, 0.5)
    ]

    const selected = selectAdaptiveWeightProfile(results)

    expect(selected).toEqual(defaultWeights)
  })

  it('selects the best profile when the minimum sample is reached', () => {
    const results = [
      createResult(defaultWeights, 0.4, 30),
      createResult(frequencyFocusedWeights, 0.6, 30)
    ]

    const selected = selectAdaptiveWeightProfile(results)

    expect(selected).toEqual({
      frequency: 1,
      currentGap: 0.5,
      pairScore: 0.5
    })
  })
})
