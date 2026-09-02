import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'

export function countPredictionMatches(
  prediction: Prediction,
  draw: Draw
): number {
  return prediction.numbers.filter((number) => draw.numbers.includes(number))
    .length
}
