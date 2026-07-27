import type { Draw } from '@server/domain/models/Draw'

import type { StatisticsEngine } from './StatisticsEngine'
import { calculateFrequency } from './calculators/frequency/FrequencyCalculator'
import { calculateLastSeen } from './calculators/lastSeen/LastSeenCalculator'

export function createStatisticsEngine(): StatisticsEngine {
  return {
    calculate(draws: readonly Draw[]) {
      return {
        frequency: calculateFrequency(draws),
        lastSeen: calculateLastSeen(draws)
      }
    }
  }
}
