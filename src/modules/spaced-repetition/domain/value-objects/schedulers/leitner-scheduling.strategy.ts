import { FlashCard } from '../../entities/flash-card.entity'
import { Repetition } from '../../entities/repetition.entity'
import { FlashCardSchedulingStrategy } from './flash-card-scheduling.strategy'

export class LeitnerScheduler implements FlashCardSchedulingStrategy {
  private delayPerBoxInDays = 1

  schedule(flashCard: FlashCard): Date {
    return this.convertBoxToDate(this.getNextBox(flashCard.repetitions))
  }

  private convertBoxToDate(box: number): Date {
    const resultingDate = new Date()
    resultingDate.setDate(resultingDate.getDate() + box * this.delayPerBoxInDays)

    return resultingDate
  }

  private getNextBox(repetitions: Repetition[]): number {
    // Simple streak algorithm, if we miss a repetition
    // reset the streak to zero, otherwise add one.
    return repetitions.reduce(
      (streak, repetition) => (repetition.answeredCorrectly ? streak + 1 : 0),
      0
    )
  }
}
