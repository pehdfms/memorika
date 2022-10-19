import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core'
import { AuditedEntity } from '../../../../libs/types/entity'
import { AvailableSchedulers } from '../value-objects/schedulers/available-schedulers.enum'
import { FlashCard } from './flash-card.entity'

@Entity()
export class Deck extends AuditedEntity {
  @Property()
  name: string

  @Property()
  description: string

  @Enum(() => AvailableSchedulers)
  scheduler: AvailableSchedulers

  @OneToMany(() => FlashCard, (flashcard) => flashcard.deck)
  flashCards = new Collection<FlashCard>(this)
}
