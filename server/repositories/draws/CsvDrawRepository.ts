// @ts-ignore
import { readFile } from 'node:fs/promises'

import type { DrawRepository } from './DrawRepository'

import { parseRow } from './parseRow'

export type CsvDrawRepositoryOptions = Readonly<{
  filePath: string
}>

export function createCsvDrawRepository(
  options: CsvDrawRepositoryOptions
): DrawRepository {
  return {
    async findAll() {
      const csv = await readFile(options.filePath, 'utf8')

      const rows = csv
        .trim()
        .split(/\r?\n/)

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
