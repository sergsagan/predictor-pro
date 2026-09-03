import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createCsvPredictionRepository } from '@server/domain/repositories/predictions/CsvPredictionRepository'

import { createStatisticsEngine } from '@server/domain/engines/statistics/DefaultStatisticsEngine'
import { SimpleRecommendationEngine } from '@server/domain/engines/recommendation/SimpleRecommendationEngine'
import { SimpleNumberAnalysisEngine } from '@server/domain/engines/analysis/SimpleNumberAnalysisEngine'
import { SimpleNumberExplanationEngine } from '@server/domain/engines/explanation/SimpleNumberExplanationEngine'

import { DefaultGenerateRecommendations } from '../recommendation/DefaultGenerateRecommendations'
import { DefaultPredictionService } from '../prediction/DefaultPredictionService'
import { DefaultSavePrediction } from '../prediction/DefaultSavePrediction'

import { DefaultPredictionSchedulingService } from './DefaultPredictionSchedulingService'
import { DefaultRunScheduledPrediction } from './DefaultRunScheduledPrediction'

describe('DefaultRunScheduledPrediction integration', () => {
  let directory: string
  let filePath: string

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'predictor-'))
    filePath = join(directory, 'predictions.csv')
  })

  afterEach(async () => {
    await rm(directory, {
      recursive: true,
      force: true
    })
  })

  it('generates and saves prediction using real dependencies', async () => {
    const drawRepository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await drawRepository.findAll()

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

    const schedulingService = new DefaultPredictionSchedulingService({
      generateBeforeDrawDays: 1
    })

    const predictionRepository = createCsvPredictionRepository({
      filePath
    })

    const savePrediction = new DefaultSavePrediction(predictionRepository)

    const service = new DefaultRunScheduledPrediction(
      schedulingService,
      predictionService,
      savePrediction
    )

    await service.execute(draws, '2026-09-01', '2026-09-02')

    const csv = await readFile(filePath, 'utf8')

    const rows = csv.trim().split(/\r?\n/)

    expect(rows).toHaveLength(2)

    expect(rows[0]).toBe('prediction-date,n1,n2,n3,n4,n5')

    const values = rows[1]!.split(',')

    expect(values).toHaveLength(6)
    expect(values[0]).toBe('2026-09-01')

    const numbers = values.slice(1).map(Number)

    expect(numbers).toHaveLength(5)
    expect(numbers.every((number) => Number.isInteger(number))).toBe(true)
  })
})
