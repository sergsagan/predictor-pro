import { describe, expect, it, vi } from 'vitest'

import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionRepository } from '@server/domain/repositories/predictions/PredictionRepository'

import { DefaultPredictionHistoryService } from './DefaultPredictionHistoryService'

describe('DefaultPredictionHistoryService', () => {
  it('returns all predictions from repository', async () => {
    const predictions: readonly Prediction[] = [
      {
        predictionDate: '2026-08-31',
        numbers: [7, 15, 23, 32, 44]
      },
      {
        predictionDate: '2026-09-01',
        numbers: [3, 12, 21, 34, 45]
      }
    ]

    const repository: PredictionRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue(predictions),
      findLatest: vi.fn(),
      findByDate: vi.fn()
    }

    const service = new DefaultPredictionHistoryService(repository)

    const result = await service.findAll()

    expect(repository.findAll).toHaveBeenCalledOnce()
    expect(result).toBe(predictions)
  })

  it('returns prediction by date', async () => {
    const prediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    const repository: PredictionRepository = {
      save: vi.fn(),
      findAll: vi.fn(),
      findLatest: vi.fn(),
      findByDate: vi.fn().mockResolvedValue(prediction)
    }

    const service = new DefaultPredictionHistoryService(repository)

    const result = await service.findByDate('2026-08-31')

    expect(repository.findByDate).toHaveBeenCalledWith('2026-08-31')

    expect(result).toBe(prediction)
  })
})
