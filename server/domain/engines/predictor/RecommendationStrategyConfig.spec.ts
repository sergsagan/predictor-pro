import { describe, expect, it } from 'vitest'

import type { RecommendationStrategyConfig } from './RecommendationStrategyConfig'

describe('RecommendationStrategyConfig', () => {
  it('supports strategy configuration with weights', () => {
    const config: RecommendationStrategyConfig = {
      strategy: 'simple',
      weights: {
        frequency: 1,
        currentGap: 2,
        pairScore: 3
      }
    }

    expect(config.strategy).toBe('simple')
    expect(config.weights).toEqual({
      frequency: 1,
      currentGap: 2,
      pairScore: 3
    })
  })

  it('supports gap-focused strategy configuration', () => {
    const config: RecommendationStrategyConfig = {
      strategy: 'gap-focused',
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      }
    }

    expect(config.strategy).toBe('gap-focused')
  })
})
