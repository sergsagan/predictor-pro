import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { H3Event } from 'h3'

import { sampleDraws } from '@test/fixtures/sampleDraws'
import { sampleNumberAnalysis } from '../../test/fixtures/sampleNumberAnalysis'
import { sampleNumberExplanation } from '../../test/fixtures/sampleNumberExplanation'

const findAllMock = vi.fn()
const executeMock = vi.fn()

const DefaultGenerateRecommendationsMock = vi.fn(
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
  '@server/application/recommendation/DefaultGenerateRecommendations',
  () => ({
    DefaultGenerateRecommendations: DefaultGenerateRecommendationsMock
  })
)

describe('GET /api/recommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generates recommendations from all draws', async () => {
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

  it('returns generated recommendations', async () => {
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

    expect(response).toEqual({
      recommendations: [
        {
          analysis: sampleNumberAnalysis,
          explanation: sampleNumberExplanation
        }
      ]
    })
  })

  it('propagates repository errors', async () => {
    const error = new Error('Failed to read draws')

    findAllMock.mockRejectedValue(error)

    const { default: handler } = await import('./index.get')

    await expect(handler({} as H3Event)).rejects.toThrow(error)
  })
})
