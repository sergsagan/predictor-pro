import type { RecommendationEngine } from './RecommendationEngine'
import type { Recommendation } from '@server/domain/models/Recommendation'
import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'
import { createPairKey } from '../statistics/calculators/pairFrequency/createPairKey'

export class SimpleRecommendationEngine implements RecommendationEngine {
  recommend(statistics: StatisticsResult): Recommendation {
    const availableNumbers = Array.from(statistics.frequency.keys())
    const numbers: number[] = []

    while (numbers.length < 5 && availableNumbers.length > 0) {
      availableNumbers.sort((a, b) =>
        this.compareNumbers(a, b, statistics, numbers)
      )

      const best = availableNumbers.shift()

      if (best !== undefined) {
        numbers.push(best)
      }
    }

    return { numbers }
  }

  private compareNumbers(
    a: number,
    b: number,
    statistics: StatisticsResult,
    selectedNumbers: readonly number[]
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

    const pairScoreA = this.getPairFrequencyScore(
      a,
      selectedNumbers,
      statistics
    )

    const pairScoreB = this.getPairFrequencyScore(
      b,
      selectedNumbers,
      statistics
    )

    if (pairScoreA !== pairScoreB) {
      return pairScoreB - pairScoreA
    }

    return a - b
  }

  private getPairFrequencyScore(
    candidate: number,
    selectedNumbers: readonly number[],
    statistics: StatisticsResult
  ): number {
    let score = 0

    for (const selected of selectedNumbers) {
      score +=
        statistics.pairFrequency.get(createPairKey(candidate, selected)) ?? 0
    }

    return score
  }
}
