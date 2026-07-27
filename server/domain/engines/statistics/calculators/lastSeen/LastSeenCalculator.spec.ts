import { describe, expect, it } from 'vitest'

import { sampleDraws } from '@test/fixtures/sampleDraws'

import { calculateLastSeen } from './LastSeenCalculator'

describe('calculateLastSeen', () => {
  it('returns lastSeen for the most recent occurrence', () => {
    const lastSeens = calculateLastSeen(sampleDraws)

    expect(lastSeens.get(17)).toBe(0)
    expect(lastSeens.get(6)).toBe(1)
    expect(lastSeens.get(22)).toBe(2)
    expect(lastSeens.get(1)).toBe(sampleDraws.length)
  })
})
