import type { RecommendationStrategy } from '@server/domain/engines/recommendation/config/RecommendationStrategy'

export type StrategySelectionReason =
  'no-history' | 'insufficient-sample' | 'higher-hit-rate' | 'tie'

export type StrategySelection = Readonly<{
  strategy: RecommendationStrategy
  reason: StrategySelectionReason
  evaluatedAt: string | null
  throughDrawDate: string | null
}>
