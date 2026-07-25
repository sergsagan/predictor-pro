export type Draw = Readonly<{
  drawDate: string // YYYY-MM-DD

  numbers: readonly [number, number, number, number, number]

  extraNumbers: readonly [number, number]
}>
