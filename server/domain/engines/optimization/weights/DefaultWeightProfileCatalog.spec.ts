import { describe, expect, it } from 'vitest'

import type { RecommendationStrategyConfig } from '../../recommendation/config/RecommendationStrategyConfig'

import { createDefaultWeightProfiles } from './DefaultWeightProfileCatalog'

describe('createDefaultWeightProfiles', () => {
  it('generates all candidate weight profiles for simple strategy', () => {
    const profiles: readonly RecommendationStrategyConfig[] =
      createDefaultWeightProfiles()

    expect(profiles).toHaveLength(8)

    expect(profiles[0]).toEqual({
      strategy: 'simple',
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      }
    })

    expect(profiles.every((profile) => profile.strategy === 'simple')).toBe(
      true
    )

    const uniqueProfiles = new Set(
      profiles.map(
        ({ weights }) =>
          `${weights.frequency}:${weights.currentGap}:${weights.pairScore}`
      )
    )

    expect(uniqueProfiles.size).toBe(8)
  })
})
