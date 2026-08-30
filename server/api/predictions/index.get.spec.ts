import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { H3Event } from 'h3'

import { sampleDraws } from '@test/fixtures/sampleDraws'
import { sampleNumberAnalysis } from '../../test/fixtures/sampleNumberAnalysis'
import { sampleNumberExplanation } from '../../test/fixtures/sampleNumberExplanation'

const findAllMock = vi.fn()
const executeMock = vi.fn()

const DefaultPredictionServiceMock = vi.fn(
  class {
    execute = executeMock
  }
)

vi.mock('@server/domain/repositories/draws/CsvDrawRepository', () => ({
  createCsvDrawRepository: vi.fn(() => ({
    findAll: findAllMock
  }))
}))

vi.mock('@server/application/prediction/DefaultPredictionService', () => ({
  DefaultPredictionService: DefaultPredictionServiceMock
}))

describe('GET /api/predictions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generates predictions from all draws', async () => {
    const result = {
      recommendations: []
    }

    findAllMock.mockResolvedValue(sampleDraws)
    executeMock.mockReturnValue(result)

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(findAllMock).toHaveBeenCalledOnce()

    expect(executeMock).toHaveBeenCalledWith(sampleDraws)

    expect(response).toEqual(result)
  })

  it('returns generated predictions', async () => {
    const result = {
      recommendations: [
        {
          analysis: sampleNumberAnalysis,
          explanation: sampleNumberExplanation
        }
      ]
    }

    findAllMock.mockResolvedValue(sampleDraws)
    executeMock.mockReturnValue(result)

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response).toEqual(result)
  })

  it('propagates repository errors', async () => {
    const error = new Error('Failed to read draws')

    findAllMock.mockRejectedValue(error)

    const { default: handler } = await import('./index.get')

    await expect(handler({} as H3Event)).rejects.toThrow(error)
  })

  it('returns explanation lines for every recommendation', async () => {
    const result = {
      recommendations: [
        {
          analysis: sampleNumberAnalysis,
          explanation: {
            value: sampleNumberAnalysis.value,
            lines: [
              'frequency explanation',
              'last seen explanation',
              'pair score explanation',
              'recommendation score explanation'
            ]
          }
        }
      ]
    }

    findAllMock.mockResolvedValue(sampleDraws)
    executeMock.mockReturnValue(result)

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.recommendations).toHaveLength(1)

    expect(response.recommendations[0]).toMatchObject({
      explanation: {
        value: sampleNumberAnalysis.value,
        lines: expect.any(Array)
      }
    })

    expect(response.recommendations[0]?.explanation.lines).toHaveLength(4)
  })
})
