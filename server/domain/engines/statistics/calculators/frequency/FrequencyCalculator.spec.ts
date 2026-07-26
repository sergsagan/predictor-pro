import { describe, it } from 'vitest'

import { sampleDraws } from '../../../../../test/fixtures/sampleDraws'
import { expectFrequency } from '../../../../../test/matchers/expectFrequency'

import { calculateFrequency } from './FrequencyCalculator'

describe('FrequencyCalculator', () => {
  it('calculates frequency of main numbers', () => {
    // Arrange

    // Act
    const frequency = calculateFrequency(sampleDraws)

    // Assert
    expectFrequency(frequency, {
      4: 1,
      6: 1,
      8: 1,
      10: 1,
      17: 3,
      22: 1,
      31: 1,
      37: 3,
      41: 1,
      48: 1,
      50: 1
    })
  })
})
