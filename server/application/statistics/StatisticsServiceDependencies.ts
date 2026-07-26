import type { StatisticsEngine } from '@server/domain/engines/statistics/StatisticsEngine'
import type { DrawRepository } from '@server/domain/repositories/draws/DrawRepository'

export interface StatisticsServiceDependencies {
  repository: DrawRepository

  engine: StatisticsEngine
}
