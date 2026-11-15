import type { AlgorithmComparison } from '@server/domain/engines/backtesting/AlgorithmComparison'

export type StrategyPerformanceSnapshot = Readonly<{
  evaluatedAt: string
  throughDrawDate: string
  comparison: AlgorithmComparison
}>
