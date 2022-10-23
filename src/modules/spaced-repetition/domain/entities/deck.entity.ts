import { Cascade, Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core'
import { AuditedEntity } from '../../../../libs/types/entity'
import { AvailableSchedulers } from '../value-objects/schedulers/available-schedulers.enum'
import { SchedulerFactory } from '../value-objects/schedulers/scheduler.factory'
import { SchedulingStrategy } from '../value-objects/schedulers/scheduling.strategy'
import { FlashCard } from './flash-card.entity'

@Entity()
export class Deck extends AuditedEntity {
  @Property()
  name: string

  @Property()
  description: string

  @Enum(() => AvailableSchedulers)
  scheduler: AvailableSchedulers

  @OneToMany({
    entity: () => FlashCard,
    mappedBy: (flashcard) => flashcard.deck,
    cascade: [Cascade.ALL]
  })
  flashCards = new Collection<FlashCard>(this)

  getScheduler(): SchedulingStrategy {
    return new SchedulerFactory().fromEnum(this.scheduler)
  }
}
