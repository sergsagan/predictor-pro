import type { Frequency } from './calculators/frequency/Frequency'
import type { LastSeen } from './calculators/lastSeen/LastSeen'

export interface StatisticsResult {
  frequency: Frequency
  lastSeen: LastSeen
}
