export type AccuracyMetrics = Readonly<{
  totalPredictions: number
  totalMatches: number
  averageMatches: number
  predictionsWithMatches: number
  hitRate: number
  distribution: Readonly<{
    0: number
    1: number
    2: number
    3: number
    4: number
    5: number
  }>
}>
