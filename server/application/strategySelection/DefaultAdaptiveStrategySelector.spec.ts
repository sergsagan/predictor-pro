import { describe, expect, it, vi } from 'vitest'

import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'
import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'
import type { StrategySelection } from '@server/domain/models/StrategySelection'

import { DefaultAdaptiveStrategySelector } from './DefaultAdaptiveStrategySelector'

function createMetrics(hitRate: number): AccuracyMetrics {
  return {
    totalPredictions: 30,
    totalMatches: 50,
    averageMatches: 50 / 30,
    predictionsWithMatches: 20,
    hitRate,
    distribution: {
      0: 10,
      1: 5,
      2: 5,
      3: 5,
      4: 3,
      5: 2
    }
  }
}

function createSnapshot(
  evaluatedAt: string,
  throughDrawDate: string
): StrategyPerformanceSnapshot {
  return {
    evaluatedAt,
    throughDrawDate,
    comparison: {
      first: {
        name: 'Simple',
        metrics: createMetrics(0.6)
      },
      second: {
        name: 'GapFocused',
        metrics: createMetrics(0.5)
      },
      winner: 'Simple'
    }
  }
}

describe('DefaultAdaptiveStrategySelector', () => {
  it('returns Simple when performance history is empty', async () => {
    const historyService = {
      execute: vi.fn().mockResolvedValue([])
    }

    const evaluator = {
      execute: vi.fn()
    }

    const selector = new DefaultAdaptiveStrategySelector(
      historyService,
      evaluator
    )

    const result = await selector.execute()

    expect(result).toEqual({
      strategy: 'simple',
      reason: 'no-history',
      evaluatedAt: null,
      throughDrawDate: null
    })

    expect(historyService.execute).toHaveBeenCalledOnce()
    expect(evaluator.execute).not.toHaveBeenCalled()
  })

  it('evaluates the latest snapshot regardless of array order', async () => {
    const olderSnapshot = createSnapshot(
      '2026-11-10T10:00:00.000Z',
      '2026-11-09'
    )

    const latestSnapshot = createSnapshot(
      '2026-11-15T10:00:00.000Z',
      '2026-11-14'
    )

    const historyService = {
      execute: vi.fn().mockResolvedValue([latestSnapshot, olderSnapshot])
    }

    const selection: StrategySelection = {
      strategy: 'gap-focused',
      reason: 'higher-hit-rate',
      evaluatedAt: latestSnapshot.evaluatedAt,
      throughDrawDate: latestSnapshot.throughDrawDate
    }

    const evaluator = {
      execute: vi.fn().mockReturnValue(selection)
    }

    const selector = new DefaultAdaptiveStrategySelector(
      historyService,
      evaluator
    )

    const result = await selector.execute()

    expect(historyService.execute).toHaveBeenCalledOnce()
    expect(evaluator.execute).toHaveBeenCalledOnce()
    expect(evaluator.execute).toHaveBeenCalledWith(latestSnapshot)
    expect(result).toEqual(selection)
  })

  it('propagates history service errors', async () => {
    const error = new Error('Failed to load strategy performance history')

    const historyService = {
      execute: vi.fn().mockRejectedValue(error)
    }

    const evaluator = {
      execute: vi.fn()
    }

    const selector = new DefaultAdaptiveStrategySelector(
      historyService,
      evaluator
    )

    await expect(selector.execute()).rejects.toThrow(error)

    expect(evaluator.execute).not.toHaveBeenCalled()
  })
})
