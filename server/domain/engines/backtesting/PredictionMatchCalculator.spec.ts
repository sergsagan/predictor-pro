import { describe, expect, it } from 'vitest'

import type { Draw } from '@server/domain/models/Draw'
import type { Prediction } from '@server/domain/models/Prediction'

import { countPredictionMatches } from './PredictionMatchCalculator'

describe('countPredictionMatches', () => {
  it('counts matching main numbers', () => {
    const prediction: Prediction = {
      predictionDate: '2026-08-31',
      numbers: [7, 15, 23, 32, 44]
    }

    const draw: Draw = {
      drawDate: '2026-09-01',
      numbers: [7, 15, 20, 32, 45],
      extraNumbers: [2, 8]
    }

    expect(countPredictionMatches(prediction, draw)).toBe(3)
  })
})
