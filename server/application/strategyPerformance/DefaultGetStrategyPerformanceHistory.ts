import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'
import type { StrategyPerformanceRepository } from '@server/domain/repositories/strategies/StrategyPerformanceRepository'

export class DefaultGetStrategyPerformanceHistory {
  constructor(private readonly repository: StrategyPerformanceRepository) {}

  async execute(): Promise<readonly StrategyPerformanceSnapshot[]> {
    return this.repository.findAll()
  }
}
