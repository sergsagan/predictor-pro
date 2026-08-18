import type { BacktestResult } from '@server/domain/models/BacktestResult'

import type { RecommendationHistory } from './RecommendationHistory'

export function calculateRecommendationHistory(
  results: readonly BacktestResult[]
): RecommendationHistory {
  return results.map((result) => ({
    drawDate: result.actualDraw.drawDate,
    recommendation: result.recommendation,
    actualDraw: result.actualDraw,
    matches: result.matches
  }))
}
