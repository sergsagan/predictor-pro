import type { Draw } from '@server/domain/models/Draw'
import { increaseCounter } from '@server/domain/shared/increaseCounter'
import { forEachDrawNumber } from '@server/domain/shared/forEachDrawNumber'
import { MAIN_NUMBERS } from '@server/domain/shared/mainNumbers'

export function calculateFrequency(
  draws: readonly Draw[]
): ReadonlyMap<number, number> {
  const frequency = new Map<number, number>()

  for (const number of MAIN_NUMBERS) {
    frequency.set(number, 0)
  }

  forEachDrawNumber(draws, (number) => {
    increaseCounter(frequency, number)
  })

  return frequency
}
