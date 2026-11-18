import { describe, expect, it } from 'vitest'

import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'
import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'

import { DefaultStrategyPerformanceEvaluator } from './DefaultStrategyPerformanceEvaluator'

function createMetrics(
  totalPredictions: number,
  hitRate: number
): AccuracyMetrics {
  return {
    totalPredictions,
    totalMatches: 0,
    averageMatches: 0,
    predictionsWithMatches: totalPredictions * hitRate,
    hitRate,
    distribution: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  }
}

function createSnapshot(
  firstHitRate: number,
  secondHitRate: number,
  totalPredictions = 30
): StrategyPerformanceSnapshot {
  return {
    evaluatedAt: '2026-11-15T10:00:00.000Z',
    throughDrawDate: '2026-11-14',
    comparison: {
      first: {
        name: 'Simple',
        metrics: createMetrics(totalPredictions, firstHitRate)
      },
      second: {
        name: 'GapFocused',
        metrics: createMetrics(totalPredictions, secondHitRate)
      },
      winner:
        firstHitRate > secondHitRate
          ? 'Simple'
          : secondHitRate > firstHitRate
            ? 'GapFocused'
            : null
    }
  }
}

describe('DefaultStrategyPerformanceEvaluator', () => {
  const evaluator = new DefaultStrategyPerformanceEvaluator()

  it('selects Simple when it has a higher hit rate', () => {
    const result = evaluator.execute(createSnapshot(0.6, 0.5))

    expect(result).toEqual({
      strategy: 'simple',
      reason: 'higher-hit-rate',
      evaluatedAt: '2026-11-15T10:00:00.000Z',
      throughDrawDate: '2026-11-14'
    })
  })

  it('selects GapFocused when it has a higher hit rate', () => {
    const result = evaluator.execute(createSnapshot(0.4, 0.6))

    expect(result.strategy).toBe('gap-focused')
    expect(result.reason).toBe('higher-hit-rate')
  })

  it('selects Simple when hit rates are equal', () => {
    const result = evaluator.execute(createSnapshot(0.5, 0.5))

    expect(result.strategy).toBe('simple')
    expect(result.reason).toBe('tie')
  })

  it('uses Simple when the sample contains fewer than 30 predictions', () => {
    const result = evaluator.execute(createSnapshot(0.3, 0.8, 29))

    expect(result.strategy).toBe('simple')
    expect(result.reason).toBe('insufficient-sample')
  })

  it('supports a custom minimum sample size', () => {
    const customEvaluator = new DefaultStrategyPerformanceEvaluator(50)

    const result = customEvaluator.execute(createSnapshot(0.4, 0.6, 30))

    expect(result.strategy).toBe('simple')
    expect(result.reason).toBe('insufficient-sample')
  })
})
