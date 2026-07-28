import type { Draw } from '@server/domain/models/Draw'

import type { CurrentGap } from './СurrentGap'

export function calculateCurrentGap(draws: readonly Draw[]): CurrentGap {
  const currentGap = new Map<number, number>()

  for (const [gap, draw] of draws.entries()) {
    for (const number of draw.numbers) {
      if (!currentGap.has(number)) {
        currentGap.set(number, gap)
      }
    }
  }

  return currentGap
}
