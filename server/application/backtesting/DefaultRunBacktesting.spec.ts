import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'

import { DefaultRunBacktesting } from './DefaultRunBacktesting'

describe('DefaultRunBacktesting', () => {
  it('runs backtesting', () => {
    const backtestResult = [
      {
        recommendation: {
          numbers: []
        },
        actualDraw: {
          drawDate: '2026-01-02',
          numbers: [1, 2, 3, 4, 5],
          extraNumbers: [1, 2]
        },
        matches: 1
      }
    ]

    const backtestingEngine: BacktestingEngine = {
      run: vi.fn().mockReturnValue(backtestResult)
    }

    const useCase = new DefaultRunBacktesting(backtestingEngine)

    const draws: Draw[] = [
      {
        drawDate: '2026-01-01',
        numbers: [6, 7, 8, 9, 10],
        extraNumbers: [3, 4]
      }
    ]

    const result = useCase.execute(draws)

    expect(backtestingEngine.run).toHaveBeenCalledWith(draws)
    expect(result).toEqual(backtestResult)
  })
})
