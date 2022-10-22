import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { AbstractEntity } from '../../../../libs/types/entity'
import { FlashCard } from './flash-card.entity'

@Entity()
export class Review extends AbstractEntity {
  constructor(card: FlashCard, answer: string, passed: boolean) {
    super()

    this.reviewedCard = card
    this.answer = answer
    this.passed = passed
  }

  @Property()
  created: Date = new Date()

  @ManyToOne(() => FlashCard)
  reviewedCard: FlashCard

  @Property()
  answer: string

  @Property()
  passed: boolean
}
