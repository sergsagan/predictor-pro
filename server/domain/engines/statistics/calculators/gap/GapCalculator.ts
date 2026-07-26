import type { Draw } from '@server/domain/models/Draw'

import { forEachDrawNumber } from '@server/domain/shared/forEachDrawNumber'
import { MAIN_NUMBERS } from '@server/domain/shared/mainNumbers'

export function calculateGap(
  draws: readonly Draw[]
): ReadonlyMap<number, number> {
  const gaps = new Map<number, number>()

  forEachDrawNumber(draws, (number, drawIndex) => {
    if (!gaps.has(number)) {
      gaps.set(number, drawIndex)
    }
  })

  for (const number of MAIN_NUMBERS) {
    if (!gaps.has(number)) {
      gaps.set(number, draws.length)
    }
  }

  return gaps
}
