import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

export const sampleCurrentGapRecommendationStatisticsResult: StatisticsResult =
  {
    frequency: new Map([
      [1, 10],
      [2, 10],
      [3, 9]
    ]),

    currentGap: new Map([
      [1, 0],
      [2, 5],
      [3, 100]
    ]),

    lastSeen: new Map(),

    gap: new Map(),

    pairFrequency: new Map()
  }
