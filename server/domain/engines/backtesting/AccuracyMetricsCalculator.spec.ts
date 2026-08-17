import { describe, expect, it } from 'vitest'

import { calculateAccuracyMetrics } from './AccuracyMetricsCalculator'

describe('AccuracyMetricsCalculator', () => {
  it('calculates accuracy metrics from backtest results', () => {
    const results = [
      { matches: 0 },
      { matches: 1 },
      { matches: 2 },
      { matches: 0 },
      { matches: 1 }
    ]

    const metrics = calculateAccuracyMetrics(results)

    expect(metrics).toEqual({
      totalPredictions: 5,
      totalMatches: 4,
      averageMatches: 0.8,
      predictionsWithMatches: 3,
      hitRate: 0.6,
      distribution: {
        0: 2,
        1: 2,
        2: 1,
        3: 0,
        4: 0,
        5: 0
      }
    })
  })

  it('returns zero metrics for empty results', () => {
    const metrics = calculateAccuracyMetrics([])

    expect(metrics).toEqual({
      totalPredictions: 0,
      totalMatches: 0,
      averageMatches: 0,
      predictionsWithMatches: 0,
      hitRate: 0,
      distribution: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    })
  })

  it('calculates distribution for all possible match counts', () => {
    const results = [
      { matches: 0 },
      { matches: 1 },
      { matches: 2 },
      { matches: 3 },
      { matches: 4 },
      { matches: 5 }
    ]

    const metrics = calculateAccuracyMetrics(results)

    expect(metrics.distribution).toEqual({
      0: 1,
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1
    })
  })

  it('keeps average matches and hit rate as precise ratios', () => {
    const results = [{ matches: 0 }, { matches: 0 }, { matches: 1 }]

    const metrics = calculateAccuracyMetrics(results)

    expect(metrics.averageMatches).toBe(1 / 3)
    expect(metrics.hitRate).toBe(1 / 3)
  })
})
