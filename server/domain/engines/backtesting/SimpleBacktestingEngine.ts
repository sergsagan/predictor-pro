import type { Draw } from '@server/domain/models/Draw'
import type { BacktestResult } from '@server/domain/models/BacktestResult'

import type { StatisticsEngine } from '../statistics/StatisticsEngine'
import type { RecommendationEngine } from '../predictor/RecommendationEngine'

import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'

export class SimpleBacktestingEngine implements BacktestingEngine {
  constructor(
    private readonly statisticsEngine: StatisticsEngine,
    private readonly recommendationEngine: RecommendationEngine
  ) {}

  run(draws: readonly Draw[]): readonly BacktestResult[] {
    const chronologicalDraws = [...draws].sort((a, b) =>
      a.drawDate.localeCompare(b.drawDate)
    )

    if (chronologicalDraws.length < 2) {
      return []
    }

    const results: BacktestResult[] = []

    for (let index = 1; index < chronologicalDraws.length; index++) {
      const actualDraw = chronologicalDraws[index]

      if (!actualDraw) {
        continue
      }

      const historicalDraws = chronologicalDraws.slice(0, index)

      const statistics = this.statisticsEngine.calculate(historicalDraws)

      const recommendation = this.recommendationEngine.recommend(statistics)

      const matches = recommendation.numbers.filter(({ value }) =>
        actualDraw.numbers.includes(value)
      ).length

      results.push({
        recommendation,
        actualDraw,
        matches
      })
    }

    return results
  }
}
