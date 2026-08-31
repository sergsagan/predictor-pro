import { describe, expect, it, vi } from 'vitest'

import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionRepository } from '@server/domain/repositories/predictions/PredictionRepository'

import { DefaultSavePrediction } from './DefaultSavePrediction'

describe('DefaultSavePrediction', () => {
  it('saves prediction through repository', async () => {
    const repository: PredictionRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      findAll: vi.fn(),
      findLatest: vi.fn(),
      findByDate: vi.fn()
    }

    const prediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    const service = new DefaultSavePrediction(repository)

    await service.execute(prediction)

    expect(repository.save).toHaveBeenCalledWith(prediction)
  })
})
