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
        currentGap: 39,
        lastSeen: 39,
        pairScore: 2,
        recommendationScore: 48
      },
      {
        value: 44,
        frequency: 8,
        currentGap: 33,
        lastSeen: 33,
        pairScore: 4,
        recommendationScore: 45
      },
      {
        value: 13,
        frequency: 6,
        currentGap: 30,
        lastSeen: 30,
        pairScore: 3,
        recommendationScore: 39
      },
      {
        value: 8,
        frequency: 7,
        currentGap: 26,
        lastSeen: 26,
        pairScore: 5,
        recommendationScore: 38
      },
      {
        value: 37,
        frequency: 13,
        currentGap: 13,
        lastSeen: 13,
        pairScore: 8,
        recommendationScore: 34
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
