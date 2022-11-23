import { NotImplementedException } from '@nestjs/common'
import { LeitnerScheduler } from './leitner-scheduling.strategy'
import { SchedulingStrategy } from './scheduling.strategy'

export enum AvailableSchedulers {
  LeitnerScheduler = 'LeitnerScheduler'
}

export class SchedulerFactory {
  fromEnum(scheduler: AvailableSchedulers): SchedulingStrategy {
    switch (scheduler as AvailableSchedulers) {
      case AvailableSchedulers.LeitnerScheduler:
        return new LeitnerScheduler()
      default:
        throw new NotImplementedException('Chosen Scheduler is not implemented!')
    }
  }
}
