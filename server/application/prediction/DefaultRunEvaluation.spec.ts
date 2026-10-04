import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'

import { DefaultRunEvaluation } from './DefaultRunEvaluation'

describe('DefaultRunEvaluation', () => {
  it('evaluates pending predictions against the next draw', async () => {
    const prediction: Prediction = {
      predictionDate: '2026-09-01',
      numbers: [7, 15, 23, 32, 44]
    }

    const draw: Draw = {
      drawDate: '2026-09-02',
      numbers: [7, 15, 20, 32, 45],
      extraNumbers: [2, 8]
    }

    const findPendingPredictions = {
      execute: vi.fn().mockResolvedValue([prediction])
    }

    const drawRepository = {
      findAll: vi.fn().mockResolvedValue([draw])
    }

    const evaluatePrediction = {
      execute: vi.fn().mockResolvedValue({
        prediction,
        actualDraw: draw,
        matches: 2
      })
    }

    const service = new DefaultRunEvaluation(
      findPendingPredictions,
      drawRepository,
      evaluatePrediction
    )

    await service.execute()

    expect(findPendingPredictions.execute).toHaveBeenCalledOnce()

    expect(drawRepository.findAll).toHaveBeenCalledOnce()

    expect(evaluatePrediction.execute).toHaveBeenCalledWith(prediction, draw)
  })

  it('does not evaluate a prediction when there is no later draw', async () => {
    const prediction: Prediction = {
      predictionDate: '2026-09-03',
      numbers: [7, 15, 23, 32, 44]
    }

    const previousDraw: Draw = {
      drawDate: '2026-09-02',
      numbers: [1, 2, 3, 4, 5],
      extraNumbers: [6, 7]
    }

    const findPendingPredictions = {
      execute: vi.fn().mockResolvedValue([prediction])
    }

    const drawRepository = {
      findAll: vi.fn().mockResolvedValue([previousDraw])
    }

    const evaluatePrediction = {
      execute: vi.fn()
    }

    const service = new DefaultRunEvaluation(
      findPendingPredictions,
      drawRepository,
      evaluatePrediction
    )

    await service.execute()

    expect(evaluatePrediction.execute).not.toHaveBeenCalled()
  })
})
