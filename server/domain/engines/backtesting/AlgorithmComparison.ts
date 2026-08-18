import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'

export type AlgorithmResult = Readonly<{
  name: string
  metrics: AccuracyMetrics
}>

export type AlgorithmComparison = Readonly<{
  first: AlgorithmResult
  second: AlgorithmResult
  winner: string | null
}>
