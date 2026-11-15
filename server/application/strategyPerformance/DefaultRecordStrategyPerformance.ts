import type { Draw } from '@server/domain/models/Draw'
import type { AlgorithmComparison } from '@server/domain/engines/backtesting/AlgorithmComparison'
import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'
import type { DrawRepository } from '@server/domain/repositories/draws/DrawRepository'
import type { StrategyPerformanceRepository } from '@server/domain/repositories/strategies/StrategyPerformanceRepository'

type CompareStrategies = Readonly<{
  execute(draws: readonly Draw[]): AlgorithmComparison
}>

type Clock = Readonly<{
  now(): Date
}>

export class DefaultRecordStrategyPerformance {
  constructor(
    private readonly drawRepository: DrawRepository,
    private readonly compareStrategies: CompareStrategies,
    private readonly performanceRepository: StrategyPerformanceRepository,
    private readonly clock: Clock
  ) {}

  async execute(): Promise<StrategyPerformanceSnapshot | null> {
    const draws = await this.drawRepository.findAll()

    if (draws.length === 0) {
      return null
    }

    const comparison = this.compareStrategies.execute(draws)

    const throughDrawDate = draws.reduce((latest, draw) =>
      draw.drawDate > latest.drawDate ? draw : latest
    ).drawDate

    const snapshot: StrategyPerformanceSnapshot = {
      evaluatedAt: this.clock.now().toISOString(),
      throughDrawDate,
      comparison
    }

    await this.performanceRepository.save(snapshot)

    return snapshot
  }
}
