import { defineEventHandler } from 'h3'

import { DefaultPredictionService } from '@server/application/prediction/DefaultPredictionService'

import { DefaultGenerateRecommendations } from '@server/application/recommendation/DefaultGenerateRecommendations'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { createRecommendationEngine } from '@server/domain/engines/recommendation/createRecommendationEngine'

import { DefaultGetStrategyPerformanceHistory } from '@server/application/strategyPerformance/DefaultGetStrategyPerformanceHistory'
import { DefaultAdaptiveStrategySelector } from '@server/application/strategySelection/DefaultAdaptiveStrategySelector'

import { DefaultStrategyPerformanceEvaluator } from '@server/domain/engines/strategySelection/DefaultStrategyPerformanceEvaluator'

import { createCsvStrategyPerformanceRepository } from '@server/domain/repositories/strategies/CsvStrategyPerformanceRepository'
import { SimpleNumberAnalysisEngine } from '@server/domain/engines/analysis/SimpleNumberAnalysisEngine'
import { SimpleNumberExplanationEngine } from '@server/domain/engines/explanation/SimpleNumberExplanationEngine'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'

export default defineEventHandler(async () => {
  const repository = createCsvDrawRepository({
    filePath: 'data/draws.csv'
  })

  const performanceRepository = createCsvStrategyPerformanceRepository({
    filePath: 'data/strategy-performance.csv'
  })

  const historyService = new DefaultGetStrategyPerformanceHistory(
    performanceRepository
  )

  const evaluator = new DefaultStrategyPerformanceEvaluator()

  const selector = new DefaultAdaptiveStrategySelector(
    historyService,
    evaluator
  )

  const selection = await selector.execute()

  const statisticsEngine = createStatisticsEngine()

  const recommendationEngine = createRecommendationEngine({
    strategy: selection.strategy,
    weights: {
      frequency: 1,
      currentGap: 1,
      pairScore: 1
    }
  })
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
