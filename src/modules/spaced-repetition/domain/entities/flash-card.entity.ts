import { BadRequestException } from '@nestjs/common'
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator'
import { AuditedEntity } from 'src/libs/types/entity'
import { AfterLoad, Column, Entity, ManyToOne } from 'typeorm'
import { SchedulingStrategy } from '../value-objects/schedulers/scheduling.strategy'
import { Deck } from './deck.entity'
import { Review } from './review.entity'

@Entity()
export class FlashCard extends AuditedEntity {
  @IsString()
  @IsNotEmpty()
  readonly question: string

  @IsArray()
  @ArrayNotEmpty()
  readonly possibleAnswers: string[]

  @IsDateString()
  @IsOptional()
  @Column({
    type: 'timestamp with time zone',
    default: new Date()
  })
  dueDate: Date

  isDue: boolean

  @AfterLoad()
  setIsDue() {
    this.isDue = this.dueDate === null ? true : this.dueDate <= new Date()
  }

  reviews: Review[]

  @ManyToOne(() => Deck, (deck) => deck.flashCards, { onDelete: 'CASCADE' })
  deck: Deck

  get passes(): Review[] {
    return this.reviews.filter((review) => review.answeredCorrectly)
  }

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
