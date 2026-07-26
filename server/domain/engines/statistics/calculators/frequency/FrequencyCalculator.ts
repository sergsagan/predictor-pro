import type { Draw } from '../../../../models/Draw'
import { increaseCounter } from '../../../../shared/increaseCounter'

export function calculateFrequency(
  draws: readonly Draw[]
): ReadonlyMap<number, number> {
  const frequency = new Map<number, number>()

  for (let number = 1; number <= 50; number++) {
    frequency.set(number, 0)
  }

  for (const draw of draws) {
    for (const number of draw.numbers) {
      increaseCounter(frequency, number)
    }
  }

  return frequency
}
