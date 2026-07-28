import { describe, expect, it } from 'vitest'

import { sampleStatisticsResult } from '@server/test/fixtures/sampleStatisticsResult'

import { SimpleRecommendationEngine } from './SimpleRecommendationEngine'

describe('SimpleRecommendationEngine', () => {
  it('returns five recommended numbers', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(sampleStatisticsResult)

    expect(recommendation.numbers).toHaveLength(5)
  })

  it('returns the most frequent numbers', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(sampleStatisticsResult)

    expect(recommendation.numbers).toEqual([17, 37, 4, 6, 8])
  })
})
