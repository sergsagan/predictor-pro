import type { RecommendationEngine } from './RecommendationEngine'
import type { Recommendation } from '@server/domain/models/Recommendation'
import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'
import { calculatePairScore } from '../statistics/calculators/pairFrequency/calculatePairScore'

export class SimpleRecommendationEngine implements RecommendationEngine {
  recommend(statistics: StatisticsResult): Recommendation {
    const availableNumbers = Array.from(statistics.frequency.keys())

    const selectedNumbers: number[] = []
    const recommendationNumbers: Recommendation['numbers'] = []

    while (recommendationNumbers.length < 5 && availableNumbers.length > 0) {
      availableNumbers.sort((a, b) =>
        this.compareNumbers(a, b, statistics, selectedNumbers)
      )

      const best = availableNumbers.shift()

      if (best !== undefined) {
        const frequency = statistics.frequency.get(best) ?? 0
        const currentGap = statistics.currentGap.get(best) ?? 0
        const lastSeen = statistics.lastSeen.get(best) ?? 0
        const pairScore = calculatePairScore(
          best,
          selectedNumbers,
          statistics.pairFrequency
        )

        recommendationNumbers.push({
          value: best,
          frequency,
          currentGap,
          lastSeen,
          pairScore,
          score: this.calculateScore(frequency, currentGap, pairScore)
        })

        selectedNumbers.push(best)
      }
    }

    return {
      numbers: recommendationNumbers
    }
  }

  private calculateScore(
    frequency: number,
    currentGap: number,
    pairScore: number
  ): number {
    return frequency + currentGap + pairScore
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

    const pairScoreA = calculatePairScore(
      a,
      selectedNumbers,
      statistics.pairFrequency
    )

    const pairScoreB = calculatePairScore(
      b,
      selectedNumbers,
      statistics.pairFrequency
    )

    if (pairScoreA !== pairScoreB) {
      return pairScoreB - pairScoreA
    }

    return a - b
  }
}
