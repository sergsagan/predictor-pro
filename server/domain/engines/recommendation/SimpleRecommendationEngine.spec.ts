import { describe, expect, it } from 'vitest'

import { sampleStatisticsResult } from '@server/test/fixtures/sampleStatisticsResult'
import { sampleCurrentGapRecommendationStatisticsResult } from '@server/test/fixtures/sampleCurrentGapRecommendationStatisticsResult'

import { SimpleRecommendationEngine } from './SimpleRecommendationEngine'
import { sampleEqualRecommendationStatisticsResult } from '@server/test/fixtures/sampleEqualRecommendationStatisticsResult'
import { samplePairFrequencyRecommendationStatisticsResult } from '@server/test/fixtures/samplePairFrequencyRecommendationStatisticsResult'
import { createPairKey } from '../statistics/calculators/pairFrequency/createPairKey'
import type { StatisticsResult } from '../statistics/StatisticsResult'
import { calculateWeightedScore } from '../statistics/calculators/recommendation/WeightedScoreCalculator'

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

  it('prefers candidate with higher pair score when base scores are equal', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(
      samplePairFrequencyRecommendationStatisticsResult
    )

    expect(recommendation.numbers.map((number) => number.value)).toEqual([
      3, 5, 4
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
        [1, 10],
        [2, 10],
        [3, 20]
      ]),

      currentGap: new Map([
        [1, 5],
        [2, 5],
        [3, 1]
      ]),

      pairFrequency: new Map([[createPairKey(3, 2), 10]]),

      lastSeen: new Map(),
      gap: new Map()
    })

    expect(recommendation.numbers.map((number) => number.value)).toEqual([
      3, 2, 1
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

  it('calculates weighted recommendation score', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend(
      samplePairFrequencyRecommendationStatisticsResult
    )

    const number = recommendation.numbers[1]

    expect(number).toBeDefined()

    expect(number?.score).toBe(
      calculateWeightedScore({
        frequency: number!.frequency,
        currentGap: number!.currentGap,
        pairScore: number!.pairScore,
        weights: {
          frequency: 1,
          currentGap: 1,
          pairScore: 1
        }
      })
    )
  })

  it('includes last seen information', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend({
      frequency: new Map([[17, 10]]),

      currentGap: new Map([[17, 8]]),

      lastSeen: new Map([[17, 123]]),

      gap: new Map(),

      pairFrequency: new Map()
    })

    expect(recommendation.numbers[0]).toMatchObject({
      value: 17,
      lastSeen: 123
    })
  })

  it('uses weighted score calculation', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend({
      frequency: new Map([[17, 10]]),
      currentGap: new Map([[17, 8]]),
      lastSeen: new Map([[17, 123]]),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers[0]?.score).toBe(18)
  })

  it('uses configurable weights', () => {
    const engine = new SimpleRecommendationEngine({
      frequency: 2,
      currentGap: 0.5,
      pairScore: 3
    })

    const recommendation = engine.recommend({
      frequency: new Map([[17, 10]]),
      currentGap: new Map([[17, 4]]),
      lastSeen: new Map([[17, 123]]),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers[0]?.score).toBe(22)
  })

  it('uses default weights when no configuration is provided', () => {
    const engine = new SimpleRecommendationEngine()

    const recommendation = engine.recommend({
      frequency: new Map([[17, 10]]),
      currentGap: new Map([[17, 4]]),
      lastSeen: new Map([[17, 123]]),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers[0]?.score).toBe(14)
  })

  it('allows increasing the frequency weight independently', () => {
    const engine = new SimpleRecommendationEngine({
      frequency: 2,
      currentGap: 1,
      pairScore: 1
    })

    const recommendation = engine.recommend({
      frequency: new Map([[17, 10]]),
      currentGap: new Map([[17, 4]]),
      lastSeen: new Map([[17, 123]]),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers[0]?.score).toBe(24)
  })

  it('changes recommendation order based on configured weights', () => {
    const statistics: StatisticsResult = {
      frequency: new Map([
        [1, 10],
        [2, 5]
      ]),
      currentGap: new Map([
        [1, 1],
        [2, 10]
      ]),
      lastSeen: new Map([
        [1, 1],
        [2, 10]
      ]),
      pairFrequency: new Map(),
      gap: new Map()
    }

    const frequencyFocusedEngine = new SimpleRecommendationEngine({
      frequency: 2,
      currentGap: 1,
      pairScore: 1
    })

    const gapFocusedEngine = new SimpleRecommendationEngine({
      frequency: 1,
      currentGap: 2,
      pairScore: 1
    })

    const frequencyFocusedRecommendation =
      frequencyFocusedEngine.recommend(statistics)

    const gapFocusedRecommendation = gapFocusedEngine.recommend(statistics)

    expect(frequencyFocusedRecommendation.numbers[0]?.value).toBe(1)

    expect(gapFocusedRecommendation.numbers[0]?.value).toBe(2)
  })

  it('selects different numbers when configured weights favor different metrics', () => {
    const statistics: StatisticsResult = {
      frequency: new Map([
        [1, 20],
        [2, 19],
        [3, 18],
        [4, 17],
        [5, 16],
        [6, 1]
      ]),

      currentGap: new Map([
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
        [6, 30]
      ]),

      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    }

    const frequencyFocusedEngine = new SimpleRecommendationEngine({
      frequency: 2,
      currentGap: 1,
      pairScore: 1
    })

    const gapFocusedEngine = new SimpleRecommendationEngine({
      frequency: 1,
      currentGap: 2,
      pairScore: 1
    })

    const frequencyFocused = frequencyFocusedEngine.recommend(statistics)

    const gapFocused = gapFocusedEngine.recommend(statistics)

    expect(frequencyFocused.numbers.map((number) => number.value)).toEqual([
      1, 2, 3, 4, 5
    ])

    expect(gapFocused.numbers.map((number) => number.value)).toEqual([
      6, 1, 2, 3, 4
    ])
  })
})
