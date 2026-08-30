import { defineEventHandler } from 'h3'

import { DefaultPredictionService } from '@server/application/prediction/DefaultPredictionService'

import { DefaultGenerateRecommendations } from '@server/application/recommendation/DefaultGenerateRecommendations'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'
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

  const generateRecommendations = new DefaultGenerateRecommendations(
    statisticsEngine,
    recommendationEngine,
    numberAnalysisEngine,
    numberExplanationEngine
  )

  const predictionService = new DefaultPredictionService(
    generateRecommendations
  )

  const draws = await repository.findAll()

  return predictionService.execute(draws)
})
