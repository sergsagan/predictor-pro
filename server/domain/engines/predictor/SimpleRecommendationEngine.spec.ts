import { describe, expect, it } from 'vitest'

import { sampleStatisticsResult } from '@server/test/fixtures/sampleStatisticsResult'
import { sampleCurrentGapRecommendationStatisticsResult } from '@server/test/fixtures/sampleCurrentGapRecommendationStatisticsResult'

import { SimpleRecommendationEngine } from './SimpleRecommendationEngine'
import { sampleEqualRecommendationStatisticsResult } from '@server/test/fixtures/sampleEqualRecommendationStatisticsResult'
import { samplePairFrequencyRecommendationStatisticsResult } from '@server/test/fixtures/samplePairFrequencyRecommendationStatisticsResult'
import { createPairKey } from '../statistics/calculators/pairFrequency/createPairKey'

describe('SimpleRecommendationEngine', () => {
  it('returns five recommended numbers', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(sampleStatisticsResult)

    expect(recommendation.numbers).toHaveLength(5)
  })

  it('returns the best recommended numbers', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(sampleStatisticsResult)

    expect(recommendation.numbers.map((number) => number.value)).toEqual([
      17, 37, 22, 41, 50
    ])
  })

  it('prefers higher current gap when frequency is equal', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(
      sampleCurrentGapRecommendationStatisticsResult
    )

    expect(
      recommendation.numbers.slice(0, 2).map((number) => number.value)
    ).toEqual([2, 1])
  })

  it('prefers lower number when frequency and current gap are equal', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(
      sampleEqualRecommendationStatisticsResult
    )

    expect(
      recommendation.numbers.slice(0, 2).map((number) => number.value)
    ).toEqual([1, 2])
  })

  it('prefers candidate with higher pair frequency when frequency and current gap are equal', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(
      samplePairFrequencyRecommendationStatisticsResult
    )

    expect(recommendation.numbers.map((number) => number.value)).toEqual([
      3, 4, 6, 5
    ])
  })

  it('ignores pair frequency when no numbers have been selected', () => {
    const engine = new SimpleRecommendationEngine()
    const recommendation = engine.recommend({
      frequency: new Map([
        [5, 10],
        [6, 10]
      ]),

      currentGap: new Map([
        [5, 5],
        [6, 5]
      ]),

      pairFrequency: new Map([
        [createPairKey(5, 99), 1000],
        [createPairKey(6, 99), 1]
      ]),

      lastSeen: new Map(),
      gap: new Map()
    })

    expect(recommendation.numbers.map((number) => number.value)).toEqual([5, 6])
  })

  it('treats missing pair frequencies as zero', () => {
    const engine = new SimpleRecommendationEngine()
    const recommendation = engine.recommend({
      frequency: new Map([
        [3, 20],
        [4, 19],
        [5, 10],
        [6, 10]
      ]),

      currentGap: new Map([
        [3, 1],
        [4, 1],
        [5, 5],
        [6, 5]
      ]),

      pairFrequency: new Map([[createPairKey(3, 6), 10]]),

      lastSeen: new Map(),
      gap: new Map()
    })

    expect(recommendation.numbers.map((number) => number.value)).toEqual([
      3, 4, 6, 5
    ])
  })

  it('uses sum of pair frequencies for all selected numbers', () => {
    const engine = new SimpleRecommendationEngine()
    const recommendation = engine.recommend({
      frequency: new Map([
        [3, 20],
        [4, 19],
        [5, 10],
        [6, 10]
      ]),

      currentGap: new Map([
        [3, 1],
        [4, 1],
        [5, 5],
        [6, 5]
      ]),

      pairFrequency: new Map([
        [createPairKey(3, 5), 1],
        [createPairKey(4, 5), 1],

        [createPairKey(3, 6), 2],
        [createPairKey(4, 6), 1]
      ]),

      lastSeen: new Map(),
      gap: new Map()
    })

    expect(recommendation.numbers.map((n) => n.value)).toEqual([3, 4, 6, 5])
  })

  it('returns recommendation score', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(
      samplePairFrequencyRecommendationStatisticsResult
    )

    expect(recommendation.numbers[0]).toMatchObject({
      value: 3,
      score: expect.any(Number)
    })
  })

  it('calculates recommendation score', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(
      samplePairFrequencyRecommendationStatisticsResult
    )

    expect(recommendation.numbers[1]?.score).toBe(20)
  })
})
