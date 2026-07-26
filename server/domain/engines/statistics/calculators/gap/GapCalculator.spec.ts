import { describe, expect, it } from 'vitest'

import { sampleDraws } from '@test/fixtures/sampleDraws'

import { calculateGap } from './GapCalculator'

describe('calculateGap', () => {
  it('returns gap for the most recent occurrence', () => {
    const gaps = calculateGap(sampleDraws)

    expect(gaps.get(17)).toBe(0)
    expect(gaps.get(6)).toBe(1)
    expect(gaps.get(22)).toBe(2)
    expect(gaps.get(1)).toBe(sampleDraws.length)
  })
})
