import type { Draw } from '../../models/Draw'
import type { StatisticsEngine } from './StatisticsEngine'
import type { StatisticsResult } from './StatisticsResult'

import { calculateFrequency } from './calculators/frequency/FrequencyCalculator'
import { calculateLastSeen } from './calculators/lastSeen/LastSeenCalculator'
import { calculateGap } from './calculators/gap/GapCalculator'
import { calculatePairFrequency } from './calculators/pairFrequency/PairFrequencyCalculator'
import { calculateCurrentGap } from './calculators/currentGap/CurrentGapCalculator'

export function createSimpleStatisticsEngine(): StatisticsEngine {
  return {
    calculate(draws: readonly Draw[]): StatisticsResult {
      return {
        lastSeen: calculateLastSeen(draws),
        frequency: calculateFrequency(draws),
        gap: calculateGap(draws),
        pairFrequency: calculatePairFrequency(draws),
        currentGap: calculateCurrentGap(draws)
      }
    }
  }
}
