import { describe, expect, it } from 'vitest'

import type { H3Event } from 'h3'

describe('GET /api/recommendations - integration', () => {
  it('generates deterministic recommendations from real dependencies', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.recommendations).toHaveLength(5)

    expect(
      response.recommendations.map(({ analysis }) => ({
        value: analysis.value,
        frequency: analysis.frequency,
        currentGap: analysis.currentGap,
        lastSeen: analysis.lastSeen,
        pairScore: analysis.pairScore,
        recommendationScore: analysis.recommendationScore
      }))
    ).toEqual([
      {
        value: 17,
        frequency: 13,
        currentGap: 0,
        lastSeen: 0,
        pairScore: 6,
        recommendationScore: 19
      },
      {
        value: 37,
        frequency: 10,
        currentGap: 4,
        lastSeen: 4,
        pairScore: 8,
        recommendationScore: 22
      },
      {
        value: 47,
        frequency: 9,
        currentGap: 5,
        lastSeen: 5,
        pairScore: 8,
        recommendationScore: 22
      },
      {
        value: 23,
        frequency: 8,
        currentGap: 17,
        lastSeen: 17,
        pairScore: 7,
        recommendationScore: 32
      },
      {
        value: 44,
        frequency: 8,
        currentGap: 10,
        lastSeen: 10,
        pairScore: 7,
        recommendationScore: 25
      }
    ])

    for (const recommendation of response.recommendations) {
      expect(recommendation.explanation.value).toBe(
        recommendation.analysis.value
      )

      expect(recommendation.explanation.lines.length).toBeGreaterThan(0)
    }
  })
})
