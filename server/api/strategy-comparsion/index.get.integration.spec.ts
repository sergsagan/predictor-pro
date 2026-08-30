import { describe, expect, it } from 'vitest'

import type { H3Event } from 'h3'

describe('GET /api/strategy-comparison - integration', () => {
  it('compares strategies using real dependencies', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response).toBeDefined()

    expect(response.first).toBeDefined()
    expect(response.second).toBeDefined()

    expect(response.first.name).toBe('Simple')
    expect(response.second.name).toBe('GapFocused')

    expect(response.first.metrics.totalPredictions).toBeGreaterThan(0)

    expect(response.second.metrics.totalPredictions).toBeGreaterThan(0)

    expect(['Simple', 'GapFocused', null]).toContain(response.winner)
  })

  it('returns deterministic comparison results', async () => {
    const { default: handler } = await import('./index.get')

    const firstResponse = await handler({} as H3Event)
    const secondResponse = await handler({} as H3Event)

    expect(secondResponse).toEqual(firstResponse)
  })
})
