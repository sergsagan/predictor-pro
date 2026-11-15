import { describe, expect, it, vi } from 'vitest'

import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'
import type { StrategyPerformanceRepository } from '@server/domain/repositories/strategies/StrategyPerformanceRepository'

import { DefaultGetStrategyPerformanceHistory } from './DefaultGetStrategyPerformanceHistory'

const snapshots: readonly StrategyPerformanceSnapshot[] = [
  {
    evaluatedAt: '2026-11-10T10:00:00.000Z',
    throughDrawDate: '2026-11-09',
    comparison: {
      first: {
        name: 'Simple',
        metrics: {
          totalPredictions: 10,
          totalMatches: 25,
          averageMatches: 2.5,
          predictionsWithMatches: 8,
          hitRate: 0.8,
          distribution: {
            0: 2,
            1: 0,
            2: 0,
            3: 4,
            4: 0,
            5: 4
          }
        }
      },
      second: {
        name: 'GapFocused',
        metrics: {
          totalPredictions: 10,
          totalMatches: 20,
          averageMatches: 2,
          predictionsWithMatches: 7,
          hitRate: 0.7,
          distribution: {
            0: 3,
            1: 0,
            2: 0,
            3: 3,
            4: 0,
            5: 4
          }
        }
      },
      winner: 'Simple'
    }
  }
]

describe('DefaultGetStrategyPerformanceHistory', () => {
  it('returns saved strategy performance snapshots', async () => {
    const repository: StrategyPerformanceRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue(snapshots)
    }

    const service = new DefaultGetStrategyPerformanceHistory(repository)

    await expect(service.execute()).resolves.toEqual(snapshots)

    expect(repository.findAll).toHaveBeenCalledOnce()
  })

  it('returns an empty array when no snapshots exist', async () => {
    const repository: StrategyPerformanceRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([])
    }

    const service = new DefaultGetStrategyPerformanceHistory(repository)

    await expect(service.execute()).resolves.toEqual([])

    expect(repository.findAll).toHaveBeenCalledOnce()
  })
})
