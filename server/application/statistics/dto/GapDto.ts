export interface GapStatisticsDto {
  average: number

  minimum: number

  maximum: number
}

export type GapDto = Record<number, GapStatisticsDto>
