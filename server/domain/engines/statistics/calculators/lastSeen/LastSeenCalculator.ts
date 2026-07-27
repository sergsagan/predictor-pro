import type { Draw } from '@server/domain/models/Draw'

import { forEachDrawNumber } from '@server/domain/shared/forEachDrawNumber'
import { MAIN_NUMBERS } from '@server/domain/shared/mainNumbers'
import type { LastSeen } from './LastSeen'

export function calculateLastSeen(draws: readonly Draw[]): LastSeen {
  const lastSeens = new Map<number, number>()

  forEachDrawNumber(draws, (number, drawIndex) => {
    if (!lastSeens.has(number)) {
      lastSeens.set(number, drawIndex)
    }
  })

  for (const number of MAIN_NUMBERS) {
    if (!lastSeens.has(number)) {
      lastSeens.set(number, draws.length)
    }
  }

  return lastSeens
}
