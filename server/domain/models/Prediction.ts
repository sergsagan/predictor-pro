export type Prediction = Readonly<{
  predictionDate: string // YYYY-MM-DD
  numbers: readonly [number, number, number, number, number]
}>
