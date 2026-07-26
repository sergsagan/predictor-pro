import { expect } from 'vitest'

export function expectFrequency(
  actual: ReadonlyMap<number, number>,
  expected: Readonly<Record<number, number>>
): void {
  expect(actual.size).toBe(50)

  for (let number = 1; number <= 50; number++) {
    expect(actual.has(number)).toBe(true)
  }

  for (const [number, count] of Object.entries(expected)) {
    expect(actual.get(Number(number))).toBe(count)
  }
}
