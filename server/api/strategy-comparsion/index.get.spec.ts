import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { H3Event } from 'h3'

const findAllMock = vi.fn()
const executeMock = vi.fn()

const DefaultCompareStrategiesMock = vi.fn(
  class {
    execute = executeMock
  }
)

vi.mock('@server/domain/repositories/draws/CsvDrawRepository', () => ({
  createCsvDrawRepository: vi.fn(() => ({
    findAll: findAllMock
  }))
}))

vi.mock(
  '@server/application/strategyComparsion/DefaultCompareStrategies',
  () => ({
    DefaultCompareStrategies: DefaultCompareStrategiesMock
  })
)

describe('GET /api/strategy-comparison', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('compares strategies using all draws', async () => {
    const result = {
      first: {
        name: 'Simple',
        metrics: {
          totalPredictions: 10,
          totalMatches: 5,
          averageMatches: 0.5,
          predictionsWithMatches: 5,
          hitRate: 0.5,
          distribution: {
            0: 5,
            1: 3,
            2: 2,
            3: 0,
            4: 0,
            5: 0
          }
        }
      },
      second: {
        name: 'GapFocused',
        metrics: {
          totalPredictions: 10,
          totalMatches: 6,
          averageMatches: 0.6,
          predictionsWithMatches: 6,
          hitRate: 0.6,
          distribution: {
            0: 4,
            1: 3,
            2: 2,
            3: 1,
            4: 0,
            5: 0
          }
        }
      },
      winner: 'GapFocused'
    }

    const draws = [{ drawDate: '2025-01-01' }] as never[]

    findAllMock.mockResolvedValue(draws)
    executeMock.mockReturnValue(result)

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(findAllMock).toHaveBeenCalledOnce()
    expect(executeMock).toHaveBeenCalledWith(draws)
    expect(response).toEqual(result)
  })

  it('propagates repository errors', async () => {
    const error = new Error('Failed to read draws')

    findAllMock.mockRejectedValue(error)

    const { default: handler } = await import('./index.get')

    await expect(handler({} as H3Event)).rejects.toThrow(error)
  })
})
