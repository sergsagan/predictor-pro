import type { Frequency } from './calculators/frequency/Frequency'
import type { LastSeen } from './calculators/lastSeen/LastSeen'
import type { Gap } from './calculators/gap/Gap'
import type { PairFrequency } from './calculators/pairFrequency/PairFrequency'
import type { CurrentGap } from './calculators/currentGap/СurrentGap'

export interface StatisticsResult {
  frequency: Frequency
  lastSeen: LastSeen
  gap: Gap
  pairFrequency: PairFrequency
  currentGap: CurrentGap
}
