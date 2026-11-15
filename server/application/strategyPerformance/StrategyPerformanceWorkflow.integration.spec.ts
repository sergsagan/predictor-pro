import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createCsvStrategyPerformanceRepository } from '@server/domain/repositories/strategies/CsvStrategyPerformanceRepository'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'
import { GapFocusedRecommendationEngine } from '@server/domain/engines/recommendation/GapFocusedRecommendationEngine'
import { SimpleBacktestingEngine } from '@server/domain/engines/backtesting/SimpleBacktestingEngine'

import { DefaultCompareStrategies } from '@server/application/strategyComparison/DefaultCompareStrategies'
import { DefaultRecordStrategyPerformance } from './DefaultRecordStrategyPerformance'
import { DefaultGetStrategyPerformanceHistory } from './DefaultGetStrategyPerformanceHistory'

describe('Strategy performance workflow integration', () => {
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

  it('records successive strategy comparisons and reads persisted history', async () => {
    const drawRepository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await drawRepository.findAll()

    expect(draws.length).toBeGreaterThan(1)

    const performanceRepository = createCsvStrategyPerformanceRepository({
      filePath
    })

    const statisticsEngine = createStatisticsEngine()

    const compareStrategies = new DefaultCompareStrategies(
      {
        name: 'Simple',
        engine: new SimpleBacktestingEngine(
          statisticsEngine,
          new SimpleRecommendationEngine()
        )
      },
      {
        name: 'GapFocused',
        engine: new SimpleBacktestingEngine(
          statisticsEngine,
          new GapFocusedRecommendationEngine()
        )
      }
    )

    const timestamps = [
      new Date('2026-11-15T10:00:00.000Z'),
      new Date('2026-11-15T11:00:00.000Z')
    ]

    const clock = {
      now: () => {
        const timestamp = timestamps.shift()

        if (!timestamp) {
          throw new Error('No timestamp available')
        }

        return timestamp
      }
    }

    const recordService = new DefaultRecordStrategyPerformance(
      drawRepository,
      compareStrategies,
      performanceRepository,
      clock
    )

    const historyService = new DefaultGetStrategyPerformanceHistory(
      performanceRepository
    )

    const first = await recordService.execute()
    const second = await recordService.execute()

    expect(first).not.toBeNull()
    expect(second).not.toBeNull()

    if (first === null || second === null) {
      throw new Error('Expected strategy performance snapshots')
    }

    expect(first.evaluatedAt).toBe('2026-11-15T10:00:00.000Z')
    expect(second.evaluatedAt).toBe('2026-11-15T11:00:00.000Z')

    expect(first.throughDrawDate).toBe(
      [...draws].sort((a, b) => a.drawDate.localeCompare(b.drawDate)).at(-1)!
        .drawDate
    )

    expect(first.comparison.first.name).toBe('Simple')
    expect(first.comparison.second.name).toBe('GapFocused')

    expect(first.comparison.first.metrics.totalPredictions).toBe(
      draws.length - 1
    )

    expect(first.comparison.second.metrics.totalPredictions).toBe(
      draws.length - 1
    )

    expect(await historyService.execute()).toEqual([first, second])

    const csv = await readFile(filePath, 'utf8')

    expect(csv.trim().split(/\r?\n/)).toHaveLength(3)
  })
})
