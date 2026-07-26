import type { Draw } from '../../engines/draws/Draw'

export type DrawRepository = Readonly<{
  findAll(): Promise<readonly Draw[]>

  findLatest(): Promise<Draw | null>

  findByDate(drawDate: string): Promise<Draw | null>
}>
