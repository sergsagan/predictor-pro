// @ts-ignore
import { readFile } from 'node:fs/promises'

import type { Draw } from '../../domain/engines/draws/Draw'
import type { DrawRepository } from './DrawRepository'

export type CsvDrawRepositoryOptions = Readonly<{
  filePath: string
}>

export function createCsvDrawRepository(
  options: CsvDrawRepositoryOptions
): DrawRepository {
  return {
    async findAll() {
      const csv = await readFile(options.filePath, 'utf8')

      const rows = getRows(csv)

      return rows
        .slice(1)
        .map(parseRow)
    },

    async findLatest() {
      throw new Error('Not implemented')
    },

    async findByDate(_drawDate: string) {
      throw new Error('Not implemented')
    }
  }
}

function getRows(csv: string): readonly string[] {
  return csv
    .trim()
    .split(/\r?\n/)
}

function parseRow(_row: string): Draw {
  throw new Error('Not implemented')
}
