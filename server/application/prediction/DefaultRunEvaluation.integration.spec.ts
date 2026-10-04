import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import dayjs from 'dayjs'

import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'
import { createCsvPredictionRepository } from '@server/domain/repositories/predictions/CsvPredictionRepository'
import { createCsvPredictionEvaluationRepository } from '@server/domain/repositories/predictions/CsvPredictionEvaluationRepository'

import { DefaultFindPendingPredictions } from './DefaultFindPendingPredictions'
import { DefaultPredictionEvaluationService } from './DefaultPredictionEvaluationService'
import { DefaultEvaluatePrediction } from './DefaultEvaluatePrediction'
import { DefaultRunEvaluation } from './DefaultRunEvaluation'

describe('DefaultRunEvaluation integration', () => {
  let directory: string
  let predictionsFilePath: string
  let evaluationsFilePath: string

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'predictor-'))
    predictionsFilePath = join(directory, 'predictions.csv')
    evaluationsFilePath = join(directory, 'prediction-evaluations.csv')
  })

  afterEach(async () => {
    await rm(directory, {
      recursive: true,
      force: true
    })
  })

  it('evaluates pending prediction against the next draw and persists the result', async () => {
    const drawRepository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await drawRepository.findAll()
    const firstDraw = [...draws].sort((a, b) =>
      a.drawDate.localeCompare(b.drawDate)
    )[0]

    expect(firstDraw).toBeDefined()

    const predictionRepository = createCsvPredictionRepository({
      filePath: predictionsFilePath
    })

    const evaluationRepository = createCsvPredictionEvaluationRepository({
      filePath: evaluationsFilePath
    })

    const predictionDate = dayjs(firstDraw!.drawDate)
      .subtract(1, 'day')
      .format('YYYY-MM-DD')

    const prediction = {
      predictionDate,
      numbers: firstDraw!.numbers
    }

    await predictionRepository.save(prediction)

    const findPendingPredictions = new DefaultFindPendingPredictions(
      predictionRepository,
      evaluationRepository
    )

    const predictionEvaluationService = new DefaultPredictionEvaluationService(
      (
        await import('@server/domain/engines/backtesting/PredictionMatchCalculator')
      ).countPredictionMatches
    )

    const evaluatePrediction = new DefaultEvaluatePrediction(
      predictionEvaluationService,
      evaluationRepository
    )

    const service = new DefaultRunEvaluation(
      findPendingPredictions,
      drawRepository,
      evaluatePrediction
    )

    await service.execute()

    const evaluations = await evaluationRepository.findAll()

    expect(evaluations).toHaveLength(1)

    expect(evaluations[0]).toEqual({
      prediction,
      actualDraw: firstDraw,
      matches: 5
    })

    const csv = await readFile(evaluationsFilePath, 'utf8')

    expect(csv.trim().split(/\r?\n/)).toHaveLength(2)
  })

  it('does not evaluate prediction when there is no later draw', async () => {
    const drawRepository = createCsvDrawRepository({
      filePath: 'data/draws.csv'
    })

    const draws = await drawRepository.findAll()

    const lastDraw = [...draws].sort((a, b) =>
      b.drawDate.localeCompare(a.drawDate)
    )[0]

    expect(lastDraw).toBeDefined()

    const predictionRepository = createCsvPredictionRepository({
      filePath: predictionsFilePath
    })

    const evaluationRepository = createCsvPredictionEvaluationRepository({
      filePath: evaluationsFilePath
    })

    const predictionDate = dayjs(lastDraw!.drawDate)
      .add(1, 'day')
      .format('YYYY-MM-DD')

    const prediction = {
      predictionDate,
      numbers: [1, 2, 3, 4, 5] as const
    }

    await predictionRepository.save(prediction)

    const findPendingPredictions = new DefaultFindPendingPredictions(
      predictionRepository,
      evaluationRepository
    )

    const predictionEvaluationService = new DefaultPredictionEvaluationService(
      (
        await import('@server/domain/engines/backtesting/PredictionMatchCalculator')
      ).countPredictionMatches
    )

    const evaluatePrediction = new DefaultEvaluatePrediction(
      predictionEvaluationService,
      evaluationRepository
    )

    const service = new DefaultRunEvaluation(
      findPendingPredictions,
      drawRepository,
      evaluatePrediction
    )

    await service.execute()

    const evaluations = await evaluationRepository.findAll()

    expect(evaluations).toEqual([])
  })
})
