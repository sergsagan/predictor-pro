import { appendFile, readFile, writeFile } from 'node:fs/promises'

import type { StrategyPerformanceSnapshot } from '@server/domain/models/StrategyPerformanceSnapshot'

import type { StrategyPerformanceRepository } from './StrategyPerformanceRepository'

export type CsvStrategyPerformanceRepositoryOptions = Readonly<{
  filePath: string
}>

const header = 'evaluated-at,through-draw-date,comparison\n'

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

function parseCsvRow(row: string): string[] {
  const values: string[] = []

  let value = ''
  let quoted = false

  for (let index = 0; index < row.length; index++) {
    const character = row[index]!

    if (character === '"') {
      if (quoted && row[index + 1] === '"') {
        value += '"'
        index++
        continue
      }

      quoted = !quoted
      continue
    }

    if (character === ',' && !quoted) {
      values.push(value)
      value = ''
      continue
    }

    value += character
  }

  if (quoted) {
    throw new Error('Invalid CSV row: unterminated quoted field')
  }

  values.push(value)

  return values
}

function parseRow(row: string): StrategyPerformanceSnapshot {
  const values = parseCsvRow(row)

  return {
    evaluatedAt: values[0]!,
    throughDrawDate: values[1]!,
    comparison: JSON.parse(
      values[2]!
    ) as StrategyPerformanceSnapshot['comparison']
  }
}

export function createCsvStrategyPerformanceRepository(
  options: CsvStrategyPerformanceRepositoryOptions
): StrategyPerformanceRepository {
  return {
    async save(snapshot) {
      const row = [
        escapeCsv(snapshot.evaluatedAt),
        escapeCsv(snapshot.throughDrawDate),
        escapeCsv(JSON.stringify(snapshot.comparison))
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
      try {
        const csv = await readFile(options.filePath, 'utf8')
        const rows = csv.split(/\r?\n/)

        return rows
          .slice(1)
          .filter((row) => row.length > 0)
          .map(parseRow)
          .sort((a, b) => a.evaluatedAt.localeCompare(b.evaluatedAt))
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error
        }

        return []
      }
    }
  }
}
