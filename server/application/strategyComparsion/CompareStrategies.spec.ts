import { describe, expect, it, vi } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { BacktestResult } from '@server/domain/models/BacktestResult'
import type { BacktestingEngine } from '@server/domain/engines/backtesting/BacktestingEngine'

import { DefaultCompareStrategies } from './DefaultCompareStrategies'

describe('DefaultCompareStrategies', () => {
  it('compares results from two backtesting engines', () => {
    const firstResults: readonly BacktestResult[] = []
    const secondResults: readonly BacktestResult[] = []

    const firstBacktestingEngine: BacktestingEngine = {
      run: vi.fn().mockReturnValue(firstResults)
    }

    const secondBacktestingEngine: BacktestingEngine = {
      run: vi.fn().mockReturnValue(secondResults)
    }

    const service = new DefaultCompareStrategies(
      {
        name: 'Simple',
        engine: firstBacktestingEngine
      },
      {
        name: 'GapFocused',
        engine: secondBacktestingEngine
      }
    )

    const draws: Draw[] = []

    const result = service.execute(draws)

    expect(firstBacktestingEngine.run).toHaveBeenCalledWith(draws)
    expect(secondBacktestingEngine.run).toHaveBeenCalledWith(draws)

    expect(result).toBeDefined()
  })
})
