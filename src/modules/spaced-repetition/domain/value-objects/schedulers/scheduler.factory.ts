import { NotImplementedException } from '@nestjs/common'
import { AvailableSchedulers } from './available-schedulers.enum'
import { LeitnerScheduler } from './leitner-scheduling.strategy'
import { SchedulingStrategy } from './scheduling.strategy'

export class SchedulerFactory {
  fromEnum(scheduler: AvailableSchedulers): SchedulingStrategy {
    switch (scheduler) {
      case AvailableSchedulers.LeitnerScheduler:
        return new LeitnerScheduler()
      default:
        throw new NotImplementedException()
    }
  }
}
