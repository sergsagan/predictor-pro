import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'

import { DefaultPredictionEvaluationService } from './DefaultPredictionEvaluationService'

describe('DefaultPredictionEvaluationService', () => {
  it('evaluates prediction against actual draw', () => {
    const prediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    const actualDraw: Draw = {
      drawDate: '2026-09-01',
      numbers: [7, 15, 20, 32, 45],
      extraNumbers: [2, 8]
    }

    const countMatchesMock = vi.fn().mockReturnValue(2)

    const service = new DefaultPredictionEvaluationService(countMatchesMock)

    const result = service.execute(prediction, actualDraw)

    expect(countMatchesMock).toHaveBeenCalledWith(prediction, actualDraw)

    expect(result).toEqual({
      prediction,
      actualDraw,
      matches: 2
    })
  })
})
