import type { Draw } from '@server/domain/models/Draw'
import type { WeightOptimizationResult } from './WeightOptimizationResult'
import type { WeightOptimizationEvaluator } from './WeightOptimizationEvaluator'

import { createDefaultWeightProfiles } from './DefaultWeightProfileCatalog'

export function evaluateAdaptiveWeightProfiles(
  evaluator: Pick<WeightOptimizationEvaluator, 'evaluateAll'>,
  draws: readonly Draw[]
): readonly WeightOptimizationResult[] {
  const profiles = createDefaultWeightProfiles()

  return evaluator.evaluateAll(profiles, draws)
}
