import type { Draw } from '@server/domain/models/Draw'
import type { AlgorithmComparison } from '@server/domain/engines/backtesting/AlgorithmComparison'
import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'

import { calculateAccuracyMetrics } from '@server/domain/engines/backtesting/AccuracyMetricsCalculator'
import { compareAlgorithms } from '@server/domain/engines/backtesting/AlgorithmComparisonCalculator'

type StrategyBacktestingEngine = Readonly<{
  name: string
  engine: BacktestingEngine
}>

export class DefaultCompareStrategies {
  constructor(
    private readonly first: StrategyBacktestingEngine,
    private readonly second: StrategyBacktestingEngine
  ) {}

  execute(draws: readonly Draw[]): AlgorithmComparison {
    const firstResults = this.first.engine.run(draws)
    const secondResults = this.second.engine.run(draws)

    const firstMetrics = calculateAccuracyMetrics(firstResults)
    const secondMetrics = calculateAccuracyMetrics(secondResults)

    return compareAlgorithms(
      {
        name: this.first.name,
        metrics: firstMetrics
      },
      {
        name: this.second.name,
        metrics: secondMetrics
      }
    )
  }
}
