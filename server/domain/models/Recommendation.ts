export interface Recommendation {
  numbers: RecommendedNumber[]
}

export interface RecommendedNumber {
  value: number
  frequency: number
  currentGap: number
  pairScore: number
}
