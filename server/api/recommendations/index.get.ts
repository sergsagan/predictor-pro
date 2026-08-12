import { defineEventHandler } from 'h3'

import { DefaultGenerateRecommendations } from '@server/application/recommendation/DefaultGenerateRecommendations'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/predictor/SimpleRecommendationEngine'
import { SimpleNumberAnalysisEngine } from '@server/domain/engines/analysis/SimpleNumberAnalysisEngine'
import { SimpleNumberExplanationEngine } from '@server/domain/engines/explanation/SimpleNumberExplanationEngine'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'

export default defineEventHandler(async () => {
  const repository = createCsvDrawRepository({
    filePath: 'data/draws.csv'
  })

  const statisticsEngine = createStatisticsEngine()
  const recommendationEngine = new SimpleRecommendationEngine()
  const numberAnalysisEngine = new SimpleNumberAnalysisEngine()
  const numberExplanationEngine = new SimpleNumberExplanationEngine()

  const useCase = new DefaultGenerateRecommendations(
    statisticsEngine,
    recommendationEngine,
    numberAnalysisEngine,
    numberExplanationEngine
  )

  const draws = await repository.findAll()

  return useCase.execute(draws)
})
