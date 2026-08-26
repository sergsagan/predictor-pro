import type { StrategyOptimizationResult } from './StrategyOptimizationResult'

export function optimizeStrategies(
  results: readonly StrategyOptimizationResult[]
): StrategyOptimizationResult | undefined {
  return results.reduce<StrategyOptimizationResult | undefined>(
    (best, current) =>
      best === undefined || current.metrics.hitRate > best.metrics.hitRate
        ? current
        : best,
    undefined
  )
}
