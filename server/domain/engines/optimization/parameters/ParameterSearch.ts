import type { RecommendationStrategyConfig } from '../../recommendation/config/RecommendationStrategyConfig'
import type { RecommendationStrategy } from '../../recommendation/config/RecommendationStrategy'

type ParameterSearch = Readonly<{
  strategy: RecommendationStrategy
  frequency: readonly number[]
  currentGap: readonly number[]
  pairScore: readonly number[]
}>

export function generateParameterConfigurations(
  parameters: ParameterSearch
): readonly RecommendationStrategyConfig[] {
  const configurations: RecommendationStrategyConfig[] = []

  for (const frequency of parameters.frequency) {
    for (const currentGap of parameters.currentGap) {
      for (const pairScore of parameters.pairScore) {
        configurations.push({
          strategy: parameters.strategy,
          weights: {
            frequency,
            currentGap,
            pairScore
          }
        })
      }
    }
  }

  return configurations
}
