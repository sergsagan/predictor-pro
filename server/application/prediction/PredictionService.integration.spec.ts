import { describe, expect, it } from 'vitest'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'
import { SimpleNumberAnalysisEngine } from '@server/domain/engines/analysis/SimpleNumberAnalysisEngine'
import { SimpleNumberExplanationEngine } from '@server/domain/engines/explanation/SimpleNumberExplanationEngine'

import { DefaultGenerateRecommendations } from '../recommendation/DefaultGenerateRecommendations'
import { DefaultPredictionService } from './DefaultPredictionService'

describe('DefaultPredictionService integration', () => {
  it('generates predictions using real recommendation dependencies', () => {
    const statisticsEngine = createStatisticsEngine()
    const recommendationEngine = new SimpleRecommendationEngine()
    const numberAnalysisEngine = new SimpleNumberAnalysisEngine()
    const numberExplanationEngine = new SimpleNumberExplanationEngine()

    const generateRecommendations = new DefaultGenerateRecommendations(
      statisticsEngine,
      recommendationEngine,
      numberAnalysisEngine,
      numberExplanationEngine
    )

    const service = new DefaultPredictionService(generateRecommendations)

    const draws = [
      {
        drawDate: '2025-01-01',
        numbers: [1, 2, 3, 4, 5] as const,
        extraNumbers: [1, 2] as const
      },
      {
        drawDate: '2025-01-08',
        numbers: [1, 2, 3, 4, 6] as const,
        extraNumbers: [1, 3] as const
      },
      {
        drawDate: '2025-01-15',
        numbers: [1, 2, 3, 5, 6] as const,
        extraNumbers: [2, 3] as const
      }
    ] as const

    const result = service.execute(draws)

    expect(result).toBeDefined()
    expect(result.recommendations).toHaveLength(5)

    for (const recommendation of result.recommendations) {
      expect(recommendation.analysis).toBeDefined()
      expect(recommendation.explanation).toBeDefined()
    }
  })
})
