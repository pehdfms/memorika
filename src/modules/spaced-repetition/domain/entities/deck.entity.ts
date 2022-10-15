import { AuditedEntity } from 'src/libs/types/entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { FlashCard } from './flash-card.entity'

@Entity()
export class Deck extends AuditedEntity {
  @Column()
  name: string

  @Column()
  description: string

  // TODO
  // scheduler: PossibleSchedulers (enum)
  // getScheduler() { return new SchedulerFactory().fromEnum(this.scheduler).build() }

  @OneToMany(() => FlashCard, (flashcard) => flashcard.deck)
  flashCards: FlashCard[]
}
