import { BadRequestException } from '@nestjs/common'
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString
} from 'class-validator'
import { AuditedEntity } from '../../../../libs/types/entity'
import { Property, Entity, ManyToOne, Collection, OneToMany, Cascade } from '@mikro-orm/core'
import { Deck } from './deck.entity'
import { Review } from './review.entity'

@Entity()
export class FlashCard extends AuditedEntity {
  @Property()
  question: string

  @Property()
  possibleAnswers: string[]

  @Property()
  caseSensitive: boolean

  @Property({
    type: 'timestamp with time zone'
  })
  dueDate: Date = new Date()

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
    // Here we use an epsilon to avoid possible race conditions immediately
    // after persisting an entity. Business logic wise it makes sense to
    // give the user some leeway in how chained they are to scheduling. For
    // example: Anki lets you configure the leeway for its intervals from being
    // either 100% specific down to the second, to letting you always review
    // cards due that day, even if they're scheduled hours ahead.
    // GDBC principle applies here. Keeping this configurable doesn't aggregate
    // any value to 99% of users, and if we go the gamification route it's no
    // good letting people "cheat" by reviewing too far ahead.
    const oneSecond = 1000
    const epsilon = 5 * oneSecond

    return new Date(Date.now() + epsilon) >= this.dueDate
  }

  isAnswerCorrect(answer: string): boolean {
    return this.possibleAnswers.some((possibleAnswer) =>
      this.caseSensitive
        ? possibleAnswer === answer
        : possibleAnswer.toLowerCase() === answer.toLowerCase()
    )
  }

  async submitAnswer(answer: string): Promise<Review> {
    if (!this.isDue) {
      throw new BadRequestException(
        'Submitting answers for flash cards that are not due is not allowed!'
      )
    }

    const scheduler = this.deck.getScheduler()

    await this.reviews.init()

    const newReview = new Review(this, answer)

    this.reviews.add(newReview)
    this.dueDate = await scheduler.schedule(this)

    return newReview
  }
}
