import { describe, expect, it } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'

import { calculatePairFrequency } from './PairFrequencyCalculator'

describe('PairFrequencyCalculator', () => {
  it('counts all pairs in a draw', () => {
    // Arrange
    const draws: readonly Draw[] = [
      {
        drawDate: '2026-01-02',
        numbers: [1, 2, 3, 4, 5],
        extraNumbers: [1, 2]
      }
    ]

    // Act
    const frequency = calculatePairFrequency(draws)

    // Assert
    expect(frequency.get('1-2')).toBe(1)
    expect(frequency.get('1-3')).toBe(1)
    expect(frequency.get('1-4')).toBe(1)
    expect(frequency.get('1-5')).toBe(1)

    expect(frequency.get('2-3')).toBe(1)
    expect(frequency.get('2-4')).toBe(1)
    expect(frequency.get('2-5')).toBe(1)

    expect(frequency.get('3-4')).toBe(1)
    expect(frequency.get('3-5')).toBe(1)

    expect(frequency.get('4-5')).toBe(1)
  })

  it('counts pair frequency across multiple draws', () => {
    // Arrange
    const draws: readonly Draw[] = [
      {
        drawDate: '2026-01-02',
        numbers: [1, 2, 3, 4, 5],
        extraNumbers: [1, 2]
      },
      {
        drawDate: '2026-01-01',
        numbers: [1, 2, 6, 7, 8],
        extraNumbers: [3, 4]
      }
    ]

    // Act
    const frequency = calculatePairFrequency(draws)

    // Assert
    expect(frequency.get('1-2')).toBe(2)
    expect(frequency.get('1-3')).toBe(1)
    expect(frequency.get('6-7')).toBe(1)
  })

  it('ignores extra numbers', () => {
    // Arrange
    const draws: readonly Draw[] = [
      {
        drawDate: '2026-01-02',
        numbers: [1, 2, 3, 4, 5],
        extraNumbers: [6, 7]
      }
    ]

    // Act
    const frequency = calculatePairFrequency(draws)

    // Assert
    expect(frequency.has('6-7')).toBe(false)
    expect(frequency.has('1-6')).toBe(false)
  })
})
