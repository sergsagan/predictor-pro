import { expect } from 'vitest'
import { MAIN_NUMBERS } from '../../domain/shared/mainNumbers'

export function expectFrequency(
  actual: ReadonlyMap<number, number>,
  expected: Readonly<Record<number, number>>
): void {
  expect(actual.size).toBe(MAIN_NUMBERS.length)

  for (let number = 1; number <= MAIN_NUMBERS.length; number++) {
    expect(actual.has(number)).toBe(true)
  }

  for (const [number, count] of Object.entries(expected)) {
    expect(actual.get(Number(number))).toBe(count)
  }
}
