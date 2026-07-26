import type { Draw } from '../../models/Draw'
import type { StatisticsEngine } from './StatisticsEngine'
import type { StatisticsResult } from './StatisticsResult'

import { calculateFrequency } from './calculators/frequency/FrequencyCalculator'

export function createSimpleStatisticsEngine(): StatisticsEngine {
  return {
    calculate(draws: readonly Draw[]): StatisticsResult {
      return {
        frequency: calculateFrequency(draws)
      }
    }
  }
}
