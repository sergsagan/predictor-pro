import { describe, expect, it, vi } from 'vitest'

import type { PredictionEvaluation } from '@server/domain/models/PredictionEvaluation'
import type { PredictionEvaluationRepository } from '@server/domain/repositories/predictions/PredictionEvaluationRepository'

import { DefaultGetPredictionTrends } from './DefaultGetPredictionTrends'

function createEvaluation(
  predictionDate: string,
  drawDate: string,
  matches: number
): PredictionEvaluation {
  const numbers = [1, 2, 3, 4, 5] as const

  return {
    prediction: {
      predictionDate,
      numbers
    },
    actualDraw: {
      drawDate,
      numbers: [1, 2, 3, 4, 5],
      extraNumbers: [6, 7]
    },
    matches
  }
}

describe('DefaultGetPredictionTrends', () => {
  it('calculates cumulative performance trends chronologically', async () => {
    const evaluations = [
      createEvaluation('2026-08-30', '2026-08-30', 5),
      createEvaluation('2026-08-28', '2026-08-28', 0),
      createEvaluation('2026-08-29', '2026-08-29', 3)
    ]

    const repository: PredictionEvaluationRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue(evaluations),
      findByPredictionDate: vi.fn()
    }

    const service = new DefaultGetPredictionTrends(repository)

    const result = await service.execute()

    expect(repository.findAll).toHaveBeenCalledOnce()

    expect(result).toEqual([
      {
        predictionDate: '2026-08-28',
        drawDate: '2026-08-28',
        matches: 0,
        totalPredictions: 1,
        totalMatches: 0,
        averageMatches: 0,
        hitRate: 0
      },
      {
        predictionDate: '2026-08-29',
        drawDate: '2026-08-29',
        matches: 3,
        totalPredictions: 2,
        totalMatches: 3,
        averageMatches: 1.5,
        hitRate: 0.5
      },
      {
        predictionDate: '2026-08-30',
        drawDate: '2026-08-30',
        matches: 5,
        totalPredictions: 3,
        totalMatches: 8,
        averageMatches: 8 / 3,
        hitRate: 2 / 3
      }
    ])
  })

  it('returns an empty array when there are no evaluations', async () => {
    const repository: PredictionEvaluationRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
      findByPredictionDate: vi.fn()
    }

    const service = new DefaultGetPredictionTrends(repository)

    await expect(service.execute()).resolves.toEqual([])
  })
})
