import { appendFile, readFile, writeFile } from 'node:fs/promises'

import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'
import type { PredictionEvaluation } from '@server/domain/models/PredictionEvaluation'

import type { PredictionEvaluationRepository } from './PredictionEvaluationRepository'

export type CsvPredictionEvaluationRepositoryOptions = Readonly<{
  filePath: string
}>

const header =
  'prediction-date,n1,n2,n3,n4,n5,draw-date,d1,d2,d3,d4,d5,e1,e2,matches\n'

function parseRow(row: string): PredictionEvaluation {
  const values = row.split(',')

  const prediction: Prediction = {
    predictionDate: values[0]!,
    numbers: [
      Number(values[1]),
      Number(values[2]),
      Number(values[3]),
      Number(values[4]),
      Number(values[5])
    ]
  }

  const actualDraw: Draw = {
    drawDate: values[6]!,
    numbers: [
      Number(values[7]),
      Number(values[8]),
      Number(values[9]),
      Number(values[10]),
      Number(values[11])
    ],
    extraNumbers: [Number(values[12]), Number(values[13])]
  }

  return {
    prediction,
    actualDraw,
    matches: Number(values[14])
  }
}

export function createCsvPredictionEvaluationRepository(
  options: CsvPredictionEvaluationRepositoryOptions
): PredictionEvaluationRepository {
  const findAll = async (): Promise<readonly PredictionEvaluation[]> => {
    const csv = await readFile(options.filePath, 'utf8')
    const rows = csv.trim().split(/\r?\n/)

    return rows.slice(1).map(parseRow)
  }

  return {
    async save(evaluation) {
      const row = [
        evaluation.prediction.predictionDate,
        ...evaluation.prediction.numbers,
        evaluation.actualDraw.drawDate,
        ...evaluation.actualDraw.numbers,
        ...evaluation.actualDraw.extraNumbers,
        evaluation.matches
      ].join(',')

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

    async findByPredictionDate(predictionDate) {
      const evaluations = await findAll()

      return (
        evaluations.find(
          (evaluation) =>
            evaluation.prediction.predictionDate === predictionDate
        ) ?? null
      )
    }
  }
}
