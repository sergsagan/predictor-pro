import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { GenerateRecommendationsResult } from '../recommendation/GenerateRecommendationsResult'

import { DefaultAutomaticPredictionGenerationService } from './DefaultAutomaticPredictionGenerationService'
import type { NumberAnalysis } from '@server/domain/models/NumberAnalysis'

describe('DefaultAutomaticPredictionGenerationService', () => {
  it('generates and saves prediction when it is due', () => {
    const predictionResult: GenerateRecommendationsResult = {
      recommendations: [
        {
          analysis: { value: 7 } as NumberAnalysis,
          explanation: { value: 7, lines: [] }
        },
        {
          analysis: { value: 15 } as NumberAnalysis,
          explanation: { value: 15, lines: [] }
        },
        {
          analysis: { value: 23 } as NumberAnalysis,
          explanation: { value: 23, lines: [] }
        },
        {
          analysis: { value: 32 } as NumberAnalysis,
          explanation: { value: 32, lines: [] }
        },
        {
          analysis: { value: 44 } as NumberAnalysis,
          explanation: { value: 44, lines: [] }
        }
      ]
    }

    const predictionService = {
      execute: vi.fn().mockReturnValue(predictionResult)
    }

    const savePrediction = {
      execute: vi.fn()
    }

    const schedulingService = {
      isDue: vi.fn().mockReturnValue(true)
    }

    const service = new DefaultAutomaticPredictionGenerationService(
      schedulingService,
      predictionService,
      savePrediction
    )

    const draws: readonly Draw[] = []

    service.execute(draws, '2026-09-01', '2026-09-02')

    expect(schedulingService.isDue).toHaveBeenCalledWith(
      '2026-09-01',
      '2026-09-02'
    )

    expect(predictionService.execute).toHaveBeenCalledWith(draws)

    expect(savePrediction.execute).toHaveBeenCalled()
  })

  it('does not generate or save prediction when it is not due', () => {
    const predictionService = {
      execute: vi.fn()
    }

    const savePrediction = {
      execute: vi.fn()
    }

    const schedulingService = {
      isDue: vi.fn().mockReturnValue(false)
    }

    const service = new DefaultAutomaticPredictionGenerationService(
      schedulingService,
      predictionService,
      savePrediction
    )

    service.execute([], '2026-08-31', '2026-09-02')

    expect(predictionService.execute).not.toHaveBeenCalled()
    expect(savePrediction.execute).not.toHaveBeenCalled()
  })
})
