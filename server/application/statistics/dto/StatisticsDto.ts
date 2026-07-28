export interface GapStatisticsDto {
  average: number

  minimum: number

  maximum: number
}

export interface StatisticsDto {
  frequency: Record<number, number>

  lastSeen: Record<number, number>

  gap: Record<number, GapStatisticsDto>

  pairFrequency: Record<string, number>
}
