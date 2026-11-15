import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'
import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'

import { createCsvStrategyPerformanceRepository } from './CsvStrategyPerformanceRepository'

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
        metrics: createMetrics(10, 25)
      },
      second: {
        name: 'GapFocused',
        metrics: createMetrics(10, 20)
      },
      winner: 'Simple'
    }
  }
}

describe('CsvStrategyPerformanceRepository integration', () => {
  let directory: string
  let filePath: string

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'predictor-'))
    filePath = join(directory, 'strategy-performance.csv')
  })

  afterEach(async () => {
    await rm(directory, {
      recursive: true,
      force: true
    })
  })

  it('saves and reads strategy performance snapshots', async () => {
    const repository = createCsvStrategyPerformanceRepository({ filePath })

    const snapshot = createSnapshot('2026-11-15T10:00:00.000Z', '2026-11-14')

    await repository.save(snapshot)

    await expect(repository.findAll()).resolves.toEqual([snapshot])
  })

  it('returns snapshots in chronological order', async () => {
    const repository = createCsvStrategyPerformanceRepository({ filePath })

    const later = createSnapshot('2026-11-15T10:00:00.000Z', '2026-11-14')

    const earlier = createSnapshot('2026-11-10T10:00:00.000Z', '2026-11-09')

    await repository.save(later)
    await repository.save(earlier)

    await expect(repository.findAll()).resolves.toEqual([earlier, later])
  })

  it('returns an empty array when the file does not exist', async () => {
    const repository = createCsvStrategyPerformanceRepository({ filePath })

    await expect(repository.findAll()).resolves.toEqual([])
  })
})
