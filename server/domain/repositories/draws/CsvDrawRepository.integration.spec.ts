import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { createCsvDrawRepository } from './CsvDrawRepository'

describe('CsvDrawRepository integration', () => {
  let directory: string
  let filePath: string

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'predictor-draws-'))
    filePath = join(directory, 'draws.csv')
    await writeFile(
      filePath,
      [
        'draw-date,n1,n2,n3,n4,n5,e1,e2',
        '2026-08-31,7,15,23,32,44,2,9',
        '2026-08-24,3,12,21,34,45,1,8'
      ].join('\n') + '\n'
    )
  })

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
  })

  it('returns the chronologically latest draw even when rows are unordered', async () => {
    const repository = createCsvDrawRepository({ filePath })

    await expect(repository.findLatest()).resolves.toEqual({
      drawDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44],
      extraNumbers: [2, 9]
    })
  })

  it('returns a draw by exact date or null when it is absent', async () => {
    const repository = createCsvDrawRepository({ filePath })

    await expect(repository.findByDate('2026-08-24')).resolves.toEqual({
      drawDate: '2026-08-24',
      numbers: [3, 12, 21, 34, 45],
      extraNumbers: [1, 8]
    })
    await expect(repository.findByDate('2026-08-30')).resolves.toBeNull()
  })
})
