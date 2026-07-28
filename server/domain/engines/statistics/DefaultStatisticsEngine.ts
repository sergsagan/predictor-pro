import type { Draw } from '@server/domain/models/Draw'

import type { StatisticsEngine } from './StatisticsEngine'
import { calculateFrequency } from './calculators/frequency/FrequencyCalculator'
import { calculateLastSeen } from './calculators/lastSeen/LastSeenCalculator'
import { calculateGap } from './calculators/gap/GapCalculator'
import { calculatePairFrequency } from './calculators/pairFrequency/PairFrequencyCalculator'

export function createStatisticsEngine(): StatisticsEngine {
  return {
    calculate(draws: readonly Draw[]) {
      return {
        frequency: calculateFrequency(draws),
        lastSeen: calculateLastSeen(draws),
        gap: calculateGap(draws),
        pairFrequency: calculatePairFrequency(draws)
      }
    }
  }
}
