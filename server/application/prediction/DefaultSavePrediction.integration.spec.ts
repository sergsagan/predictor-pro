import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { Prediction } from '@server/domain/models/Prediction'

import { createCsvPredictionRepository } from '@server/domain/repositories/predictions/CsvPredictionRepository'
import { DefaultSavePrediction } from './DefaultSavePrediction'

describe('DefaultSavePrediction integration', () => {
  let directory: string
  let filePath: string

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'predictor-'))
    filePath = join(directory, 'predictions.csv')
  })

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
  })

  it('saves prediction through real CSV repository', async () => {
    const repository = createCsvPredictionRepository({
      filePath
    })

    const service = new DefaultSavePrediction(repository)

    const prediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    await service.execute(prediction)

    const csv = await readFile(filePath, 'utf8')

    expect(csv).toBe(
      ['prediction-date,n1,n2,n3,n4,n5', '2026-08-31,7,15,23,32,44'].join(
        '\n'
      ) + '\n'
    )
  })
})
