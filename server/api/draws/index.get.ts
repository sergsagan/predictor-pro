import { createCsvDrawRepository } from '@server/domain/repositories/draws/CsvDrawRepository'

export default defineEventHandler(async () => {
  const repository = createCsvDrawRepository({
    filePath: 'data/draws.csv'
  })

  return repository.findAll()
})
