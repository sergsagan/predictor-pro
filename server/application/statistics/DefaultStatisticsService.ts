import type { StatisticsService } from './StatisticsService'
import type { StatisticsServiceDependencies } from './StatisticsServiceDependencies'

export function createStatisticsService(
  dependencies: StatisticsServiceDependencies
): StatisticsService {
  const { repository, engine } = dependencies

  return {
    async calculate() {
      const draws = await repository.findAll()

      return engine.calculate(draws)
    }
  }
}
