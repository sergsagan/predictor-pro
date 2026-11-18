import { readFile } from 'node:fs/promises'

import type { DrawRepository } from './DrawRepository'

import { parseRow } from './parseRow'

export type CsvDrawRepositoryOptions = Readonly<{
  filePath: string
}>

export function createCsvDrawRepository(
  options: CsvDrawRepositoryOptions
): DrawRepository {
  const findAll = async () => {
    const csv = await readFile(options.filePath, 'utf8')
    const rows = csv.trim().split(/\r?\n/)

    return rows.slice(1).map(parseRow)
  }

  return {
    findAll,

    async findLatest() {
      const draws = await findAll()

      return draws.reduce<(typeof draws)[number] | null>(
        (latest, draw) =>
          latest === null || draw.drawDate > latest.drawDate ? draw : latest,
        null
      )
    },

    async findByDate(drawDate: string) {
      const draws = await findAll()

      return draws.find((draw) => draw.drawDate === drawDate) ?? null
    }
  }
}
