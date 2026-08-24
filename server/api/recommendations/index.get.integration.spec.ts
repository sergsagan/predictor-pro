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
        value: 15,
        frequency: 4,
        currentGap: 25,
        lastSeen: 25,
        pairScore: 2,
        recommendationScore: 31
      },
      {
        value: 7,
        frequency: 3,
        currentGap: 25,
        lastSeen: 25,
        pairScore: 2,
        recommendationScore: 30
      },
      {
        value: 23,
        frequency: 8,
        currentGap: 18,
        lastSeen: 18,
        pairScore: 3,
        recommendationScore: 29
      },
      {
        value: 32,
        frequency: 3,
        currentGap: 24,
        lastSeen: 24,
        pairScore: 1,
        recommendationScore: 28
      },
      {
        value: 33,
        frequency: 3,
        currentGap: 21,
        lastSeen: 21,
        pairScore: 2,
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
