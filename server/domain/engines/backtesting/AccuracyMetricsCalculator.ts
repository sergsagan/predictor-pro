import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'
import type { BacktestResult } from '@server/domain/models/BacktestResult'

function createEmptyDistribution(): AccuracyMetrics['distribution'] {
  return {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  }
}

export function calculateAccuracyMetrics(
  results: readonly Pick<BacktestResult, 'matches'>[]
): AccuracyMetrics {
  const totalPredictions = results.length

  const totalMatches = results.reduce(
    (total, result) => total + result.matches,
    0
  )

  const predictionsWithMatches = results.filter(
    (result) => result.matches > 0
  ).length

  const averageMatches =
    totalPredictions === 0 ? 0 : totalMatches / totalPredictions

  const hitRate =
    totalPredictions === 0 ? 0 : predictionsWithMatches / totalPredictions

  const distribution = createEmptyDistribution()

  for (const result of results) {
    switch (result.matches) {
      case 0:
        distribution[0]++
        break
      case 1:
        distribution[1]++
        break
      case 2:
        distribution[2]++
        break
      case 3:
        distribution[3]++
        break
      case 4:
        distribution[4]++
        break
      case 5:
        distribution[5]++
        break
    }
  }

  return {
    totalPredictions,
    totalMatches,
    averageMatches,
    predictionsWithMatches,
    hitRate,
    distribution
  }
}
