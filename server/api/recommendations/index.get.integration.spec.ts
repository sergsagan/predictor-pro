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
        value: 17,
        frequency: 13,
        currentGap: 1,
        lastSeen: 1,
        pairScore: 6,
        recommendationScore: 20
      },
      {
        value: 37,
        frequency: 10,
        currentGap: 5,
        lastSeen: 5,
        pairScore: 8,
        recommendationScore: 23
      },
      {
        value: 47,
        frequency: 9,
        currentGap: 6,
        lastSeen: 6,
        pairScore: 8,
        recommendationScore: 23
      },
      {
        value: 23,
        frequency: 8,
        currentGap: 18,
        lastSeen: 18,
        pairScore: 7,
        recommendationScore: 33
      },
      {
        value: 44,
        frequency: 8,
        currentGap: 11,
        lastSeen: 11,
        pairScore: 7,
        recommendationScore: 26
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
