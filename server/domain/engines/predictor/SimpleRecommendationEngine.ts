import type { RecommendationEngine } from './RecommendationEngine'
import type { Recommendation } from '@server/domain/models/Recommendation'
import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

export class SimpleRecommendationEngine implements RecommendationEngine {
  recommend(statistics: StatisticsResult): Recommendation {
    const numbers = Array.from(statistics.frequency.keys())
      .sort((a, b) => {
        const frequencyA = this.getFrequencyScore(a, statistics)
        const frequencyB = this.getFrequencyScore(b, statistics)

        if (frequencyA !== frequencyB) {
          return frequencyB - frequencyA
        }

        return a - b
      })
      .slice(0, 5)
    return { numbers }
  }

  private getFrequencyScore(
    number: number,
    statistics: StatisticsResult
  ): number {
    return statistics.frequency.get(number) ?? 0
  }
}
