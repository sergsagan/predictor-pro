import { describe, expect, it, vi } from 'vitest'

import { sampleDraws } from '@test/fixtures/sampleDraws'
import { sampleStatisticsResult } from '@test/fixtures/sampleStatisticsResult'
import { sampleRecommendation } from '@test/fixtures/sampleRecommendation'
import { sampleNumberAnalysis } from '@test/fixtures/sampleNumberAnalysis'
import { sampleNumberExplanation } from '@test/fixtures/sampleNumberExplanation'

import { DefaultGenerateRecommendations } from './DefaultGenerateRecommendations'

import type { StatisticsEngine } from '@server/domain/engines/statistics/StatisticsEngine'
import type { RecommendationEngine } from '@server/domain/engines/predictor/RecommendationEngine'
import type { NumberAnalysisEngine } from '@server/domain/engines/analysis/NumberAnalysisEngine'
import type { NumberExplanationEngine } from '@server/domain/engines/explanation/NumberExplanationEngine'

describe('DefaultGenerateRecommendations', () => {
  it('calculates statistics', () => {
    const statisticsEngine: StatisticsEngine = {
      calculate: vi.fn().mockReturnValue(sampleStatisticsResult)
    }

    const recommendationEngine: RecommendationEngine = {
      recommend: vi.fn().mockReturnValue(sampleRecommendation)
    }

    const numberAnalysisEngine: NumberAnalysisEngine = {
      analyze: vi.fn().mockReturnValue(sampleNumberAnalysis)
    }

    const numberExplanationEngine: NumberExplanationEngine = {
      explain: vi.fn().mockReturnValue(sampleNumberExplanation)
    }

    const useCase = new DefaultGenerateRecommendations(
      statisticsEngine,
      recommendationEngine,
      numberAnalysisEngine,
      numberExplanationEngine
    )

    useCase.execute(sampleDraws)

    expect(statisticsEngine.calculate).toHaveBeenCalledWith(sampleDraws)
  })

  it('passes statistics to recommendation engine', () => {
    const statisticsEngine: StatisticsEngine = {
      calculate: vi.fn().mockReturnValue(sampleStatisticsResult)
    }

    const recommendationEngine: RecommendationEngine = {
      recommend: vi.fn().mockReturnValue(sampleRecommendation)
    }

    const numberAnalysisEngine: NumberAnalysisEngine = {
      analyze: vi.fn().mockReturnValue(sampleNumberAnalysis)
    }

    const numberExplanationEngine: NumberExplanationEngine = {
      explain: vi.fn().mockReturnValue(sampleNumberExplanation)
    }

    const useCase = new DefaultGenerateRecommendations(
      statisticsEngine,
      recommendationEngine,
      numberAnalysisEngine,
      numberExplanationEngine
    )

    useCase.execute(sampleDraws)

    expect(recommendationEngine.recommend).toHaveBeenCalledWith(
      sampleStatisticsResult
    )
  })

  it('analyzes recommended numbers', () => {
    const statisticsEngine: StatisticsEngine = {
      calculate: vi.fn().mockReturnValue(sampleStatisticsResult)
    }

    const recommendationEngine: RecommendationEngine = {
      recommend: vi.fn().mockReturnValue(sampleRecommendation)
    }

    const numberAnalysisEngine: NumberAnalysisEngine = {
      analyze: vi.fn().mockReturnValue(sampleNumberAnalysis)
    }

    const numberExplanationEngine: NumberExplanationEngine = {
      explain: vi.fn().mockReturnValue(sampleNumberExplanation)
    }

    const useCase = new DefaultGenerateRecommendations(
      statisticsEngine,
      recommendationEngine,
      numberAnalysisEngine,
      numberExplanationEngine
    )

    useCase.execute(sampleDraws)

    expect(numberAnalysisEngine.analyze).toHaveBeenCalledWith(
      17,
      [17],
      sampleStatisticsResult
    )
  })

  it('explains analyzed numbers', () => {
    const statisticsEngine: StatisticsEngine = {
      calculate: vi.fn().mockReturnValue(sampleStatisticsResult)
    }

    const recommendationEngine: RecommendationEngine = {
      recommend: vi.fn().mockReturnValue(sampleRecommendation)
    }

    const numberAnalysisEngine: NumberAnalysisEngine = {
      analyze: vi.fn().mockReturnValue(sampleNumberAnalysis)
    }

    const numberExplanationEngine: NumberExplanationEngine = {
      explain: vi.fn().mockReturnValue(sampleNumberExplanation)
    }

    const useCase = new DefaultGenerateRecommendations(
      statisticsEngine,
      recommendationEngine,
      numberAnalysisEngine,
      numberExplanationEngine
    )

    useCase.execute(sampleDraws)

    expect(numberExplanationEngine.explain).toHaveBeenCalledWith(
      sampleNumberAnalysis
    )
  })

  it('returns recommendations', () => {
    const statisticsEngine: StatisticsEngine = {
      calculate: vi.fn().mockReturnValue(sampleStatisticsResult)
    }

    const recommendationEngine: RecommendationEngine = {
      recommend: vi.fn().mockReturnValue(sampleRecommendation)
    }

    const numberAnalysisEngine: NumberAnalysisEngine = {
      analyze: vi.fn().mockReturnValue(sampleNumberAnalysis)
    }

    const numberExplanationEngine: NumberExplanationEngine = {
      explain: vi.fn().mockReturnValue(sampleNumberExplanation)
    }

    const useCase = new DefaultGenerateRecommendations(
      statisticsEngine,
      recommendationEngine,
      numberAnalysisEngine,
      numberExplanationEngine
    )

    const result = useCase.execute(sampleDraws)

    expect(result.recommendations).toEqual([
      {
        analysis: sampleNumberAnalysis,
        explanation: sampleNumberExplanation
      }
    ])
  })
})
