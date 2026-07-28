import type { CurrentGap } from '@server/domain/engines/statistics/calculators/currentGap/СurrentGap'

export const sampleCurrentGap: CurrentGap = new Map([
  [1, 10],
  [2, 9],
  [3, 8],
  [4, 7],
  [5, 6],
  [6, 5]
])
