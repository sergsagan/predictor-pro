import type { Draw } from './Draw'
import type { Prediction } from './Prediction'

export type PredictionEvaluation = Readonly<{
  prediction: Prediction
  actualDraw: Draw
  matches: number
}>
