import { OmitType } from '@nestjs/swagger'
import { AuditedEntity } from 'src/libs/types/entity'
import { FlashCard } from './flash-card.entity'

export class Review extends OmitType(AuditedEntity, ['updated']) {
  constructor(card: FlashCard, answer: string) {
    super()

    this.reviewedCard = card
    this.answer = answer
    this.answeredCorrectly = card.isAnswerCorrect(answer)
  }

  reviewedCard: FlashCard
  answer: string
  answeredCorrectly: boolean
}
