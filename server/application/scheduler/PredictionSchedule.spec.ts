import { describe, expect, it } from 'vitest'

import type { PredictionSchedule } from './PredictionSchedule'

describe('PredictionSchedule', () => {
  it('defines prediction generation timing before draw', () => {
    const schedule: PredictionSchedule = {
      generateBeforeDrawHours: 24
    }

    expect(schedule).toEqual({
      generateBeforeDrawHours: 24
    })
  })
})
