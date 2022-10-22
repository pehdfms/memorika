import { FlashCard } from '../../entities/flash-card.entity'

export interface SchedulingStrategy {
  schedule(flashCard: FlashCard): Promise<Date>
}
