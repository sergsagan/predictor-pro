import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

import type { StatisticsDto } from '@server/application/statistics/dto/StatisticsDto'

function toRecord<T>(map: ReadonlyMap<number, T>): Record<number, T> {
  return Object.fromEntries(map) as Record<number, T>
}

export function toStatisticsDto(statistics: StatisticsResult): StatisticsDto {
  return {
    frequency: toRecord(statistics.frequency),
    lastSeen: toRecord(statistics.lastSeen),
    gap: toRecord(statistics.gap)
  }
}
