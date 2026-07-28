import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

import type { StatisticsDto } from '@server/application/statistics/dto/StatisticsDto'

function toRecord<K extends string | number, V>(
  map: ReadonlyMap<K, V>
): Record<K, V> {
  return Object.fromEntries(map) as Record<K, V>
}

export function toStatisticsDto(statistics: StatisticsResult): StatisticsDto {
  return {
    frequency: toRecord(statistics.frequency),
    lastSeen: toRecord(statistics.lastSeen),
    gap: toRecord(statistics.gap),
    pairFrequency: toRecord(statistics.pairFrequency)
  }
}
