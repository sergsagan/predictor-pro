import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { PredictionEvaluation } from '@server/domain/models/PredictionEvaluation'
import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'

import { createCsvPredictionEvaluationRepository } from './CsvPredictionEvaluationRepository'

describe('CsvPredictionEvaluationRepository integration', () => {
  let directory: string
  let filePath: string

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'predictor-'))
    filePath = join(directory, 'prediction-evaluations.csv')
  })

  afterEach(async () => {
    await rm(directory, {
      recursive: true,
      force: true
    })
  })

  it('saves and reads prediction evaluation', async () => {
    const repository = createCsvPredictionEvaluationRepository({
      filePath
    })

    const prediction: Prediction = {
      predictionDate: '2026-09-01',
      numbers: [7, 15, 23, 32, 44]
    }

    const actualDraw: Draw = {
      drawDate: '2026-09-02',
      numbers: [7, 15, 20, 32, 45],
      extraNumbers: [2, 8]
    }

    const evaluation: PredictionEvaluation = {
      prediction,
      actualDraw,
      matches: 3
    }

    await repository.save(evaluation)

    const result = await repository.findAll()

    expect(result).toEqual([evaluation])
  })
})
