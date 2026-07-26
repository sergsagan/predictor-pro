import type { Draw } from '../../models/Draw'


export type DrawRepository = Readonly<{
  findAll(): Promise<readonly Draw[]>

  findLatest(): Promise<Draw | null>

  findByDate(drawDate: string): Promise<Draw | null>
}>
