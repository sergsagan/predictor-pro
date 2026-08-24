import type { WeightOptimizationResult } from './WeightOptimizationResult'

export function selectBestWeightOptimization(
  first: WeightOptimizationResult,
  second: WeightOptimizationResult
): WeightOptimizationResult {
  return second.metrics.hitRate > first.metrics.hitRate ? second : first
}
