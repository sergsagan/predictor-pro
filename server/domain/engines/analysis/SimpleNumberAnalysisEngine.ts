import type { NumberAnalysisEngine } from './NumberAnalysisEngine'
import type { NumberAnalysis } from '@server/domain/models/NumberAnalysis'
import type { StatisticsResult } from '../statistics/StatisticsResult'
import { calculatePairScore } from '../statistics/calculators/pairFrequency/calculatePairScore'
import { calculateRecommendationScore } from '../statistics/calculators/recommendation/calculateRecommendationScore'

export class SimpleNumberAnalysisEngine implements NumberAnalysisEngine {
  analyze(
    number: number,
    selectedNumbers: readonly number[],
    statistics: StatisticsResult
  ): NumberAnalysis {
    const frequency = statistics.frequency.get(number) ?? 0
    const currentGap = statistics.currentGap.get(number) ?? 0
    const lastSeen = statistics.lastSeen.get(number) ?? 0
    const pairScore = calculatePairScore(
      number,
      selectedNumbers,
      statistics.pairFrequency
    )
    const recommendationScore = calculateRecommendationScore(
      frequency,
      currentGap,
      pairScore
    )

    return {
      value: number,
      frequency,
      currentGap,
      lastSeen,
      pairScore,
      recommendationScore
    }
  }
}
