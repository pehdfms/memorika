import { AuditedEntity } from 'src/libs/types/entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { AvailableSchedulers } from '../value-objects/schedulers/available-schedulers.enum'
import { SchedulerFactory } from '../value-objects/schedulers/scheduler.factory'
import { SchedulingStrategy } from '../value-objects/schedulers/scheduling.strategy'
import { FlashCard } from './flash-card.entity'

@Entity()
export class Deck extends AuditedEntity {
  @Column()
  name: string

  @Column()
  description: string

  @Column()
  schedulingStrategy: AvailableSchedulers

  @OneToMany(() => FlashCard, (flashcard) => flashcard.deck)
  flashCards: FlashCard[]

  get scheduler(): SchedulingStrategy {
    return new SchedulerFactory().fromEnum(this.schedulingStrategy)
  }
}
