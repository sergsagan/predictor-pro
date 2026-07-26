import type { Draw } from '@server/domain/models/Draw'


export type DrawRepository = Readonly<{
  findAll(): Promise<readonly Draw[]>

  findLatest(): Promise<Draw | null>

  findByDate(drawDate: string): Promise<Draw | null>
}>
