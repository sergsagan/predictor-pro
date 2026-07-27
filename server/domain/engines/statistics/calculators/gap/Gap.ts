export interface GapStatistics {
  average: number

  minimum: number

  maximum: number
}

export type Gap = ReadonlyMap<number, GapStatistics>
