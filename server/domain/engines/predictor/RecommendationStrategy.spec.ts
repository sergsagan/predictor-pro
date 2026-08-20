import { describe, expect, it } from 'vitest'

import type { RecommendationStrategy } from './RecommendationStrategy'

describe('RecommendationStrategy', () => {
  it('supports simple strategy', () => {
    const strategy: RecommendationStrategy = 'simple'

    expect(strategy).toBe('simple')
  })

  it('supports gap-focused strategy', () => {
    const strategy: RecommendationStrategy = 'gap-focused'

    expect(strategy).toBe('gap-focused')
  })
})
