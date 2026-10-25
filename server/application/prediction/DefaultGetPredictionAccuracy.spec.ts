import { describe, expect, it, vi } from 'vitest'

import type { PredictionEvaluation } from '@server/domain/models/PredictionEvaluation'
import type { PredictionEvaluationRepository } from '@server/domain/repositories/predictions/PredictionEvaluationRepository'

import { DefaultGetPredictionAccuracy } from './DefaultGetPredictionAccuracy'

function createEvaluation(
  matches: 0 | 3 | 5,
  predictionDate: string
): PredictionEvaluation {
  const predictionNumbers = [1, 2, 3, 4, 5] as const

  const actualNumbers = {
    0: [6, 7, 8, 9, 10],
    3: [1, 2, 3, 6, 7],
    5: [1, 2, 3, 4, 5]
  } as const

  return {
    prediction: {
      predictionDate,
      numbers: predictionNumbers
    },
    actualDraw: {
      drawDate: '2026-09-02',
      numbers: actualNumbers[matches],
      extraNumbers: [1, 2]
    },
    matches
  }
}

describe('DefaultGetPredictionAccuracy', () => {
  it('calculates historical accuracy from saved evaluations', async () => {
    const evaluations = [
      createEvaluation(3, '2026-08-28'),
      createEvaluation(0, '2026-08-29'),
      createEvaluation(5, '2026-08-30')
    ]

    const repository: PredictionEvaluationRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue(evaluations),
      findByPredictionDate: vi.fn()
    }

    const service = new DefaultGetPredictionAccuracy(repository)

    const result = await service.execute()

    expect(repository.findAll).toHaveBeenCalledOnce()

    expect(result).toEqual({
      totalPredictions: 3,
      totalMatches: 8,
      averageMatches: 8 / 3,
      predictionsWithMatches: 2,
      hitRate: 2 / 3,
      distribution: {
        0: 1,
        1: 0,
        2: 0,
        3: 1,
        4: 0,
        5: 1
      }
    })
  })

  it('returns zero metrics when there are no evaluations', async () => {
    const repository: PredictionEvaluationRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue([]),
      findByPredictionDate: vi.fn()
    }

    const service = new DefaultGetPredictionAccuracy(repository)

    const result = await service.execute()

    expect(result).toEqual({
      totalPredictions: 0,
      totalMatches: 0,
      averageMatches: 0,
      predictionsWithMatches: 0,
      hitRate: 0,
      distribution: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    })
  })
})
