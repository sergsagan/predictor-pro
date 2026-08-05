import type { StatisticsResult } from '../statistics/StatisticsResult'
import type { NumberAnalysis } from '@server/domain/models/NumberAnalysis'

export interface NumberAnalysisEngine {
  analyze(
    number: number,
    selectedNumbers: readonly number[],
    statistics: StatisticsResult
  ): NumberAnalysis
}
