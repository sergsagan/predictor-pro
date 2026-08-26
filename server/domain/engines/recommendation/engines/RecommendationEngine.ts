import type { Recommendation } from '@server/domain/models/Recommendation'
import type { StatisticsResult } from '@server/domain/engines/statistics/StatisticsResult'

export interface RecommendationEngine {
  recommend(statistics: StatisticsResult): Recommendation
}
