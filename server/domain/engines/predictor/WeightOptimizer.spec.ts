import { describe, expect, it } from 'vitest'

import type { WeightOptimizationResult } from './WeightOptimizationResult'
import { optimizeWeights } from './WeightOptimizer'

describe('optimizeWeights', () => {
  it('selects the best weight optimization result', () => {
    const results: WeightOptimizationResult[] = [
      {
        weights: {
          frequency: 1,
          currentGap: 1,
          pairScore: 1
        },
        metrics: {
          totalPredictions: 54,
          totalMatches: 33,
          averageMatches: 0.61,
          predictionsWithMatches: 26,
          hitRate: 0.48,
          distribution: [28, 20, 5, 1, 0, 0]
        }
      },
      {
        weights: {
          frequency: 1,
          currentGap: 3,
          pairScore: 2
        },
        metrics: {
          totalPredictions: 54,
          totalMatches: 40,
          averageMatches: 0.74,
          predictionsWithMatches: 30,
          hitRate: 0.56,
          distribution: [24, 20, 8, 2, 0, 0]
        }
      },
      {
        weights: {
          frequency: 2,
          currentGap: 1,
          pairScore: 1
        },
        metrics: {
          totalPredictions: 54,
          totalMatches: 36,
          averageMatches: 0.67,
          predictionsWithMatches: 28,
          hitRate: 0.52,
          distribution: [26, 20, 7, 1, 0, 0]
        }
      }
    ]

    const result = optimizeWeights(results)

    expect(result).toBe(results[1])
  })

  it('keeps the first result when the best hit rates are equal', () => {
    const results: WeightOptimizationResult[] = [
      {
        weights: {
          frequency: 1,
          currentGap: 1,
          pairScore: 1
        },
        metrics: {
          totalPredictions: 54,
          totalMatches: 33,
          averageMatches: 0.61,
          predictionsWithMatches: 26,
          hitRate: 0.56,
          distribution: [28, 20, 5, 1, 0, 0]
        }
      },
      {
        weights: {
          frequency: 2,
          currentGap: 2,
          pairScore: 2
        },
        metrics: {
          totalPredictions: 54,
          totalMatches: 40,
          averageMatches: 0.74,
          predictionsWithMatches: 30,
          hitRate: 0.56,
          distribution: [24, 20, 8, 2, 0, 0]
        }
      }
    ]

    const result = optimizeWeights(results)

    expect(result).toBe(results[0])
  })

  it('returns undefined when there are no optimization results', () => {
    const result = optimizeWeights([])

    expect(result).toBeUndefined()
  })
})
