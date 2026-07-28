import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

import { calculateFrequency } from '@server/domain/engines/statistics/calculators/frequency/FrequencyCalculator'
import { calculateGap } from '@server/domain/engines/statistics/calculators/gap/GapCalculator'
import { calculateLastSeen } from '@server/domain/engines/statistics/calculators/lastSeen/LastSeenCalculator'
import { calculatePairFrequency } from '@server/domain/engines/statistics/calculators/pairFrequency/PairFrequencyCalculator'

import { sampleDraws } from './sampleDraws'
import { calculateCurrentGap } from '@server/domain/engines/statistics/calculators/currentGap/CurrentGapCalculator'

export const sampleStatisticsResult: StatisticsResult = {
  frequency: calculateFrequency(sampleDraws),
  lastSeen: calculateLastSeen(sampleDraws),
  gap: calculateGap(sampleDraws),
  pairFrequency: calculatePairFrequency(sampleDraws),
  currentGap: calculateCurrentGap(sampleDraws)
}
