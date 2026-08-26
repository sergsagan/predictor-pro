import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { StatisticsEngine } from '../statistics/StatisticsEngine'
import type { RecommendationEngine } from '../recommendation/engines/RecommendationEngine'

import { SimpleBacktestingEngine } from './SimpleBacktestingEngine'

describe('SimpleBacktestingEngine', () => {
  it('skips the first draw because there is no historical data', () => {
    const statisticsEngine: StatisticsEngine = {
      calculate: vi.fn()
    }

    const recommendationEngine: RecommendationEngine = {
      recommend: vi.fn()
    }

    const engine = new SimpleBacktestingEngine(
      statisticsEngine,
      recommendationEngine
    )

    const draws: Draw[] = [
      {
        drawDate: '2026-01-01',
        numbers: [1, 2, 3, 4, 5],
        extraNumbers: [1, 2]
      }
    ]

    const result = engine.run(draws)

    expect(result).toEqual([])
    expect(statisticsEngine.calculate).not.toHaveBeenCalled()
    expect(recommendationEngine.recommend).not.toHaveBeenCalled()
  })

  it('uses previous draws to generate a recommendation for the next draw', () => {
    const statistics = {
      frequency: new Map(),
      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map(),
      currentGap: new Map()
    }

    const recommendation = {
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

    const statisticsEngine: StatisticsEngine = {
      calculate: vi.fn().mockReturnValue(statistics)
    }

    const recommendationEngine: RecommendationEngine = {
      recommend: vi.fn().mockReturnValue(recommendation)
    }

    const engine = new SimpleBacktestingEngine(
      statisticsEngine,
      recommendationEngine
    )

    const draw1: Draw = {
      drawDate: '2026-01-01',
      numbers: [1, 2, 3, 4, 5],
      extraNumbers: [1, 2]
    }

    const draw2: Draw = {
      drawDate: '2026-01-02',
      numbers: [1, 6, 7, 8, 9],
      extraNumbers: [3, 4]
    }

    const result = engine.run([draw1, draw2])

    expect(statisticsEngine.calculate).toHaveBeenCalledWith([draw1])
    expect(recommendationEngine.recommend).toHaveBeenCalledWith(statistics)

    expect(result).toEqual([
      {
        recommendation,
        actualDraw: draw2,
        matches: 1
      }
    ])
  })

  it('uses all previous draws for each subsequent prediction', () => {
    const statistics = {
      frequency: new Map(),
      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map(),
      currentGap: new Map()
    }

    const recommendation = {
      numbers: []
    }

    const statisticsEngine: StatisticsEngine = {
      calculate: vi.fn().mockReturnValue(statistics)
    }

    const recommendationEngine: RecommendationEngine = {
      recommend: vi.fn().mockReturnValue(recommendation)
    }

    const engine = new SimpleBacktestingEngine(
      statisticsEngine,
      recommendationEngine
    )

    const draw1: Draw = {
      drawDate: '2026-01-01',
      numbers: [1, 2, 3, 4, 5],
      extraNumbers: [1, 2]
    }

    const draw2: Draw = {
      drawDate: '2026-01-02',
      numbers: [6, 7, 8, 9, 10],
      extraNumbers: [3, 4]
    }

    const draw3: Draw = {
      drawDate: '2026-01-03',
      numbers: [11, 12, 13, 14, 15],
      extraNumbers: [5, 6]
    }

    engine.run([draw1, draw2, draw3])

    expect(statisticsEngine.calculate).toHaveBeenNthCalledWith(1, [draw1])

    expect(statisticsEngine.calculate).toHaveBeenNthCalledWith(2, [
      draw1,
      draw2
    ])

    expect(recommendationEngine.recommend).toHaveBeenCalledTimes(2)
  })

  it('processes draws in chronological order', () => {
    const statistics = {
      frequency: new Map(),
      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map(),
      currentGap: new Map()
    }

    const recommendation = {
      numbers: []
    }

    const statisticsEngine: StatisticsEngine = {
      calculate: vi.fn().mockReturnValue(statistics)
    }

    const recommendationEngine: RecommendationEngine = {
      recommend: vi.fn().mockReturnValue(recommendation)
    }

    const engine = new SimpleBacktestingEngine(
      statisticsEngine,
      recommendationEngine
    )

    const newestDraw: Draw = {
      drawDate: '2026-01-03',
      numbers: [11, 12, 13, 14, 15],
      extraNumbers: [5, 6]
    }

    const middleDraw: Draw = {
      drawDate: '2026-01-02',
      numbers: [6, 7, 8, 9, 10],
      extraNumbers: [3, 4]
    }

    const oldestDraw: Draw = {
      drawDate: '2026-01-01',
      numbers: [1, 2, 3, 4, 5],
      extraNumbers: [1, 2]
    }

    engine.run([newestDraw, middleDraw, oldestDraw])

    expect(statisticsEngine.calculate).toHaveBeenNthCalledWith(1, [oldestDraw])

    expect(statisticsEngine.calculate).toHaveBeenNthCalledWith(2, [
      oldestDraw,
      middleDraw
    ])

    expect(recommendationEngine.recommend).toHaveBeenCalledTimes(2)
  })
})
