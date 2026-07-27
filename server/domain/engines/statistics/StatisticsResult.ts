import type { Frequency } from './calculators/frequency/Frequency'
import type { LastSeen } from './calculators/lastSeen/LastSeen'
import type { Gap } from './calculators/gap/Gap'

export interface StatisticsResult {
  frequency: Frequency
  lastSeen: LastSeen
  gap: Gap
}
