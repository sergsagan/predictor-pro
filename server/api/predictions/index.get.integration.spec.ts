import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { H3Event } from 'h3'
import type { RecommendationStrategyConfig } from '@server/domain/engines/recommendation/config/RecommendationStrategyConfig'
import type { RecommendationWeights } from '@server/domain/engines/recommendation/config/RecommendationWeights'

describe('GET /api/predictions - integration', () => {
  let directory: string
  let performanceHistoryPath: string

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'predictor-predictions-'))
    performanceHistoryPath = join(directory, 'strategy-performance.csv')

    vi.resetModules()

    vi.doMock(
      '@server/domain/repositories/strategies/CsvStrategyPerformanceRepository',
      async (importOriginal) => {
        const actual =
          await importOriginal<
            typeof import('@server/domain/repositories/strategies/CsvStrategyPerformanceRepository')
          >()

        return {
          ...actual,
          createCsvStrategyPerformanceRepository: () =>
            actual.createCsvStrategyPerformanceRepository({
              filePath: performanceHistoryPath
            })
        }
      }
    )
  })

  afterEach(async () => {
    vi.doUnmock(
      '@server/domain/repositories/strategies/CsvStrategyPerformanceRepository'
    )

    vi.doUnmock(
      '@server/domain/engines/recommendation/createRecommendationEngine'
    )

    vi.resetModules()

    await rm(directory, {
      recursive: true,
      force: true
    })
  })

  it('uses the strategy selected from persisted performance history', async () => {
    const { createCsvStrategyPerformanceRepository } =
      await import('@server/domain/repositories/strategies/CsvStrategyPerformanceRepository')

    const repository = createCsvStrategyPerformanceRepository({
      filePath: performanceHistoryPath
    })

    await repository.save({
      evaluatedAt: '2026-11-15T10:00:00.000Z',
      throughDrawDate: '2026-11-14',
      comparison: {
        first: {
          name: 'Simple',
          metrics: {
            totalPredictions: 40,
            totalMatches: 20,
            averageMatches: 0.5,
            predictionsWithMatches: 20,
            hitRate: 0.5,
            distribution: {
              0: 20,
              1: 20,
              2: 0,
              3: 0,
              4: 0,
              5: 0
            }
          }
        },
        second: {
          name: 'GapFocused',
          metrics: {
            totalPredictions: 40,
            totalMatches: 24,
            averageMatches: 0.6,
            predictionsWithMatches: 24,
            hitRate: 0.6,
            distribution: {
              0: 16,
              1: 24,
              2: 0,
              3: 0,
              4: 0,
              5: 0
            }
          }
        },
        winner: 'GapFocused'
      }
    })

    const createRecommendationEngineMock = vi.fn()

    vi.doMock(
      '@server/domain/engines/recommendation/createRecommendationEngine',
      async (importOriginal) => {
        const actual =
          await importOriginal<
            typeof import('@server/domain/engines/recommendation/createRecommendationEngine')
          >()

        return {
          ...actual,
          createRecommendationEngine: (
            config: Parameters<typeof actual.createRecommendationEngine>[0]
          ) => {
            createRecommendationEngineMock(config)

            return actual.createRecommendationEngine(config)
          }
        }
      }
    )

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.recommendations).toHaveLength(5)

    expect(createRecommendationEngineMock).toHaveBeenCalledWith({
      strategy: 'gap-focused',
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      }
    })

    expect(response.adaptation).toEqual({
      strategy: 'gap-focused',
      strategyReason: 'higher-hit-rate',
      weights: {
        frequency: 1,
        currentGap: 1,
        pairScore: 1
      },
      weightReason: 'not-applicable'
    })
  })

  it('uses Simple when performance history is empty', async () => {
    const createRecommendationEngineMock = vi.fn()

    vi.doMock(
      '@server/domain/engines/recommendation/createRecommendationEngine',
      async (importOriginal) => {
        const actual =
          await importOriginal<
            typeof import('@server/domain/engines/recommendation/createRecommendationEngine')
          >()

        return {
          ...actual,
          createRecommendationEngine: (
            config: Parameters<typeof actual.createRecommendationEngine>[0]
          ) => {
            createRecommendationEngineMock(config)

            return actual.createRecommendationEngine(config)
          }
        }
      }
    )

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.recommendations).toHaveLength(5)

    expect(createRecommendationEngineMock).toHaveBeenCalled()

    const finalConfig = createRecommendationEngineMock.mock.lastCall?.[0]

    expect(finalConfig).toMatchObject({
      strategy: 'simple'
    })

    expect(response.adaptation.strategy).toBe('simple')
    expect(response.adaptation.strategyReason).toBe('no-history')
    expect(response.adaptation.weights).toEqual(finalConfig?.weights)
  })

  it('generates predictions from real dependencies', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response).toBeDefined()
    expect(response.recommendations).toHaveLength(5)

    for (const recommendation of response.recommendations) {
      expect(recommendation.analysis).toBeDefined()
      expect(recommendation.explanation).toBeDefined()
    }
  })

  it('generates deterministic predictions', async () => {
    const { default: handler } = await import('./index.get')

    const firstResponse = await handler({} as H3Event)
    const secondResponse = await handler({} as H3Event)

    expect(secondResponse).toEqual(firstResponse)
  })

  it('returns recommendations with analysis and explanation', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.recommendations).toHaveLength(5)

    for (const recommendation of response.recommendations) {
      expect(recommendation).toEqual(
        expect.objectContaining({
          analysis: expect.any(Object),
          explanation: expect.any(Object)
        })
      )
    }
  })

  it('returns explanations consistent with recommendation analysis', async () => {
    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    expect(response.recommendations).toHaveLength(5)

    for (const recommendation of response.recommendations) {
      expect(recommendation.explanation.value).toBe(
        recommendation.analysis.value
      )

      expect(recommendation.explanation.lines).toHaveLength(4)

      expect(
        recommendation.explanation.lines.every(
          (line) => typeof line === 'string' && line.length > 0
        )
      ).toBe(true)
    }
  })

  it('returns adaptation metadata matching the weights applied to recommendations', async () => {
    const recommendationConfigs: RecommendationStrategyConfig[] = []

    vi.doMock(
      '@server/domain/engines/recommendation/createRecommendationEngine',
      async (importOriginal) => {
        const actual =
          await importOriginal<
            typeof import('@server/domain/engines/recommendation/createRecommendationEngine')
          >()

        return {
          ...actual,
          createRecommendationEngine: (
            config: Parameters<typeof actual.createRecommendationEngine>[0]
          ) => {
            recommendationConfigs.push(config)

            return actual.createRecommendationEngine(config)
          }
        }
      }
    )

    const { default: handler } = await import('./index.get')

    const response = await handler({} as H3Event)

    const appliedConfig = recommendationConfigs.at(-1)

    expect(appliedConfig).toBeDefined()
    expect(appliedConfig?.strategy).toBe('simple')

    expect(recommendationConfigs).toHaveLength(9)

    const adaptation = response.adaptation

    expect(adaptation).toBeDefined()

    expect(adaptation).toMatchObject({
      strategy: 'simple',
      strategyReason: 'no-history',
      weights: appliedConfig?.weights,
      weightReason: expect.stringMatching(
        /^(highest-hit-rate|insufficient-sample|no-results|invalid-profile)$/
      )
    })

    const weights: RecommendationWeights = adaptation.weights

    expect(
      Math.max(weights.frequency, weights.currentGap, weights.pairScore)
    ).toBe(1)

    expect(
      [weights.frequency, weights.currentGap, weights.pairScore].every(
        (weight) => weight > 0 && weight <= 1
      )
    ).toBe(true)

    expect(response.recommendations).toHaveLength(5)
  })
})
