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

import { SimpleBacktestingEngine } from '@server/domain/engines/backtesting/SimpleBacktestingEngine'
import { WeightOptimizationEvaluator } from '@server/domain/engines/optimization/weights/WeightOptimizationEvaluator'

import { evaluateAdaptiveWeightProfiles } from '@server/domain/engines/optimization/weights/AdaptiveWeightEvaluation'

import {
  DEFAULT_ADAPTIVE_WEIGHTS,
  selectAdaptiveWeightProfileWithReason
} from '@server/domain/engines/optimization/weights/AdaptiveWeightSelector'

import type { AdaptiveWeightSelectionReason } from '@server/domain/engines/optimization/weights/AdaptiveWeightSelector'

export default defineEventHandler(async () => {
  const repository = createCsvDrawRepository({
    filePath: 'data/draws.csv'
  })

  const draws = await repository.findAll()

  const performanceRepository = createCsvStrategyPerformanceRepository({
    filePath: 'data/strategy-performance.csv'
  })

  const historyService = new DefaultGetStrategyPerformanceHistory(
    performanceRepository
  )

  const strategyEvaluator = new DefaultStrategyPerformanceEvaluator()

  const strategySelector = new DefaultAdaptiveStrategySelector(
    historyService,
    strategyEvaluator
  )

  const selection = await strategySelector.execute()

  const statisticsEngine = createStatisticsEngine()

  let weights = DEFAULT_ADAPTIVE_WEIGHTS
  let weightReason: AdaptiveWeightSelectionReason = 'not-applicable'

  if (selection.strategy === 'simple') {
    const weightEvaluator = new WeightOptimizationEvaluator((config) => {
      const recommendationEngine = createRecommendationEngine(config)

      return new SimpleBacktestingEngine(statisticsEngine, recommendationEngine)
    })

    const optimizationResults = evaluateAdaptiveWeightProfiles(
      weightEvaluator,
      draws
    )

    const weightSelection =
      selectAdaptiveWeightProfileWithReason(optimizationResults)

    weights = weightSelection.weights
    weightReason = weightSelection.reason
  }

  const recommendationEngine = createRecommendationEngine({
    strategy: selection.strategy,
    weights
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

  const predictionResult = predictionService.execute(draws)

  return {
    ...predictionResult,
    adaptation: {
      strategy: selection.strategy,
      strategyReason: selection.reason,
      weights,
      weightReason
    }
  }
})
