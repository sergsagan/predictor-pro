import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionEvaluation } from '@server/domain/models/PredictionEvaluation'

import type { PredictionEvaluationRepository } from '@server/domain/repositories/predictions/PredictionEvaluationRepository'

import { DefaultEvaluatePrediction } from './DefaultEvaluatePrediction'

describe('DefaultEvaluatePrediction', () => {
  it('evaluates prediction and saves the result', async () => {
    const prediction: Prediction = {
      predictionDate: '2026-09-01',
      numbers: [7, 15, 23, 32, 44]
    }

    const actualDraw: Draw = {
      drawDate: '2026-09-02',
      numbers: [7, 15, 20, 32, 45],
      extraNumbers: [2, 8]
    }

    const evaluation: PredictionEvaluation = {
      prediction,
      actualDraw,
      matches: 3
    }

    const evaluationService = {
      execute: vi.fn().mockReturnValue(evaluation)
    }

    const evaluationRepository: PredictionEvaluationRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      findAll: vi.fn(),
      findByPredictionDate: vi.fn()
    }

    const service = new DefaultEvaluatePrediction(
      evaluationService,
      evaluationRepository
    )

    const result = await service.execute(prediction, actualDraw)

    expect(evaluationService.execute).toHaveBeenCalledWith(
      prediction,
      actualDraw
    )

    expect(evaluationRepository.save).toHaveBeenCalledWith(evaluation)

    expect(result).toBe(evaluation)
  })
})
