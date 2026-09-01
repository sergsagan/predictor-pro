import { appendFile, readFile, writeFile } from 'node:fs/promises'

import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionRepository } from './PredictionRepository'

export type CsvPredictionRepositoryOptions = Readonly<{
  filePath: string
}>

const header = 'prediction-date,n1,n2,n3,n4,n5\n'

function parseRow(row: string): Prediction {
  const values = row.split(',')

  return {
    predictionDate: values[0]!,
    numbers: [
      Number(values[1]),
      Number(values[2]),
      Number(values[3]),
      Number(values[4]),
      Number(values[5])
    ]
  }
}

export function createCsvPredictionRepository(
  options: CsvPredictionRepositoryOptions
): PredictionRepository {
  const findAll = async (): Promise<readonly Prediction[]> => {
    const csv = await readFile(options.filePath, 'utf8')
    const rows = csv.trim().split(/\r?\n/)

    return rows.slice(1).map(parseRow)
  }

  return {
    async save(prediction: Prediction) {
      const row = [prediction.predictionDate, ...prediction.numbers].join(',')

      try {
        await readFile(options.filePath, 'utf8')

        await appendFile(options.filePath, `${row}\n`, 'utf8')
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error
        }

        await writeFile(options.filePath, `${header}${row}\n`, 'utf8')
      }
    },

    async findAll() {
      return findAll()
    },

    async findLatest() {
      const predictions = await findAll()

      return predictions.at(-1) ?? null
    },

    async findByDate(predictionDate: string) {
      const predictions = await findAll()

      return (
        predictions.find(
          (prediction) => prediction.predictionDate === predictionDate
        ) ?? null
      )
    }
  }
}
