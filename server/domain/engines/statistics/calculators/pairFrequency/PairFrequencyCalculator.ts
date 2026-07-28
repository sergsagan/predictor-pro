import type { Draw } from '@server/domain/models/Draw'

import type { PairFrequency } from './PairFrequency'

export function calculatePairFrequency(draws: readonly Draw[]): PairFrequency {
  const frequency = new Map<string, number>()

  for (const draw of draws) {
    const numbers = draw.numbers

    for (let i = 0; i < numbers.length - 1; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        const key = createPairKey(numbers[i]!, numbers[j]!)

        frequency.set(key, (frequency.get(key) ?? 0) + 1)
      }
    }
  }

  return frequency
}

function createPairKey(first: number, second: number): string {
  const smaller = Math.min(first, second)
  const larger = Math.max(first, second)

  return `${smaller}-${larger}`
}
