import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'
import type { StrategySelection } from '@server/domain/models/StrategySelection'

type StrategyPerformanceHistory = Readonly<{
  execute(): Promise<readonly StrategyPerformanceSnapshot[]>
}>

type StrategyPerformanceEvaluator = Readonly<{
  execute(snapshot: StrategyPerformanceSnapshot): StrategySelection
}>

export class DefaultAdaptiveStrategySelector {
  constructor(
    private readonly historyService: StrategyPerformanceHistory,
    private readonly evaluator: StrategyPerformanceEvaluator
  ) {}

  async execute(): Promise<StrategySelection> {
    const history = await this.historyService.execute()

    if (history.length === 0) {
      return {
        strategy: 'simple',
        reason: 'no-history',
        evaluatedAt: null,
        throughDrawDate: null
      }
    }

    const latestSnapshot = [...history].sort((a, b) =>
      b.evaluatedAt.localeCompare(a.evaluatedAt)
    )[0]!

    return this.evaluator.execute(latestSnapshot)
  }
}
