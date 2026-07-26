import { describe, expect, it } from 'vitest'

import { sampleDraws } from '@test/fixtures/sampleDraws'

import { createStatisticsEngine } from './DefaultStatisticsEngine'

describe('DefaultStatisticsEngine', () => {
  it('calculates frequency and gap statistics', () => {
    const engine = createStatisticsEngine()

    const statistics = engine.calculate(sampleDraws)

    expect(statistics.frequency.get(17)).toBe(3)
    expect(statistics.gap.get(17)).toBe(0)
  })
})
