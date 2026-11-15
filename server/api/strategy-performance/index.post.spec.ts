import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { H3Event } from 'h3'

const {
  drawRepository,
  performanceRepository,
  createDrawRepositoryMock,
  createPerformanceRepositoryMock,
  executeMock,
  RecordServiceMock
} = vi.hoisted(() => {
  const drawRepository = {
    findAll: vi.fn(),
    findLatest: vi.fn(),
    findByDate: vi.fn()
  }

  const performanceRepository = {
    save: vi.fn(),
    findAll: vi.fn()
  }

  const executeMock = vi.fn()

  return {
    drawRepository,
    performanceRepository,
    createDrawRepositoryMock: vi.fn(),
    createPerformanceRepositoryMock: vi.fn(),
    executeMock,
    RecordServiceMock: vi.fn(function () {
      return { execute: executeMock }
    })
  }
})

vi.mock('@server/domain/repositories/draws/CsvDrawRepository', () => ({
  createCsvDrawRepository: createDrawRepositoryMock
}))

vi.mock(
  '@server/domain/repositories/strategies/CsvStrategyPerformanceRepository',
  () => ({
    createCsvStrategyPerformanceRepository: createPerformanceRepositoryMock
  })
)

vi.mock(
  '@server/application/strategyPerformance/DefaultRecordStrategyPerformance',
  () => ({
    DefaultRecordStrategyPerformance: RecordServiceMock
  })
)

describe('POST /api/strategy-performance', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    createDrawRepositoryMock.mockReturnValue(drawRepository)
    createPerformanceRepositoryMock.mockReturnValue(performanceRepository)
  })

  it('records and returns a strategy performance snapshot', async () => {
    const snapshot = {
      evaluatedAt: '2026-11-15T10:00:00.000Z',
      throughDrawDate: '2026-11-14',
      comparison: {
        winner: 'Simple'
      }
    }

    executeMock.mockResolvedValue(snapshot)

    const { default: handler } = await import('./index.post')

    const response = await handler({} as H3Event)

    expect(createDrawRepositoryMock).toHaveBeenCalledWith({
      filePath: 'data/draws.csv'
    })

    expect(createPerformanceRepositoryMock).toHaveBeenCalledWith({
      filePath: 'data/strategy-performance.csv'
    })

    expect(RecordServiceMock).toHaveBeenCalledOnce()
    expect(RecordServiceMock).toHaveBeenCalledWith(
      drawRepository,
      expect.any(Object),
      performanceRepository,
      expect.objectContaining({
        now: expect.any(Function)
      })
    )

    expect(executeMock).toHaveBeenCalledOnce()
    expect(response).toEqual(snapshot)
  })

  it('propagates recording errors', async () => {
    const error = new Error('Failed to record strategy performance')

    executeMock.mockRejectedValue(error)

    const { default: handler } = await import('./index.post')

    await expect(handler({} as H3Event)).rejects.toThrow(error)
  })
})
