import type { Draw } from '@server/domain/models/Draw'
import type { StatisticsResult } from './StatisticsResult'

export interface StatisticsEngine {
  calculate(draws: readonly Draw[]): StatisticsResult
}
