import { describe, expect, it } from 'vitest'

import type { PredictionSchedule } from './PredictionSchedule'

import { DefaultPredictionSchedulingService } from './DefaultPredictionSchedulingService'

describe('DefaultPredictionSchedulingService', () => {
  it('returns true when prediction is due', () => {
    const schedule: PredictionSchedule = {
      generateBeforeDrawDays: 1
    }

    const service = new DefaultPredictionSchedulingService(schedule)

    expect(service.isDue('2026-09-01', '2026-09-02')).toBe(true)
  })

  it('returns false when prediction is not yet due', () => {
    const schedule: PredictionSchedule = {
      generateBeforeDrawDays: 1
    }

    const service = new DefaultPredictionSchedulingService(schedule)

    expect(service.isDue('2026-08-31', '2026-09-02')).toBe(false)
  })

  it('returns true when draw is today', () => {
    const schedule: PredictionSchedule = {
      generateBeforeDrawDays: 1
    }

    const service = new DefaultPredictionSchedulingService(schedule)

    expect(service.isDue('2026-09-02', '2026-09-02')).toBe(true)
  })

  it('returns false when draw date has already passed', () => {
    const schedule: PredictionSchedule = {
      generateBeforeDrawDays: 1
    }

    const service = new DefaultPredictionSchedulingService(schedule)

    expect(service.isDue('2026-09-03', '2026-09-02')).toBe(false)
  })
})
