import type { Gap } from '@server/domain/engines/statistics/calculators/gap/Gap'

import type { GapDto } from '@server/application/statistics/dto/GapDto'

export function toGapDto(gap: Gap): GapDto {
  return Object.fromEntries(gap)
}
