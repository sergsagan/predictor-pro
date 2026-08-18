import type {
  AlgorithmComparison,
  AlgorithmResult
} from './AlgorithmComparison'

export function compareAlgorithms(
  first: AlgorithmResult,
  second: AlgorithmResult
): AlgorithmComparison {
  const winner =
    first.metrics.hitRate > second.metrics.hitRate
      ? first.name
      : second.metrics.hitRate > first.metrics.hitRate
        ? second.name
        : null

  return {
    first,
    second,
    winner
  }
}
