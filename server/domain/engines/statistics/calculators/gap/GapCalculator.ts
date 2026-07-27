import type { Draw } from '@server/domain/models/Draw'

import { forEachDrawNumber } from '@server/domain/shared/forEachDrawNumber'

import type { Gap, GapStatistics } from './Gap'

interface GapAccumulator {
  lastSeen: number

  minimum?: number

  maximum?: number

  sum: number

  count: number
}

export function calculateGap(draws: readonly Draw[]): Gap {
  const accumulators = new Map<number, GapAccumulator>()

  forEachDrawNumber(draws, (number, drawIndex) => {
    const accumulator = accumulators.get(number)

    if (!accumulator) {
      accumulators.set(number, {
        lastSeen: drawIndex,
        sum: 0,
        count: 0
      })

      return
    }

    const currentGap = drawIndex - accumulator.lastSeen

    accumulator.minimum = Math.min(
      accumulator.minimum ?? currentGap,
      currentGap
    )

    accumulator.maximum = Math.max(
      accumulator.maximum ?? currentGap,
      currentGap
    )

    accumulator.sum += currentGap
    accumulator.count++
    accumulator.lastSeen = drawIndex
  })

  const gap = new Map<number, GapStatistics>()

  for (const [number, accumulator] of accumulators) {
    if (accumulator.count === 0) {
      continue
    }

    gap.set(number, {
      average: accumulator.sum / accumulator.count,
      minimum: accumulator.minimum!,
      maximum: accumulator.maximum!
    })
  }

  return gap
}
