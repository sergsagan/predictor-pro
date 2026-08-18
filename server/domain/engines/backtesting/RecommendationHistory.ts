import type { BacktestResult } from '@server/domain/models/BacktestResult'

export type RecommendationHistoryItem = Readonly<{
  drawDate: string
  recommendation: BacktestResult['recommendation']
  actualDraw: BacktestResult['actualDraw']
  matches: number
}>

export type RecommendationHistory = readonly RecommendationHistoryItem[]
