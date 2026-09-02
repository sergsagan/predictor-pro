import { describe, expect, it } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'

import { countPredictionMatches } from '@server/domain/engines/backtesting/PredictionMatchCalculator'
import { DefaultPredictionEvaluationService } from './DefaultPredictionEvaluationService'

describe('DefaultPredictionEvaluationService integration', () => {
  it('evaluates prediction using real matching logic', () => {
    const prediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    const actualDraw: Draw = {
      drawDate: '2026-09-01',
      numbers: [7, 15, 20, 32, 45],
      extraNumbers: [2, 8]
    }

    const service = new DefaultPredictionEvaluationService(
      countPredictionMatches
    )

    const result = service.execute(prediction, actualDraw)

    expect(result).toEqual({
      prediction,
      actualDraw,
      matches: 3
    })
  })

  it('does not count extra numbers as matches', () => {
    const prediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    const actualDraw: Draw = {
      drawDate: '2026-09-01',
      numbers: [1, 2, 3, 4, 5],
      extraNumbers: [7, 15]
    }

    const service = new DefaultPredictionEvaluationService(
      countPredictionMatches
    )

    const result = service.execute(prediction, actualDraw)

    expect(result.matches).toBe(0)
  })
})
