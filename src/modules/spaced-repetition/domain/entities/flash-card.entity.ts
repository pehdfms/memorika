import { BadRequestException } from '@nestjs/common'
import { ArrayNotEmpty, IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator'
import { AuditedEntity } from '../../../../libs/types/entity'
import { Property, Entity, ManyToOne, Collection, OneToMany, Cascade } from '@mikro-orm/core'
import { SchedulingStrategy } from '../value-objects/schedulers/scheduling.strategy'
import { Deck } from './deck.entity'
import { Review } from './review.entity'

@Entity()
export class FlashCard extends AuditedEntity {
  @IsString()
  @IsNotEmpty()
  @Property()
  question: string

  @IsArray()
  @ArrayNotEmpty()
  @Property()
  possibleAnswers: string[]

  @IsDateString()
  @Property({
    type: 'timestamp with time zone'
  })
  // -1 second to avoid a race condition that only happens in e2e tests
  // If we don't have this e2e tests are indeterministic, as sometimes
  // the due date starts off a couple miliseconds AFTER the current date
  // FIXME: I have no idea why this happens, mikro-orm batching?
  dueDate: Date = new Date(Date.now() - 1000)

  @OneToMany({
    entity: () => Review,
    mappedBy: (review) => review.reviewedCard,
    cascade: [Cascade.ALL]
  })
  reviews = new Collection<Review>(this)

  @ManyToOne(() => Deck)
  deck: Deck

  @Property({ persist: false })
  get isDue() {
    return new Date() >= this.dueDate
  }

  isAnswerCorrect(answer: string): boolean {
    return this.possibleAnswers.includes(answer)
  }

  async submitAnswer(answer: string, scheduler: SchedulingStrategy): Promise<Review> {
    if (!this.isDue) {
      console.log('is this the error?')
      throw new BadRequestException(
        'Submitting answers for flash cards that are not due is not allowed!'
      )
    }

    await this.reviews.init()

    const newReview = new Review(this, answer, this.isAnswerCorrect(answer))

    this.reviews.add(newReview)
    this.dueDate = await scheduler.schedule(this)

    return newReview
  }
}
