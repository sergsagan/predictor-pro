import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'
import type { AlgorithmComparison } from '@server/domain/engines/backtesting/AlgorithmComparison'
import type { DrawRepository } from '@server/domain/repositories/draws/DrawRepository'
import type { StrategyPerformanceRepository } from '@server/domain/repositories/strategies/StrategyPerformanceRepository'

import { DefaultRecordStrategyPerformance } from './DefaultRecordStrategyPerformance'

function createMetrics(
  totalPredictions: number,
  totalMatches: number
): AccuracyMetrics {
  return {
    totalPredictions,
    totalMatches,
    averageMatches:
      totalPredictions === 0 ? 0 : totalMatches / totalPredictions,
    predictionsWithMatches: 1,
    hitRate: totalPredictions === 0 ? 0 : 1 / totalPredictions,
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

const comparison: AlgorithmComparison = {
  first: {
    name: 'Simple',
    metrics: createMetrics(10, 25)
  },
  second: {
    name: 'GapFocused',
    metrics: createMetrics(10, 20)
  },
  winner: 'Simple'
}

const draws: readonly Draw[] = [
  {
    drawDate: '2026-11-14',
    numbers: [1, 2, 3, 4, 5],
    extraNumbers: [6, 7]
  },
  {
    drawDate: '2026-11-10',
    numbers: [8, 9, 10, 11, 12],
    extraNumbers: [13, 14]
  }
]

describe('DefaultRecordStrategyPerformance', () => {
  it('compares strategies and saves a performance snapshot', async () => {
    const drawRepository: DrawRepository = {
      findAll: vi.fn().mockResolvedValue(draws),
      findLatest: vi.fn(),
      findByDate: vi.fn()
    }

    const compareStrategies = {
      execute: vi.fn().mockReturnValue(comparison)
    }

    const performanceRepository: StrategyPerformanceRepository = {
      save: vi.fn(),
      findAll: vi.fn()
    }

    const clock = {
      now: vi.fn().mockReturnValue(new Date('2026-11-15T10:00:00.000Z'))
    }

    const service = new DefaultRecordStrategyPerformance(
      drawRepository,
      compareStrategies,
      performanceRepository,
      clock
    )

    const result = await service.execute()

    expect(drawRepository.findAll).toHaveBeenCalledOnce()
    expect(compareStrategies.execute).toHaveBeenCalledWith(draws)

    expect(result).toEqual({
      evaluatedAt: '2026-11-15T10:00:00.000Z',
      throughDrawDate: '2026-11-14',
      comparison
    })

    expect(performanceRepository.save).toHaveBeenCalledWith(result)
  })

  it('does not save a snapshot when there are no draws', async () => {
    const drawRepository: DrawRepository = {
      findAll: vi.fn().mockResolvedValue([]),
      findLatest: vi.fn(),
      findByDate: vi.fn()
    }

    const compareStrategies = {
      execute: vi.fn().mockReturnValue(comparison)
    }

    const performanceRepository: StrategyPerformanceRepository = {
      save: vi.fn(),
      findAll: vi.fn()
    }

    const clock = {
      now: vi.fn().mockReturnValue(new Date())
    }

    const service = new DefaultRecordStrategyPerformance(
      drawRepository,
      compareStrategies,
      performanceRepository,
      clock
    )

    await expect(service.execute()).resolves.toBeNull()

    expect(compareStrategies.execute).not.toHaveBeenCalled()
    expect(performanceRepository.save).not.toHaveBeenCalled()
  })
})
