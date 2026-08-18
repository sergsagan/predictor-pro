import { describe, expect, it } from 'vitest'

import type { AccuracyMetrics } from '@server/domain/models/AccuracyMetrics'

import { compareAlgorithms } from './AlgorithmComparisonCalculator'

describe('AlgorithmComparisonCalculator', () => {
  it('compares accuracy metrics of two algorithms', () => {
    const first: AccuracyMetrics = {
      totalPredictions: 10,
      totalMatches: 8,
      averageMatches: 0.8,
      predictionsWithMatches: 7,
      hitRate: 0.7,
      distribution: {
        0: 3,
        1: 4,
        2: 2,
        3: 1,
        4: 0,
        5: 0
      }
    }

    const second: AccuracyMetrics = {
      totalPredictions: 10,
      totalMatches: 6,
      averageMatches: 0.6,
      predictionsWithMatches: 5,
      hitRate: 0.5,
      distribution: {
        0: 5,
        1: 3,
        2: 2,
        3: 0,
        4: 0,
        5: 0
      }
    }

    const result = compareAlgorithms(
      {
        name: 'Algorithm A',
        metrics: first
      },
      {
        name: 'Algorithm B',
        metrics: second
      }
    )

    expect(result).toEqual({
      first: {
        name: 'Algorithm A',
        metrics: first
      },
      second: {
        name: 'Algorithm B',
        metrics: second
      },
      winner: 'Algorithm A'
    })
  })

  it('selects the algorithm with the higher hit rate', () => {
    const first: AccuracyMetrics = {
      totalPredictions: 10,
      totalMatches: 8,
      averageMatches: 0.8,
      predictionsWithMatches: 7,
      hitRate: 0.7,
      distribution: {
        0: 3,
        1: 4,
        2: 2,
        3: 1,
        4: 0,
        5: 0
      }
    }

    const second: AccuracyMetrics = {
      totalPredictions: 10,
      totalMatches: 6,
      averageMatches: 0.6,
      predictionsWithMatches: 5,
      hitRate: 0.5,
      distribution: {
        0: 5,
        1: 3,
        2: 2,
        3: 0,
        4: 0,
        5: 0
      }
    }

    const result = compareAlgorithms(
      {
        name: 'Algorithm A',
        metrics: first
      },
      {
        name: 'Algorithm B',
        metrics: second
      }
    )

    expect(result.winner).toBe('Algorithm A')
  })

  it('returns no winner when algorithms have the same hit rate', () => {
    const metrics: AccuracyMetrics = {
      totalPredictions: 10,
      totalMatches: 6,
      averageMatches: 0.6,
      predictionsWithMatches: 5,
      hitRate: 0.5,
      distribution: {
        0: 5,
        1: 3,
        2: 2,
        3: 0,
        4: 0,
        5: 0
      }
    }

    const result = compareAlgorithms(
      {
        name: 'Algorithm A',
        metrics
      },
      {
        name: 'Algorithm B',
        metrics
      }
    )

    expect(result.winner).toBeNull()
  })
})
