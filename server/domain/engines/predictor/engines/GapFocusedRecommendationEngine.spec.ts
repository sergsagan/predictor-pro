import { describe, expect, it } from 'vitest'

import { GapFocusedRecommendationEngine } from './GapFocusedRecommendationEngine'

describe('GapFocusedRecommendationEngine', () => {
  it('prioritizes higher current gap over frequency', () => {
    const engine = new GapFocusedRecommendationEngine()

    const recommendation = engine.recommend({
      frequency: new Map([
        [1, 100],
        [2, 10],
        [3, 9],
        [4, 8],
        [5, 7],
        [6, 6]
      ]),

      currentGap: new Map([
        [1, 1],
        [2, 20],
        [3, 15],
        [4, 10],
        [5, 5],
        [6, 2]
      ]),

      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers.map((number) => number.value)).toEqual([
      2, 3, 4, 5, 6
    ])
  })

  it('uses frequency as a tie-breaker when current gap is equal', () => {
    const engine = new GapFocusedRecommendationEngine()

    const recommendation = engine.recommend({
      frequency: new Map([
        [1, 10],
        [2, 20],
        [3, 15],
        [4, 8],
        [5, 7],
        [6, 6]
      ]),

      currentGap: new Map([
        [1, 10],
        [2, 10],
        [3, 10],
        [4, 5],
        [5, 4],
        [6, 3]
      ]),

      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers.map((number) => number.value)).toEqual([
      2, 3, 1, 4, 5
    ])
  })

  it('prefers lower number when current gap and frequency are equal', () => {
    const engine = new GapFocusedRecommendationEngine()

    const recommendation = engine.recommend({
      frequency: new Map([
        [1, 10],
        [2, 10],
        [3, 9],
        [4, 8],
        [5, 7],
        [6, 6]
      ]),

      currentGap: new Map([
        [1, 10],
        [2, 10],
        [3, 5],
        [4, 4],
        [5, 3],
        [6, 2]
      ]),

      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(
      recommendation.numbers.slice(0, 2).map((number) => number.value)
    ).toEqual([1, 2])
  })
})
