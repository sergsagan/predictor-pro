import { access, appendFile, writeFile } from 'node:fs/promises'

import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionRepository } from './PredictionRepository'

export type CsvPredictionRepositoryOptions = Readonly<{
  filePath: string
}>

const header = 'prediction-date,n1,n2,n3,n4,n5\n'

export function createCsvPredictionRepository(
  options: CsvPredictionRepositoryOptions
): PredictionRepository {
  return {
    async save(prediction: Prediction) {
      const row = [prediction.predictionDate, ...prediction.numbers].join(',')

      try {
        await access(options.filePath)

        await appendFile(options.filePath, `${row}\n`, 'utf8')
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error
        }

        await writeFile(options.filePath, `${header}${row}\n`, 'utf8')
      }
    },

    async findAll() {
      throw new Error('Not implemented')
    },

    async findLatest() {
      throw new Error('Not implemented')
    },

    async findByDate(_predictionDate: string) {
      throw new Error('Not implemented')
    }
  }
}
