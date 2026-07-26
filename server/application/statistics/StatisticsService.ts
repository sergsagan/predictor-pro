import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

export interface StatisticsService {
  calculate(): Promise<StatisticsResult>
}
