import { FlashCard } from '../../entities/flash-card.entity'
import { Review } from '../../entities/review.entity'
import { SchedulingStrategy } from './scheduling.strategy'

export class LeitnerScheduler implements SchedulingStrategy {
  private delayPerBoxInDays = 1

  async schedule(flashCard: FlashCard): Promise<Date> {
    await flashCard.reviews.init()
    return this.convertBoxToDate(this.getNextBox(flashCard.reviews.getItems()))
  }

  private convertBoxToDate(box: number): Date {
    const resultingDate = new Date()
    resultingDate.setDate(resultingDate.getDate() + box * this.delayPerBoxInDays)

    return resultingDate
  }

  private getNextBox(repetitions: Review[]): number {
    // Simple streak algorithm, if we miss a repetition
    // reset the streak to zero, otherwise add one.
    return repetitions.reduce((streak, repetition) => (repetition.passed ? streak + 1 : 0), 0)
  }
}
