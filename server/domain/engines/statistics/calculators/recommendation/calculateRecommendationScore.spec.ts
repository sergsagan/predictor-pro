import { describe, expect, it } from 'vitest'

import { calculateRecommendationScore } from './calculateRecommendationScore'

describe('calculateRecommendationScore', () => {
  it('returns the sum of all scores', () => {
    const score = calculateRecommendationScore(100, 20, 10)

    expect(score).toBe(130)
  })

  it('returns zero when all scores are zero', () => {
    const score = calculateRecommendationScore(0, 0, 0)

    expect(score).toBe(0)
  })

  it('supports negative values', () => {
    const score = calculateRecommendationScore(100, -20, 10)

    expect(score).toBe(90)
  })
})
