import type { RecommendationEngine } from './RecommendationEngine'
import type { Recommendation } from '@server/domain/models/Recommendation'
import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

export class SimpleRecommendationEngine implements RecommendationEngine {
  recommend(statistics: StatisticsResult): Recommendation {
    const numbers = Array.from(statistics.frequency.keys())
      .sort((a, b) => this.compareNumbers(a, b, statistics))
      .slice(0, 5)

    return { numbers }
  }

  private compareNumbers(
    a: number,
    b: number,
    statistics: StatisticsResult
  ): number {
    const frequencyA = statistics.frequency.get(a) ?? 0
    const frequencyB = statistics.frequency.get(b) ?? 0

    if (frequencyA !== frequencyB) {
      return frequencyB - frequencyA
    }

    const currentGapA = statistics.currentGap.get(a) ?? 0
    const currentGapB = statistics.currentGap.get(b) ?? 0

    if (currentGapA !== currentGapB) {
      return currentGapB - currentGapA
    }

    return a - b
  }
}
