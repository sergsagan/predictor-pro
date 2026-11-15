import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { H3Event } from 'h3'
import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'

const {
  createRepositoryMock,
  executeAccuracyMock,
  executeTrendsMock,
  AccuracyServiceMock,
  TrendsServiceMock
} = vi.hoisted(() => ({
  createRepositoryMock: vi.fn(),
  executeAccuracyMock: vi.fn(),
  executeTrendsMock: vi.fn(),
  AccuracyServiceMock: vi.fn(function () {
    return { execute: executeAccuracyMock }
  }),
  TrendsServiceMock: vi.fn(function () {
    return { execute: executeTrendsMock }
  })
}))

vi.mock(
  '@server/domain/repositories/predictions/CsvPredictionEvaluationRepository',
  () => ({
    createCsvPredictionEvaluationRepository: createRepositoryMock
  })
)

vi.mock('@server/application/prediction/DefaultGetPredictionAccuracy', () => ({
  DefaultGetPredictionAccuracy: AccuracyServiceMock
}))

vi.mock('@server/application/prediction/DefaultGetPredictionTrends', () => ({
  DefaultGetPredictionTrends: TrendsServiceMock
}))

describe('GET /api/predictions/statistics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns prediction accuracy and performance trends', async () => {
    const repository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findByPredictionDate: vi.fn()
    }

    const accuracy: AccuracyMetrics = {
      totalPredictions: 2,
      totalMatches: 5,
      averageMatches: 2.5,
      predictionsWithMatches: 1,
      hitRate: 0.5,
      distribution: {
        0: 1,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 1
      }
    }

    const trends = [
      {
        predictionDate: '2026-08-30',
        drawDate: '2026-08-30',
        matches: 5,
        totalPredictions: 1,
        totalMatches: 5,
        averageMatches: 5,
        hitRate: 1
      }
    ]

    createRepositoryMock.mockReturnValue(repository)
    executeAccuracyMock.mockResolvedValue(accuracy)
    executeTrendsMock.mockResolvedValue(trends)

    const { default: handler } = await import('./index.get')
    const response = await handler({} as H3Event)

    expect(createRepositoryMock).toHaveBeenCalledWith({
      filePath: 'data/prediction-evaluations.csv'
    })

    expect(AccuracyServiceMock).toHaveBeenCalledWith(repository)
    expect(TrendsServiceMock).toHaveBeenCalledWith(repository)

    expect(executeAccuracyMock).toHaveBeenCalledOnce()
    expect(executeTrendsMock).toHaveBeenCalledOnce()

    expect(response).toEqual({
      accuracy,
      trends
    })
  })

  it('propagates statistics service errors', async () => {
    createRepositoryMock.mockReturnValue({
      save: vi.fn(),
      findAll: vi.fn(),
      findByPredictionDate: vi.fn()
    })

    const error = new Error('Failed to load prediction statistics')

    executeAccuracyMock.mockRejectedValue(error)
    executeTrendsMock.mockResolvedValue([])

    const { default: handler } = await import('./index.get')

    await expect(handler({} as H3Event)).rejects.toThrow(error)
  })
})
