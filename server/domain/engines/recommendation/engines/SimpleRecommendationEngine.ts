import type { RecommendationEngine } from './RecommendationEngine'
import type { Recommendation } from '@server/domain/models/Recommendation'
import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'
import type { RecommendationWeights } from '../config/RecommendationWeights'
import { calculatePairScore } from '../../statistics/calculators/pairFrequency/calculatePairScore'
import { calculateWeightedScore } from '../../statistics/calculators/recommendation/WeightedScoreCalculator'

export class SimpleRecommendationEngine implements RecommendationEngine {
  private readonly weights: RecommendationWeights

  constructor(
    weights: RecommendationWeights = {
      frequency: 1,
      currentGap: 1,
      pairScore: 1
    }
  ) {
    this.weights = weights
  }

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
          score: calculateWeightedScore({
            frequency,
            currentGap,
            pairScore,
            weights: this.weights
          })
        })

        selectedNumbers.push(best)
      }
    }

    return {
      numbers: recommendationNumbers
    }
  }

  private compareNumbers(
    a: number,
    b: number,
    statistics: StatisticsResult,
    selectedNumbers: readonly number[]
  ): number {
    const frequencyA = statistics.frequency.get(a) ?? 0
    const frequencyB = statistics.frequency.get(b) ?? 0

    const currentGapA = statistics.currentGap.get(a) ?? 0
    const currentGapB = statistics.currentGap.get(b) ?? 0

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

    const scoreA = calculateWeightedScore({
      frequency: frequencyA,
      currentGap: currentGapA,
      pairScore: pairScoreA,
      weights: this.weights
    })

    const scoreB = calculateWeightedScore({
      frequency: frequencyB,
      currentGap: currentGapB,
      pairScore: pairScoreB,
      weights: this.weights
    })

    if (scoreA !== scoreB) {
      return scoreB - scoreA
    }

    return a - b
  }
}
