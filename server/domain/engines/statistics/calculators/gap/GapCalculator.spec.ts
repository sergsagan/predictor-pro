import { describe, expect, it } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'

import { calculateGap } from './GapCalculator'

describe('GapCalculator', () => {
  it('returns statistics only for numbers with more than one appearance', () => {
    // Arrange
    const draws: readonly Draw[] = [
      {
        drawDate: '2026-01-10',
        numbers: [1, 2, 3, 4, 17],
        extraNumbers: [1, 2]
      },
      {
        drawDate: '2026-01-09',
        numbers: [5, 6, 7, 8, 9],
        extraNumbers: [3, 4]
      },
      {
        drawDate: '2026-01-08',
        numbers: [10, 11, 12, 13, 17],
        extraNumbers: [5, 6]
      }
    ]

    // Act
    const gap = calculateGap(draws)

    // Assert
    expect(gap.has(17)).toBe(true)
    expect(gap.has(1)).toBe(false)
  })

  it('calculates gap statistics', () => {
    // Arrange
    const draws: readonly Draw[] = [
      {
        drawDate: '2026-01-10',
        numbers: [1, 2, 3, 4, 17],
        extraNumbers: [1, 2]
      },
      {
        drawDate: '2026-01-09',
        numbers: [5, 6, 7, 8, 9],
        extraNumbers: [3, 4]
      },
      {
        drawDate: '2026-01-08',
        numbers: [10, 11, 12, 13, 17],
        extraNumbers: [5, 6]
      },
      {
        drawDate: '2026-01-07',
        numbers: [14, 15, 16, 18, 19],
        extraNumbers: [7, 8]
      },
      {
        drawDate: '2026-01-06',
        numbers: [20, 21, 22, 23, 24],
        extraNumbers: [9, 10]
      },
      {
        drawDate: '2026-01-05',
        numbers: [25, 26, 27, 28, 17],
        extraNumbers: [11, 12]
      },
      {
        drawDate: '2026-01-04',
        numbers: [29, 30, 31, 32, 33],
        extraNumbers: [1, 2]
      },
      {
        drawDate: '2026-01-03',
        numbers: [34, 35, 36, 37, 38],
        extraNumbers: [3, 4]
      },
      {
        drawDate: '2026-01-02',
        numbers: [39, 40, 41, 42, 43],
        extraNumbers: [5, 6]
      },
      {
        drawDate: '2026-01-01',
        numbers: [44, 45, 46, 47, 17],
        extraNumbers: [7, 8]
      }
    ]

    // Act
    const gap = calculateGap(draws)

    // Assert
    expect(gap.get(17)?.minimum).toBe(2)
    expect(gap.get(17)?.maximum).toBe(4)
    expect(gap.get(17)?.average).toBe(3)
  })
})
