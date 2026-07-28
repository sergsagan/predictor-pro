import { describe, expect, it } from 'vitest'

import { sampleDraws } from '@server/test/fixtures/sampleDraws'

import { calculateCurrentGap } from './CurrentGapCalculator'

describe('calculateCurrentGap', () => {
  it('returns current gap for numbers in the latest draw', () => {
    const result = calculateCurrentGap(sampleDraws)

    expect(result.get(4)).toBe(0)
    expect(result.get(6)).toBe(1)
  })

  it('returns current gap for numbers from the third draw', () => {
    const result = calculateCurrentGap(sampleDraws)

    expect(result.get(22)).toBe(2)
  })

  it('uses the latest occurrence of a number', () => {
    const result = calculateCurrentGap(sampleDraws)

    expect(result.get(17)).toBe(0)
    expect(result.get(37)).toBe(0)
  })
})
