import { describe, expect, it } from 'vitest'

import { calculatePairScore } from './calculatePairScore'
import { createPairKey } from './createPairKey'

describe('calculatePairScore', () => {
  it('returns zero when no numbers are selected', () => {
    const score = calculatePairScore(17, [], new Map())

    expect(score).toBe(0)
  })

  it('sums pair frequencies', () => {
    const score = calculatePairScore(
      17,
      [22, 37],
      new Map([
        [createPairKey(17, 22), 10],
        [createPairKey(17, 37), 5]
      ])
    )

    expect(score).toBe(15)
  })

  it('treats missing pair frequencies as zero', () => {
    const score = calculatePairScore(
      17,
      [22, 37],
      new Map([[createPairKey(17, 22), 10]])
    )

    expect(score).toBe(10)
  })
})
