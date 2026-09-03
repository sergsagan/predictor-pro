import { describe, expect, it, vi } from 'vitest'

import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionEvaluation } from '@server/domain/models/PredictionEvaluation'

import type { PredictionRepository } from '@server/domain/repositories/predictions/PredictionRepository'
import type { PredictionEvaluationRepository } from '@server/domain/repositories/predictions/PredictionEvaluationRepository'

import { DefaultFindPendingPredictions } from './DefaultFindPendingPredictions'

describe('DefaultFindPendingPredictions', () => {
  it('returns predictions without evaluations', async () => {
    const firstPrediction: Prediction = {
      predictionDate: '2026-09-01',
      numbers: [7, 15, 23, 32, 44]
    }

    const secondPrediction: Prediction = {
      predictionDate: '2026-09-02',
      numbers: [3, 12, 21, 34, 45]
    }

    const evaluation: PredictionEvaluation = {
      prediction: firstPrediction,
      actualDraw: {
        drawDate: '2026-09-02',
        numbers: [7, 15, 20, 32, 45],
        extraNumbers: [2, 8]
      },
      matches: 3
    }

    const predictionRepository: PredictionRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([firstPrediction, secondPrediction]),
      findLatest: vi.fn(),
      findByDate: vi.fn()
    }

    const evaluationRepository: PredictionEvaluationRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([evaluation]),
      findByPredictionDate: vi.fn()
    }

    const finder = new DefaultFindPendingPredictions(
      predictionRepository,
      evaluationRepository
    )

    const result = await finder.execute()

    expect(predictionRepository.findAll).toHaveBeenCalledOnce()
    expect(evaluationRepository.findAll).toHaveBeenCalledOnce()

    expect(result).toEqual([secondPrediction])
  })

  it('returns no pending predictions when all predictions are evaluated', async () => {
    const prediction: Prediction = {
      predictionDate: '2026-09-01',
      numbers: [7, 15, 23, 32, 44]
    }

    const evaluation: PredictionEvaluation = {
      prediction,
      actualDraw: {
        drawDate: '2026-09-02',
        numbers: [7, 15, 20, 32, 45],
        extraNumbers: [2, 8]
      },
      matches: 3
    }

    const predictionRepository: PredictionRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([prediction]),
      findLatest: vi.fn(),
      findByDate: vi.fn()
    }

    const evaluationRepository: PredictionEvaluationRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([evaluation]),
      findByPredictionDate: vi.fn()
    }

    const finder = new DefaultFindPendingPredictions(
      predictionRepository,
      evaluationRepository
    )

    const result = await finder.execute()

    expect(result).toEqual([])
  })
})
