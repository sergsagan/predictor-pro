import { describe, expect, it } from 'vitest'

import type { H3Event } from 'h3'

describe('GET /api/predictions/statistics - integration', () => {
  it('returns consistent prediction accuracy and performance trends', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.accuracy).toEqual(
      expect.objectContaining({
        totalPredictions: expect.any(Number),
        totalMatches: expect.any(Number),
        averageMatches: expect.any(Number),
        predictionsWithMatches: expect.any(Number),
        hitRate: expect.any(Number),
        distribution: expect.any(Object)
      })
    )

    expect(response.trends).toEqual(expect.any(Array))

    expect(response.trends).toHaveLength(response.accuracy.totalPredictions)

    const distributionTotal = Object.values(
      response.accuracy.distribution
    ).reduce((total, count) => total + count, 0)

    expect(distributionTotal).toBe(response.accuracy.totalPredictions)

    const lastTrend = response.trends.at(-1)

    if (lastTrend) {
      expect(lastTrend.totalPredictions).toBe(
        response.accuracy.totalPredictions
      )
      expect(lastTrend.totalMatches).toBe(response.accuracy.totalMatches)
      expect(lastTrend.averageMatches).toBe(response.accuracy.averageMatches)
      expect(lastTrend.hitRate).toBe(response.accuracy.hitRate)
    }
  })
})
