import { AbstractEntity } from '@libs/types/entity'
import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { FlashCard } from '../flash-cards/flash-card.entity'

@Entity()
export class Review extends AbstractEntity {
  constructor(card: FlashCard, answer: string) {
    super()

    this.reviewedCard = card
    this.answer = answer
    this.passed = card.isAnswerCorrect(answer)
  }

  @Property()
  reviewDate: Date = new Date()

  @ManyToOne(() => FlashCard)
  reviewedCard: FlashCard

  @Property()
  answer: string

  @Property()
  passed: boolean
}
