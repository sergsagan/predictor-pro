import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

import { createPairKey } from '@server/domain/engines/statistics/calculators/pairFrequency/createPairKey'

export const samplePairFrequencyRecommendationStatisticsResult: StatisticsResult =
  {
    frequency: new Map([
      [3, 20],
      [4, 10],
      [5, 10]
    ]),

    currentGap: new Map([
      [3, 1],
      [4, 5],
      [5, 5]
    ]),

    lastSeen: new Map(),

    gap: new Map(),

    pairFrequency: new Map([
      [createPairKey(3, 4), 2],
      [createPairKey(3, 5), 8]
    ])
  }
