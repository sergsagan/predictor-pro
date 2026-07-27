import type { Draw } from '../../models/Draw'
import type { StatisticsEngine } from './StatisticsEngine'
import type { StatisticsResult } from './StatisticsResult'

import { calculateFrequency } from './calculators/frequency/FrequencyCalculator'
import { calculateLastSeen } from './calculators/lastSeen/LastSeenCalculator'

export function createSimpleStatisticsEngine(): StatisticsEngine {
  return {
    calculate(draws: readonly Draw[]): StatisticsResult {
      return {
        lastSeen: calculateLastSeen(draws),
        frequency: calculateFrequency(draws)
      }
    }
  }
}
