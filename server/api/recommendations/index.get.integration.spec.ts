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
        value: 32,
        frequency: 3,
        currentGap: 29,
        lastSeen: 29,
        pairScore: 2,
        recommendationScore: 34
      },
      {
        value: 33,
        frequency: 3,
        currentGap: 26,
        lastSeen: 26,
        pairScore: 3,
        recommendationScore: 32
      },
      {
        value: 1,
        frequency: 6,
        currentGap: 22,
        lastSeen: 22,
        pairScore: 4,
        recommendationScore: 32
      },
      {
        value: 18,
        frequency: 6,
        currentGap: 21,
        lastSeen: 21,
        pairScore: 3,
        recommendationScore: 30
      },
      {
        value: 2,
        frequency: 5,
        currentGap: 21,
        lastSeen: 21,
        pairScore: 2,
        recommendationScore: 28
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
