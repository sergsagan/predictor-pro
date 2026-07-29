import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

import { createPairKey } from '@server/domain/engines/statistics/calculators/pairFrequency/createPairKey'

export const samplePairFrequencyRecommendationStatisticsResult: StatisticsResult =
  {
    frequency: new Map([
      [3, 20],
      [4, 19],
      [5, 10],
      [6, 10]
    ]),

    currentGap: new Map([
      [3, 1],
      [4, 1],
      [5, 5],
      [6, 5]
    ]),

    lastSeen: new Map(),

    gap: new Map(),

    pairFrequency: new Map([
      [createPairKey(3, 5), 2],
      [createPairKey(4, 5), 1],

      [createPairKey(3, 6), 8],
      [createPairKey(4, 6), 5]
    ])
  }
