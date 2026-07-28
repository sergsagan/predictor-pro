import type { RecommendationEngine } from './RecommendationEngine'
import type { Recommendation } from '@server/domain/models/Recommendation'
import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

export class SimpleRecommendationEngine implements RecommendationEngine {
  recommend(statistics: StatisticsResult): Recommendation {
    const numbers = [...statistics.frequency.entries()]
      .sort((a, b) => {
        if (a[1] !== b[1]) {
          return b[1] - a[1]
        }

        return a[0] - b[0]
      })
      .slice(0, 5)
      .map(([number]) => number)

    return { numbers }
  }
}
