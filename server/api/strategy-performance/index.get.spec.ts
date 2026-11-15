import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { H3Event } from 'h3'

const { executeMock, createRepositoryMock, repositoryMock } = vi.hoisted(() => {
  const findAllMock = vi.fn()

  const repositoryMock = {
    save: vi.fn(),
    findAll: findAllMock
  }

  return {
    executeMock: vi.fn(),
    createRepositoryMock: vi.fn(),
    repositoryMock
  }
})

vi.mock(
  '@server/domain/repositories/strategies/CsvStrategyPerformanceRepository',
  () => ({
    createCsvStrategyPerformanceRepository: createRepositoryMock
  })
)

vi.mock(
  '@server/application/strategyPerformance/DefaultGetStrategyPerformanceHistory',
  () => ({
    DefaultGetStrategyPerformanceHistory: class {
      execute = executeMock
    }
  })
)

describe('GET /api/strategy-performance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    createRepositoryMock.mockReturnValue(repositoryMock)
  })

  it('returns saved strategy performance history', async () => {
    const snapshots = [
      {
        evaluatedAt: '2026-11-15T10:00:00.000Z',
        throughDrawDate: '2026-11-14',
        comparison: {
          first: { name: 'Simple', metrics: {} },
          second: { name: 'GapFocused', metrics: {} },
          winner: 'Simple'
        }
      }
    ]

    executeMock.mockResolvedValue(snapshots)

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(createRepositoryMock).toHaveBeenCalledWith({
      filePath: 'data/strategy-performance.csv'
    })

    expect(executeMock).toHaveBeenCalledOnce()
    expect(response).toEqual(snapshots)
  })

  it('propagates history service errors', async () => {
    const error = new Error('Failed to load strategy performance history')

    executeMock.mockRejectedValue(error)

    const { default: handler } = await import('./index.get')

    await expect(handler({} as H3Event)).rejects.toThrow(error)
  })
})
