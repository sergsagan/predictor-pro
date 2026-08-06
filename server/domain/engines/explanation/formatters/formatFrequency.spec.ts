import { describe, expect, it } from 'vitest'

import { formatFrequency } from './formatFrequency'

describe('formatFrequency', () => {
  it('formats frequency', () => {
    expect(formatFrequency(142)).toBe('Appeared 142 times.')
  })
})
