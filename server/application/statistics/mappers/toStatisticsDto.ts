import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

import type { StatisticsDto } from '@server/application/statistics/dto/StatisticsDto.ts'

function toRecord(map: ReadonlyMap<number, number>): Record<number, number> {
  return Object.fromEntries(map) as Record<number, number>
}

export function toStatisticsDto(statistics: StatisticsResult): StatisticsDto {
  return {
    frequency: toRecord(statistics.frequency),
    lastSeen: toRecord(statistics.lastSeen)
  }
}
