import type { Draw } from '@server/domain/models/Draw'
import type { BacktestResult } from '@server/domain/models/BacktestResult'
import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'

export class DefaultRunBacktesting {
  constructor(private readonly backtestingEngine: BacktestingEngine) {}

  execute(draws: readonly Draw[]): readonly BacktestResult[] {
    return this.backtestingEngine.run(draws)
  }
}
