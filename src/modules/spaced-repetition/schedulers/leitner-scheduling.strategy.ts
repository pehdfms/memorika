import { oneDay } from '@libs/utils/time.utils'
import { InternalServerErrorException, Logger } from '@nestjs/common'
import { FlashCard } from '../flash-cards/flash-card.entity'
import { Review } from '../reviews/review.entity'
import { SchedulingStrategy } from './scheduling.strategy'

export class LeitnerScheduler implements SchedulingStrategy {
  private readonly logger = new Logger(LeitnerScheduler.name)

  async schedule(flashCard: FlashCard): Promise<Date> {
    const reviewCount = flashCard.reviews.length

    if (reviewCount === 0) {
      // TODO write domain error instead of throwing transport specific error.
      throw new InternalServerErrorException(
        `Received Flash Card ${flashCard} with an empty review collection. ` +
          "Make sure you're adding a new review BEFORE calling the scheduler!"
      )
    }

    const lastReviewDate = flashCard.reviews[flashCard.reviews.length - 1].reviewDate
    let resultingDate = this.convertBoxToDate(
      this.getNextBox(flashCard.reviews.getItems()),
      lastReviewDate
    )

    if (resultingDate < lastReviewDate) {
      this.logger.error(
        `Scheduled Flash Card ${flashCard} to before its last review date. ` +
          'The program can cope with this, but it suggests a bad scheduler ' +
          'implementation.'
      )

      // Limit the effect that bad schedules have on a card.
      resultingDate = lastReviewDate
    }

    return resultingDate
  }

  private convertBoxToDate(box: number, startingDate: Date): Date {
    // We receive a startingDate by argument so that we can schedule by actual
    // completion date, even if the scheduling gets delayed. Worst case this
    // can lead to schedules for the past, but that's a valid state to have.
    const resultingDate = new Date(startingDate.getTime() + box * this.getDelayPerBox())
    return resultingDate
  }

  private getNextBox(repetitions: Review[]): number {
    // Simple streak algorithm, if we miss a repetition
    // reset the streak to zero, otherwise add one.
    return repetitions.reduce((streak, repetition) => (repetition.passed ? streak + 1 : 0), 0)
  }

  private getDelayPerBox(): number {
    // Separated to its own function so we can add arbitrary complexity.
    const delayPerBox = oneDay
    return delayPerBox
  }
}
