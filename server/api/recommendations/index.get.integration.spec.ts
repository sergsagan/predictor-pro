import { describe, expect, it } from 'vitest'

import type { H3Event } from 'h3'

describe('GET /api/recommendations - integration', () => {
  it('generates deterministic recommendations from real dependencies', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.recommendations).toHaveLength(5)

    const actual = response.recommendations.map(({ analysis }) => ({
      value: analysis.value,
      frequency: analysis.frequency,
      currentGap: analysis.currentGap,
      lastSeen: analysis.lastSeen,
      pairScore: analysis.pairScore,
      recommendationScore: analysis.recommendationScore
    }))

    const expected = [
      {
        value: 1,
        frequency: 7,
        currentGap: 40,
        lastSeen: 40,
        pairScore: 1,
        recommendationScore: 48
      },
      {
        value: 44,
        frequency: 8,
        currentGap: 34,
        lastSeen: 34,
        pairScore: 3,
        recommendationScore: 45
      },
      {
        value: 13,
        frequency: 6,
        currentGap: 31,
        lastSeen: 31,
        pairScore: 1,
        recommendationScore: 38
      },
      {
        value: 8,
        frequency: 7,
        currentGap: 27,
        lastSeen: 27,
        pairScore: 3,
        recommendationScore: 37
      },
      {
        value: 40,
        frequency: 7,
        currentGap: 22,
        lastSeen: 22,
        pairScore: 2,
        recommendationScore: 31
      }
    ]

    actual.forEach((item, index) => {
      const expectedItem = expected[index]

      if (!expectedItem) {
        throw new Error(`Missing expected item at index ${index}`)
      }
    })

    expect(actual).toEqual(expected)

    for (const recommendation of response.recommendations) {
      expect(recommendation.explanation.value).toBe(
        recommendation.analysis.value
      )

      expect(recommendation.explanation.lines.length).toBeGreaterThan(0)
    }
  })
})
