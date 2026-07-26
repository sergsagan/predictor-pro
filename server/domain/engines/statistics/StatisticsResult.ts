import type { Frequency } from './calculators/frequency/Frequency'
import type { Gap } from './calculators/gap/Gap'

export interface StatisticsResult {
  frequency: Frequency
  gap: Gap
}
