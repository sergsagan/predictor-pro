import type { Recommendation } from '@server/domain/models/Recommendation'

export const sampleRecommendation: Recommendation = {
  numbers: [
    {
      value: 17,
      frequency: 3,
      currentGap: 0,
      lastSeen: 0,
      pairScore: 0,
      score: 3
    }
  ]
}
