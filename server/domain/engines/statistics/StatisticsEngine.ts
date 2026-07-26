import type { Draw } from '../../models/Draw'
import type { StatisticsResult } from './StatisticsResult'

export interface StatisticsEngine {
  calculate(draws: readonly Draw[]): StatisticsResult
}
