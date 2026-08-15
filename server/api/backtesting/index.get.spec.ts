import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sampleDraws } from '@test/fixtures/sampleDraws'

const findAllMock = vi.fn()
const executeMock = vi.fn()

class DefaultRunBacktestingMock {
  execute = executeMock
}

vi.stubGlobal('defineEventHandler', (handler: unknown) => handler)

vi.mock('@server/domain/repositories/draws/CsvDrawRepository', () => ({
  createCsvDrawRepository: vi.fn(() => ({
    findAll: findAllMock
  }))
}))

vi.mock('@server/application/backtesting/DefaultRunBacktesting', () => ({
  DefaultRunBacktesting: DefaultRunBacktestingMock
}))

describe('GET /api/backtesting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('runs backtesting from all draws', async () => {
    const result = [
      {
        recommendation: {
          numbers: []
        },
        actualDraw: sampleDraws[1],
        matches: 1
      }
    ]

    findAllMock.mockResolvedValue(sampleDraws)
    executeMock.mockReturnValue(result)

    const { default: handler } = await import('./index.get')

    const response = await handler({} as never)

    expect(findAllMock).toHaveBeenCalledOnce()
    expect(executeMock).toHaveBeenCalledWith(sampleDraws)
    expect(response).toEqual(result)
  })
})
