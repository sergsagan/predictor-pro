import { describe, expect, it } from 'vitest'

import type { StatisticsEngine } from '@server/domain/engines/statistics/StatisticsEngine'
import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'
import type { DrawRepository } from '@server/domain/repositories/draws/DrawRepository'

import { sampleDraws } from '@test/fixtures/sampleDraws'

import { createStatisticsService } from './DefaultStatisticsService'

describe('DefaultStatisticsService', () => {
  it('loads draws from repository and delegates calculation to statistics engine', async () => {
    // Arrange
    const expectedStatistics: StatisticsResult = {
      frequency: new Map([[17, 3]]),
      gap: new Map([[17, 0]])
    }

    const repository: DrawRepository = {
      async findAll() {
        return sampleDraws
      },

      async findLatest() {
        return null
      },

      async findByDate() {
        return null
      }
    }

    const engine: StatisticsEngine = {
      calculate(draws) {
        expect(draws).toEqual(sampleDraws)

        return expectedStatistics
      }
    }

    const service = createStatisticsService({
      repository,
      engine
    })

    // Act
    const statistics = await service.calculate()

    // Assert
    expect(statistics).toBe(expectedStatistics)
  })
})
