import { describe, expect, it } from 'vitest'

import { calculateWeightedScore } from './WeightedScoreCalculator'
import { calculateRecommendationScore } from './calculateRecommendationScore'

describe('calculateWeightedScore', () => {
  it('calculates a weighted recommendation score', () => {
    const score = calculateWeightedScore({
      frequency: 13,
      currentGap: 1,
      pairScore: 6,
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      }
    })

    expect(score).toBe(20)
  })

  it('applies different weights to each score component', () => {
    const score = calculateWeightedScore({
      frequency: 100,
      currentGap: 20,
      pairScore: 10,
      weights: {
        frequency: 2,
        currentGap: 0.5,
        pairScore: 3
      }
    })

    expect(score).toBe(240)
  })

  it('supports zero weight for a score component', () => {
    const score = calculateWeightedScore({
      frequency: 100,
      currentGap: 20,
      pairScore: 10,
      weights: {
        frequency: 1,
        currentGap: 0,
        pairScore: 1
      }
    })

    expect(score).toBe(110)
  })

  it('supports decimal weights', () => {
    const score = calculateWeightedScore({
      frequency: 10,
      currentGap: 4,
      pairScore: 8,
      weights: {
        frequency: 1.5,
        currentGap: 0.5,
        pairScore: 2
      }
    })

    expect(score).toBe(33)
  })

  it('matches the current recommendation score when all weights are 1', () => {
    const score = calculateWeightedScore({
      frequency: 13,
      currentGap: 1,
      pairScore: 6,
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      }
    })

    expect(score).toBe(calculateRecommendationScore(13, 1, 6))
  })
})
