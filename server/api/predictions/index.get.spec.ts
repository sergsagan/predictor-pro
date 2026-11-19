import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { H3Event } from 'h3'

import type { Draw } from '@server/domain/models/Draw'
import type { RecommendationStrategyConfig } from '@server/domain/engines/recommendation/config/RecommendationStrategyConfig'
import type { RecommendationWeights } from '@server/domain/engines/recommendation/config/RecommendationWeights'
import type { WeightOptimizationResult } from '@server/domain/engines/optimization/weights/WeightOptimizationResult'

import { sampleDraws } from '@test/fixtures/sampleDraws'
import { sampleNumberAnalysis } from '../../test/fixtures/sampleNumberAnalysis'
import { sampleNumberExplanation } from '../../test/fixtures/sampleNumberExplanation'

import { createDefaultWeightProfiles } from '@server/domain/engines/optimization/weights/DefaultWeightProfileCatalog'

const findAllMock = vi.fn()
const executeMock = vi.fn()
const selectStrategyMock = vi.fn()
const createRecommendationEngineMock = vi.fn()

const evaluateAllMock = vi.fn(
  (
    _configurations: readonly RecommendationStrategyConfig[],
    _draws: readonly Draw[]
  ): readonly WeightOptimizationResult[] => []
)

const WeightOptimizationEvaluatorMock = vi.fn(
  class {
    evaluateAll = evaluateAllMock
  }
)

const DefaultPredictionServiceMock = vi.fn(
  class {
    execute = executeMock
  }
)

const DefaultAdaptiveStrategySelectorMock = vi.fn(
  class {
    execute = selectStrategyMock
  }
)

function createOptimizationResult(
  weights: RecommendationWeights,
  predictionsWithMatches: number
): WeightOptimizationResult {
  const totalPredictions = 40
  const hitRate = predictionsWithMatches / totalPredictions

  return {
    weights,
    metrics: {
      totalPredictions,
      totalMatches: predictionsWithMatches,
      averageMatches: hitRate,
      predictionsWithMatches,
      hitRate,
      distribution: {
        0: totalPredictions - predictionsWithMatches,
        1: predictionsWithMatches,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    }
  }
}

vi.mock('@server/domain/repositories/draws/CsvDrawRepository', () => ({
  createCsvDrawRepository: vi.fn(() => ({
    findAll: findAllMock
  }))
}))

vi.mock(
  '@server/domain/repositories/strategies/CsvStrategyPerformanceRepository',
  () => ({
    createCsvStrategyPerformanceRepository: vi.fn(() => ({
      save: vi.fn(),
      findAll: vi.fn()
    }))
  })
)

vi.mock('@server/application/prediction/DefaultPredictionService', () => ({
  DefaultPredictionService: DefaultPredictionServiceMock
}))

vi.mock(
  '@server/application/strategySelection/DefaultAdaptiveStrategySelector',
  () => ({
    DefaultAdaptiveStrategySelector: DefaultAdaptiveStrategySelectorMock
  })
)

vi.mock(
  '@server/domain/engines/optimization/weights/WeightOptimizationEvaluator',
  () => ({
    WeightOptimizationEvaluator: WeightOptimizationEvaluatorMock
  })
)

vi.mock(
  '@server/domain/engines/recommendation/createRecommendationEngine',
  () => ({
    createRecommendationEngine: createRecommendationEngineMock
  })
)

describe('GET /api/predictions', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    evaluateAllMock.mockReturnValue([])

    selectStrategyMock.mockResolvedValue({
      strategy: 'simple',
      reason: 'no-history',
      evaluatedAt: null,
      throughDrawDate: null
    })

    createRecommendationEngineMock.mockReturnValue({
      recommend: vi.fn()
    })
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

  it('uses the strategy selected by adaptive selector', async () => {
    const result = {
      recommendations: []
    }

    findAllMock.mockResolvedValue(sampleDraws)
    executeMock.mockReturnValue(result)

    selectStrategyMock.mockResolvedValue({
      strategy: 'gap-focused',
      reason: 'higher-hit-rate',
      evaluatedAt: '2026-11-15T10:00:00.000Z',
      throughDrawDate: '2026-11-14'
    })

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(selectStrategyMock).toHaveBeenCalledOnce()

    expect(evaluateAllMock).not.toHaveBeenCalled()

    expect(createRecommendationEngineMock).toHaveBeenCalledWith({
      strategy: 'gap-focused',
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      }
    })

    expect(response).toEqual(result)
  })

  it('uses the best adaptive weight profile for the selected simple strategy', async () => {
    const result = {
      recommendations: []
    }

    const defaultWeights: RecommendationWeights = {
      frequency: 1,
      currentGap: 1,
      pairScore: 1
    }

    const optimizedWeights: RecommendationWeights = {
      frequency: 2,
      currentGap: 1,
      pairScore: 1
    }

    findAllMock.mockResolvedValue(sampleDraws)
    executeMock.mockReturnValue(result)

    evaluateAllMock.mockReturnValue([
      createOptimizationResult(defaultWeights, 16),
      createOptimizationResult(optimizedWeights, 24)
    ])

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(WeightOptimizationEvaluatorMock).toHaveBeenCalledWith(
      expect.any(Function)
    )

    expect(evaluateAllMock).toHaveBeenCalledWith(
      createDefaultWeightProfiles(),
      sampleDraws
    )

    expect(createRecommendationEngineMock).toHaveBeenLastCalledWith({
      strategy: 'simple',
      weights: optimizedWeights
    })

    expect(response).toEqual(result)
  })
})
