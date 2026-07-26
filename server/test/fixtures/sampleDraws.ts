import type { Draw } from '@server/domain/models/Draw'

export const sampleDraws: readonly Draw[] = [
  {
    drawDate: '2026-07-21',
    numbers: [4, 8, 10, 17, 37],
    extraNumbers: [5, 7]
  },
  {
    drawDate: '2026-07-17',
    numbers: [6, 17, 31, 37, 48],
    extraNumbers: [2, 9]
  },
  {
    drawDate: '2026-07-14',
    numbers: [17, 22, 37, 41, 50],
    extraNumbers: [1, 11]
  }
]
