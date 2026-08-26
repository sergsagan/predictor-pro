import type { Draw } from '@server/domain/models/Draw'
import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'

import { calculateAccuracyMetrics } from '@server/domain/engines/backtesting/AccuracyMetricsCalculator'

import type { RecommendationStrategyConfig } from '../../config/RecommendationStrategyConfig'
import type { WeightOptimizationResult } from './WeightOptimizationResult'

type BacktestingEngineFactory = (
  config: RecommendationStrategyConfig
) => BacktestingEngine

export class WeightOptimizationEvaluator {
  constructor(
    private readonly createBacktestingEngine: BacktestingEngineFactory
  ) {}

  evaluate(
    config: RecommendationStrategyConfig,
    draws: readonly Draw[]
  ): WeightOptimizationResult {
    const backtestingEngine = this.createBacktestingEngine(config)

    const backtestResults = backtestingEngine.run(draws)

    const metrics = calculateAccuracyMetrics(backtestResults)

    return {
      weights: config.weights,
      metrics
    }
  }

  evaluateAll(
    configs: readonly RecommendationStrategyConfig[],
    draws: readonly Draw[]
  ): readonly WeightOptimizationResult[] {
    return configs.map((config) => this.evaluate(config, draws))
  }
}
