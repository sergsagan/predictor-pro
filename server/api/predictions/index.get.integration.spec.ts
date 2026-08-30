import { describe, expect, it } from 'vitest'

import type { H3Event } from 'h3'

describe('GET /api/predictions - integration', () => {
  it('generates predictions from real dependencies', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response).toBeDefined()

    expect(response.recommendations).toHaveLength(5)

    for (const recommendation of response.recommendations) {
      expect(recommendation.analysis).toBeDefined()
      expect(recommendation.explanation).toBeDefined()
    }
  })

  it('generates deterministic predictions', async () => {
    const { default: handler } = await import('./index.get')

    const firstResponse = await handler({} as H3Event)
    const secondResponse = await handler({} as H3Event)

    expect(secondResponse).toEqual(firstResponse)
  })

  it('returns recommendations with analysis and explanation', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.recommendations).toHaveLength(5)

    for (const recommendation of response.recommendations) {
      expect(recommendation).toEqual(
        expect.objectContaining({
          analysis: expect.any(Object),
          explanation: expect.any(Object)
        })
      )
    }
  })

  it('returns explanations consistent with recommendation analysis', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.recommendations).toHaveLength(5)

    for (const recommendation of response.recommendations) {
      expect(recommendation.explanation.value).toBe(
        recommendation.analysis.value
      )

      expect(recommendation.explanation.lines).toHaveLength(4)

      expect(
        recommendation.explanation.lines.every(
          (line) => typeof line === 'string' && line.length > 0
        )
      ).toBe(true)
    }
  })
})
