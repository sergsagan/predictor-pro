import type { PredictionSchedule } from './PredictionSchedule'

export class DefaultPredictionSchedulingService {
  constructor(private readonly schedule: PredictionSchedule) {}

  isDue(currentDate: string, drawDate: string): boolean {
    const current = new Date(`${currentDate}T00:00:00Z`)
    const draw = new Date(`${drawDate}T00:00:00Z`)

    const millisecondsPerDay = 24 * 60 * 60 * 1000

    const differenceInDays =
      (draw.getTime() - current.getTime()) / millisecondsPerDay

    return (
      differenceInDays <= this.schedule.generateBeforeDrawDays &&
      differenceInDays >= 0
    )
  }
}
