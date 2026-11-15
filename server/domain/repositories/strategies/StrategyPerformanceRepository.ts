import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'

export type StrategyPerformanceRepository = Readonly<{
  save(snapshot: StrategyPerformanceSnapshot): Promise<void>
  findAll(): Promise<readonly StrategyPerformanceSnapshot[]>
}>
