import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { H3Event } from 'h3'
import type { Prediction } from '@server/domain/models/Prediction'

const findAllMock = vi.fn()

const DefaultPredictionHistoryServiceMock = vi.fn(
  class {
    findAll = findAllMock
  }
)

vi.mock(
  '@server/application/prediction/DefaultPredictionHistoryService',
  () => ({
    DefaultPredictionHistoryService: DefaultPredictionHistoryServiceMock
  })
)

describe('GET /api/predictions/history', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns prediction history', async () => {
    const predictions: readonly Prediction[] = [
      {
        predictionDate: '2026-08-31',
        numbers: [7, 15, 23, 32, 44]
      },
      {
        predictionDate: '2026-09-01',
        numbers: [3, 12, 21, 34, 45]
      }
    ]

    findAllMock.mockResolvedValue(predictions)

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(findAllMock).toHaveBeenCalledOnce()
    expect(response).toEqual(predictions)
  })

  it('propagates history service errors', async () => {
    const error = new Error('Failed to load prediction history')

    findAllMock.mockRejectedValue(error)

    const { default: handler } = await import('./index.get')

    await expect(handler({} as H3Event)).rejects.toThrow(error)
  })
})
