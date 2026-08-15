import type { Draw } from '@server/domain/models/Draw'
import type { BacktestResult } from '@server/domain/models/BacktestResult'

export interface BacktestingEngine {
  run(draws: readonly Draw[]): readonly BacktestResult[]
}
