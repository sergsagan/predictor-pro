import { describe, expect, it } from 'vitest'

import type { PredictionSchedule } from './PredictionSchedule'

describe('PredictionSchedule', () => {
  it('defines prediction generation timing before draw', () => {
    const schedule: PredictionSchedule = {
      generateBeforeDrawDays: 1
    }

    expect(schedule).toEqual({
      generateBeforeDrawDays: 1
    })
  })
})
