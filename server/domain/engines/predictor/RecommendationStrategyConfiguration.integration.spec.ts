import { describe, expect, it } from 'vitest'

import { createRecommendationEngine } from './createRecommendationEngine'

describe('Recommendation Strategy Configuration integration', () => {
  it('creates a configured simple strategy and applies its weights', () => {
    const engine = createRecommendationEngine({
      strategy: 'simple',
      weights: {
        frequency: 2,
        currentGap: 3,
        pairScore: 4
      }
    })

    const recommendation = engine.recommend({
      frequency: new Map([
        [1, 10],
        [2, 5]
      ]),

      currentGap: new Map([
        [1, 5],
        [2, 10]
      ]),

      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers).toHaveLength(2)

    expect(recommendation.numbers).toMatchObject([
      {
        value: 2,
        frequency: 5,
        currentGap: 10,
        pairScore: 0,
        score: 40
      },
      {
        value: 1,
        frequency: 10,
        currentGap: 5,
        pairScore: 0,
        score: 35
      }
    ])
  })

  it('creates a configured gap-focused strategy', () => {
    const engine = createRecommendationEngine({
      strategy: 'gap-focused',
      weights: {
        frequency: 2,
        currentGap: 3,
        pairScore: 4
      }
    })

    const recommendation = engine.recommend({
      frequency: new Map([
        [1, 10],
        [2, 5]
      ]),

      currentGap: new Map([
        [1, 5],
        [2, 10]
      ]),

      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers).toHaveLength(2)

    expect(recommendation.numbers).toMatchObject([
      {
        value: 2,
        frequency: 5,
        currentGap: 10,
        pairScore: 0,
        score: 40
      },
      {
        value: 1,
        frequency: 10,
        currentGap: 5,
        pairScore: 0,
        score: 35
      }
    ])
  })
})
