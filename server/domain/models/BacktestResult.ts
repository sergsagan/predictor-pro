import type { Recommendation } from './Recommendation'
import type { Draw } from './Draw'

export interface BacktestResult {
  recommendation: Recommendation
  actualDraw: Draw
  matches: number
}
