import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { Prediction } from '@server/domain/models/Prediction'

import { createCsvPredictionRepository } from './CsvPredictionRepository'

describe('CsvPredictionRepository integration', () => {
  let directory: string
  let filePath: string

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'predictor-'))
    filePath = join(directory, 'predictions.csv')
  })

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
  })

  it('saves a prediction to CSV', async () => {
    const repository = createCsvPredictionRepository({
      filePath
    })

    const prediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    await repository.save(prediction)

    const csv = await readFile(filePath, 'utf8')

    expect(csv).toBe(
      ['prediction-date,n1,n2,n3,n4,n5', '2026-08-31,7,15,23,32,44'].join(
        '\n'
      ) + '\n'
    )
  })

  it('appends multiple predictions without duplicating the header', async () => {
    const repository = createCsvPredictionRepository({
      filePath
    })

    const firstPrediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    const secondPrediction: Prediction = {
      predictionDate: '2026-09-01',
      numbers: [3, 12, 21, 34, 45]
    }

    await repository.save(firstPrediction)
    await repository.save(secondPrediction)

    const csv = await readFile(filePath, 'utf8')

    expect(csv).toBe(
      [
        'prediction-date,n1,n2,n3,n4,n5',
        '2026-08-31,7,15,23,32,44',
        '2026-09-01,3,12,21,34,45'
      ].join('\n') + '\n'
    )
  })
})
