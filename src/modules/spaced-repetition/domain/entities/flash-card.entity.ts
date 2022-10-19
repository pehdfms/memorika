import { BadRequestException } from '@nestjs/common'
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator'
import { AuditedEntity } from '../../../../libs/types/entity'
import { Property, Entity, ManyToOne } from '@mikro-orm/core'
import { SchedulingStrategy } from '../value-objects/schedulers/scheduling.strategy'
import { Deck } from './deck.entity'
import { Review } from './review.entity'

@Entity()
export class FlashCard extends AuditedEntity {
  @IsString()
  @IsNotEmpty()
  question: string

  @IsArray()
  @ArrayNotEmpty()
  possibleAnswers: string[]

  @IsDateString()
  @Property({
    type: 'timestamp with time zone'
  })
  dueDate: Date = new Date()

  reviews: Review[]

  @ManyToOne(() => Deck)
  deck: Deck

  @Property()
  get isDue() {
    return this.dueDate <= new Date()
  }

  @Property()
  get passes(): Review[] {
    return this.reviews.filter((review) => review.answeredCorrectly)
  }

  @Property()
  get lapses(): Review[] {
    return this.reviews.filter((review) => !review.answeredCorrectly)
  }

  isAnswerCorrect(answer: string): boolean {
    return this.possibleAnswers.includes(answer)
  }

  submitAnswer(answer: string, scheduler: SchedulingStrategy) {
    if (!this.isDue) {
      throw new BadRequestException(
        'Submitting answers for flash cards that are not due is not allowed!'
      )
    }

    this.reviews.push(new Review(this, answer))
    this.dueDate = scheduler.schedule(this)
  }
}
