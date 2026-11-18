import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'
import type { StrategySelection } from '@server/domain/models/StrategySelection'

export class DefaultStrategyPerformanceEvaluator {
  constructor(private readonly minimumPredictions = 30) {}

  execute(snapshot: StrategyPerformanceSnapshot): StrategySelection {
    const { first, second } = snapshot.comparison

    const selection = {
      evaluatedAt: snapshot.evaluatedAt,
      throughDrawDate: snapshot.throughDrawDate
    }

    if (
      first.metrics.totalPredictions < this.minimumPredictions ||
      second.metrics.totalPredictions < this.minimumPredictions
    ) {
      return {
        strategy: 'simple',
        reason: 'insufficient-sample',
        ...selection
      }
    }

    if (first.metrics.hitRate === second.metrics.hitRate) {
      return {
        strategy: 'simple',
        reason: 'tie',
        ...selection
      }
    }

    return {
      strategy:
        first.metrics.hitRate > second.metrics.hitRate
          ? 'simple'
          : 'gap-focused',
      reason: 'higher-hit-rate',
      ...selection
    }
  }
}
