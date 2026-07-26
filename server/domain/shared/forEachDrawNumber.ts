import type { Draw } from '@server/domain/models/Draw'

export function forEachDrawNumber(
  draws: readonly Draw[],
  callback: (number: number, drawIndex: number) => void
): void {
  draws.forEach((draw, drawIndex) => {
    draw.numbers.forEach((number) => {
      callback(number, drawIndex)
    })
  })
}
