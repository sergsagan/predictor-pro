import { describe, expect, it } from 'vitest'

import type { H3Event } from 'h3'

describe('GET /api/predictions/history - integration', () => {
  it('returns prediction history', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response).toEqual([])
  })
})
