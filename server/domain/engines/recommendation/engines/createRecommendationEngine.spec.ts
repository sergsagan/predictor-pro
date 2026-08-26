import { describe, expect, it } from 'vitest'

import { SimpleRecommendationEngine } from './SimpleRecommendationEngine'
import { GapFocusedRecommendationEngine } from './GapFocusedRecommendationEngine'
import { createRecommendationEngine } from './createRecommendationEngine'

describe('createRecommendationEngine', () => {
  it('creates a simple recommendation engine', () => {
    const engine = createRecommendationEngine({
      strategy: 'simple',
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      }
    })

    expect(engine).toBeInstanceOf(SimpleRecommendationEngine)
  })

  it('creates a gap-focused recommendation engine', () => {
    const engine = createRecommendationEngine({
      strategy: 'gap-focused',
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      }
    })

    expect(engine).toBeInstanceOf(GapFocusedRecommendationEngine)
  })

  it('creates an engine from strategy configuration', () => {
    const engine = createRecommendationEngine({
      strategy: 'simple',
      weights: {
        frequency: 1,
        currentGap: 2,
        pairScore: 3
      }
    })

    expect(engine).toBeInstanceOf(SimpleRecommendationEngine)
  })

  it('passes configured weights to the recommendation engine', () => {
    const engine = createRecommendationEngine({
      strategy: 'simple',
      weights: {
        frequency: 2,
        currentGap: 3,
        pairScore: 4
      }
    })

    expect(engine).toBeInstanceOf(SimpleRecommendationEngine)
  })

  it('applies configured weights to recommendation scores', () => {
    const engine = createRecommendationEngine({
      strategy: 'simple',
      weights: {
        frequency: 2,
        currentGap: 3,
        pairScore: 4
      }
    })

    const recommendation = engine.recommend({
      frequency: new Map([[1, 10]]),
      currentGap: new Map([[1, 5]]),
      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers[0]?.score).toBe(35)
  })

  it('applies configured weights to gap-focused recommendation scores', () => {
    const engine = createRecommendationEngine({
      strategy: 'gap-focused',
      weights: {
        frequency: 2,
        currentGap: 3,
        pairScore: 4
      }
    })

    const recommendation = engine.recommend({
      frequency: new Map([[1, 10]]),
      currentGap: new Map([[1, 5]]),
      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(recommendation.numbers[0]?.score).toBe(35)
  })
})
