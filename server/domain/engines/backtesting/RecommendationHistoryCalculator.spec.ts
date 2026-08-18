import { describe, expect, it } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { Recommendation } from '@server/domain/models/Recommendation'
import type { BacktestResult } from '@server/domain/models/BacktestResult'

import { calculateRecommendationHistory } from './RecommendationHistoryCalculator'

describe('RecommendationHistoryCalculator', () => {
  it('builds recommendation history from backtest results', () => {
    const recommendation: Recommendation = {
      numbers: [
        {
          value: 1,
          frequency: 1,
          currentGap: 0,
          lastSeen: 0,
          pairScore: 0,
          score: 1
        },
        {
          value: 2,
          frequency: 1,
          currentGap: 0,
          lastSeen: 0,
          pairScore: 0,
          score: 1
        },
        {
          value: 3,
          frequency: 1,
          currentGap: 0,
          lastSeen: 0,
          pairScore: 0,
          score: 1
        },
        {
          value: 4,
          frequency: 1,
          currentGap: 0,
          lastSeen: 0,
          pairScore: 0,
          score: 1
        },
        {
          value: 5,
          frequency: 1,
          currentGap: 0,
          lastSeen: 0,
          pairScore: 0,
          score: 1
        }
      ]
    }

    const actualDraw: Draw = {
      drawDate: '2026-01-02',
      numbers: [1, 6, 7, 8, 9],
      extraNumbers: [3, 4]
    }

    const backtestResult: BacktestResult = {
      recommendation,
      actualDraw,
      matches: 1
    }

    const history = calculateRecommendationHistory([backtestResult])

    expect(history).toEqual([
      {
        drawDate: '2026-01-02',
        recommendation,
        actualDraw,
        matches: 1
      }
    ])
  })

  it('returns empty history when there are no backtest results', () => {
    const history = calculateRecommendationHistory([])

    expect(history).toEqual([])
  })

  it('preserves the order of backtest results', () => {
    const firstResult: BacktestResult = {
      recommendation: {
        numbers: []
      },
      actualDraw: {
        drawDate: '2026-01-02',
        numbers: [1, 2, 3, 4, 5],
        extraNumbers: [1, 2]
      },
      matches: 2
    }

    const secondResult: BacktestResult = {
      recommendation: {
        numbers: []
      },
      actualDraw: {
        drawDate: '2026-01-03',
        numbers: [6, 7, 8, 9, 10],
        extraNumbers: [3, 4]
      },
      matches: 0
    }

    const history = calculateRecommendationHistory([firstResult, secondResult])

    expect(history).toEqual([
      {
        drawDate: '2026-01-02',
        recommendation: firstResult.recommendation,
        actualDraw: firstResult.actualDraw,
        matches: 2
      },
      {
        drawDate: '2026-01-03',
        recommendation: secondResult.recommendation,
        actualDraw: secondResult.actualDraw,
        matches: 0
      }
    ])
  })
})
