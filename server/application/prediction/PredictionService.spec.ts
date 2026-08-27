import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { GenerateRecommendationsResult } from '../recommendation/GenerateRecommendationsResult'
import type { GenerateRecommendations } from '../recommendation/GenerateRecommendations'
import type { PredictionService } from './PredictionService'

import { DefaultPredictionService } from './DefaultPredictionService'

describe('DefaultPredictionService', () => {
  it('implements PredictionService', () => {
    const prediction: GenerateRecommendationsResult = {
      recommendations: []
    }

    const generateRecommendations: GenerateRecommendations = {
      execute: vi.fn().mockReturnValue(prediction)
    }

    const service: PredictionService = new DefaultPredictionService(
      generateRecommendations
    )

    const draws: Draw[] = []

    expect(service.execute(draws)).toBe(prediction)
  })
})
