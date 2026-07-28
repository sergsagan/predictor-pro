import { describe, expect, it } from 'vitest'

import { sampleStatisticsResult } from '@server/test/fixtures/sampleStatisticsResult'
import { sampleCurrentGapRecommendationStatisticsResult } from '@server/test/fixtures/sampleCurrentGapRecommendationStatisticsResult'

import { SimpleRecommendationEngine } from './SimpleRecommendationEngine'
import { sampleEqualRecommendationStatisticsResult } from '@server/test/fixtures/sampleEqualRecommendationStatisticsResult'

describe('SimpleRecommendationEngine', () => {
  it('returns five recommended numbers', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(sampleStatisticsResult)

    expect(recommendation.numbers).toHaveLength(5)
  })

  it('returns the best recommended numbers', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(sampleStatisticsResult)

    expect(recommendation.numbers).toEqual([17, 37, 22, 41, 50])
  })

  it('prefers higher current gap when frequency is equal', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(
      sampleCurrentGapRecommendationStatisticsResult
    )

    expect(recommendation.numbers.slice(0, 2)).toEqual([2, 1])
  })

  it('prefers lower number when frequency and current gap are equal', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(
      sampleEqualRecommendationStatisticsResult
    )

    expect(recommendation.numbers.slice(0, 2)).toEqual([1, 2])
  })
})
