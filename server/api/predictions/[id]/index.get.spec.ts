import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { H3Event } from 'h3'
import type { Prediction } from '@server/domain/models/Prediction'

const findByDateMock = vi.fn()

const DefaultPredictionHistoryServiceMock = vi.fn(
  class {
    findByDate = findByDateMock
  }
)

vi.mock(
  '@server/application/prediction/DefaultPredictionHistoryService',
  () => ({
    DefaultPredictionHistoryService: DefaultPredictionHistoryServiceMock
  })
)

describe('GET /api/predictions/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns prediction by date', async () => {
    const prediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    findByDateMock.mockResolvedValue(prediction)

    const { default: handler } = await import('./index.get')

    const event = {
      context: {},
      node: {
        req: {}
      }
    } as H3Event

    ;(
      event as H3Event & {
        context: { params: { id: string } }
      }
    ).context.params = {
      id: '2026-08-31'
    }

    const response = await handler(event)

    expect(findByDateMock).toHaveBeenCalledWith('2026-08-31')

    expect(response).toEqual(prediction)
  })

  it('returns null when prediction does not exist', async () => {
    findByDateMock.mockResolvedValue(null)

    const { default: handler } = await import('./index.get')

    const event = {
      context: {
        params: {
          id: '2026-08-30'
        }
      }
    } as unknown as H3Event

    const response = await handler(event)

    expect(findByDateMock).toHaveBeenCalledWith('2026-08-30')

    expect(response).toBeNull()
  })
})
